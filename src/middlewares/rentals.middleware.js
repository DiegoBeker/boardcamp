import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function validateRental(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        if (daysRented <= 0) return res.status(400).send("Days rented should be greater than 0");

        const customerExists = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId]);
        if (!customerExists.rows[0]) return res.status(400).send("Customer does not exist");

        const gameExists = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
        if (!gameExists.rows[0]) return res.status(400).send("Game does not exist");

        const currentRentedGames = await db.query(`
            SELECT * 
            FROM rentals 
            WHERE "gameId"=$1 AND "returnDate" IS NULL; 
        `, [gameId]);

        const stock = gameExists.rows[0].stockTotal;

        if (!(currentRentedGames.rowCount < stock)) return res.status(400).send("Game is not on stock");

        const pricePerDay = gameExists.rows[0].pricePerDay;
        res.locals.pricePerDay = pricePerDay;

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function validateCloseRental(req, res, next) {
    const { id } = req.params;

    try {
        const rentalExists = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);

        if (!rentalExists.rows[0])
            return res.status(404).send("Rental not found");
        else if (rentalExists.rows[0].returnDate !== null)
            return res.status(400).send("Rental already returned");

        const now = dayjs();
        const { daysRented, rentDate, originalPrice } = rentalExists.rows[0];
        const lateDays = now.diff(rentDate, "days") - daysRented;
        const pricePerDay = originalPrice / daysRented;
        const delayFee = lateDays > 0 ? pricePerDay * lateDays : null;

        res.locals.now = now;
        res.locals.delayFee = delayFee;

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function validateDeleteRental(req, res, next) {
    const { id } = req.params;
    try {
        const rentalExists = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);

        if (!rentalExists.rows[0])
            return res.status(404).send("Rental not found");
        else if (rentalExists.rows[0].returnDate === null)
            return res.status(400).send("Rental is currently open");

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}
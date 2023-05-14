import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
            SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
            FROM rentals
            JOIN customers ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId";
        `);
        const result = rentals.rows.map((r) => {
            const customer = { id: r.customerId, name: r.customerName };
            const game = { id: r.gameId, name: r.gameName };
            delete r.gameName;
            delete r.customerName;
            return { ...r, customer, game };
        })

        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postRental(req, res) {
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

        if (!(currentRentedGames.rowCount < stock))
            return res.status(400).send("Game is not on stock");

        const pricePerDay = gameExists.rows[0].pricePerDay;
        await db.query(`
            INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES
            ($1, $2, NOW(), $3, null, $4, null);
        `, [customerId, gameId, daysRented, (daysRented * pricePerDay)]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
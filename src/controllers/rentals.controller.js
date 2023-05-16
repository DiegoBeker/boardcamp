import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
    const { customerId, gameId, limit, offset, order, desc } = req.query;
    try {
        let rentals = {};
        if (customerId || gameId) {
            if (customerId) {
                const queryResult = await db.query(`
                    SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
                    FROM rentals
                    JOIN customers ON customers.id = rentals."customerId"
                    JOIN games ON games.id = rentals."gameId"
                    WHERE "customerId"=$1
                    LIMIT $2 OFFSET $3;;
                `, [customerId, limit, offset]);
                rentals = { ...queryResult };
            }
            if (gameId) {
                const queryResult = await db.query(`
                    SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
                    FROM rentals
                    JOIN customers ON customers.id = rentals."customerId"
                    JOIN games ON games.id = rentals."gameId"
                    WHERE "gameId"=$1
                    LIMIT $2 OFFSET $3;
                `, [gameId, limit, offset]);
                rentals = { ...queryResult };
            }
        } else {
            if (order) {
                const queryResult = await db.query(`
                    SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
                    FROM rentals
                    JOIN customers ON customers.id = rentals."customerId"
                    JOIN games ON games.id = rentals."gameId"
                    ORDER BY "${order}" ${desc ? "DESC" : "ASC"}
                    LIMIT $1 OFFSET $2;
                `, [limit, offset]);
                rentals = { ...queryResult };
            } else {
                const queryResult = await db.query(`
                    SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
                    FROM rentals
                    JOIN customers ON customers.id = rentals."customerId"
                    JOIN games ON games.id = rentals."gameId"
                    LIMIT $1 OFFSET $2;
                `, [limit, offset]);
                rentals = { ...queryResult };
            }
        }

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
    const { pricePerDay } = res.locals;
    try {
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

export async function closeRental(req, res) {
    const { id } = req.params;
    const { now, delayFee } = res.locals;

    try {
        await db.query(`
            UPDATE rentals 
            SET "returnDate"=$1, "delayFee"=$2
            WHERE id=$3
        `, [now.format("YYYY-MM-DD"), delayFee, id]);

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        await db.query(`
                DELETE FROM rentals
                WHERE id=$1
            `, [id]);
            
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
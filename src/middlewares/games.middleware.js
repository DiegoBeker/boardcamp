import { db } from "../database/database.connection.js";


export async function validateGame(req, res, next) {
    const {name} = req.body;

    const nameExists = await db.query(`SELECT * FROM games WHERE name=$1`, [name]);
    if (nameExists.rows[0]) return res.status(409).send("Game already exists");

    next();
}
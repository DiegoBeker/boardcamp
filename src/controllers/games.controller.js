import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
    const { name } = req.query;
    
    try {
        const games = name 
            ? await db.query(`SELECT * FROM games WHERE LOWER(name) LIKE $1`, [`${name.toLowerCase()}%`])
            : await db.query(`SELECT * FROM games`);
        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function postGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    const nameExists = await db.query(`SELECT * FROM games WHERE name=$1`, [name]);
    if (nameExists.rows[0]) return res.status(409).send("Game already exists");

    await db.query(`
        INSERT INTO games (name, image, "stockTotal", "pricePerDay")
        VALUES ($1, $2, $3, $4);
    `, [name, image, stockTotal, pricePerDay]);
    res.sendStatus(201);
}
import { db } from "../database/database.connection.js";

export async function validateCpf(req, res, next) {
    const { cpf } = req.body;
    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (customerExists.rows[0]) return res.status(409).send("This cpf already exists");

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }

}

export async function validateCustomerId(req, res, next) {
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);
        if (!customer.rows[0]) return res.sendStatus(404);

        res.locals.customer = customer;
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function validateUpdateCustomer(req, res, next) {
    const { cpf } = req.body;
    const { id } = req.params;
    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);

        if (cpfExists.rows[0] && cpfExists.rows[0].id !== Number(id)) return res.sendStatus(409);

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}


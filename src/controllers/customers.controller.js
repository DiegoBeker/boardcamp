import dayjs from "dayjs";
import { db } from "../database/database.connection.js"

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (customerExists.rows[0]) return res.status(409).send("This cpf already exists");

        await db.query(`
            INSERT INTO customers (name,phone,cpf,birthday)
            VALUES ($1,$2,$3,$4);
        `, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomers(req, res) {
    const { cpf, limit, offset } = req.query;
    try {
        const customers = cpf
            ? await db.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [`${cpf}%`])
            : await db.query(`SELECT * FROM customers LIMIT $1 OFFSET $2;`, [limit, offset]);

        const result = customers.rows.map((c) => {
            const birthday = dayjs(c.birthday).format("YYYY-MM-DD");
            return { ...c, birthday };
        });
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);

        if (!customer.rows[0]) res.sendStatus(404);

        const result = { ...customer.rows[0], birthday: dayjs(customer.rows[0].birthday).format("YYYY-MM-DD") }

        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);

        if (cpfExists.rows[0] && cpfExists.rows[0].id != id) return res.sendStatus(409);

        await db.query(`
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5;
        `, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
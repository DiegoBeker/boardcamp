import dayjs from "dayjs";
import { db } from "../database/database.connection.js"

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
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
    const { cpf, limit, offset, order, desc } = req.query;
    try {
        let customers;
        if (order) {
            const customersQuery = await db.query(`
                    SELECT * 
                    FROM customers
                    ORDER BY "${order}" ${desc ? "DESC" : "ASC"}
                    LIMIT $1 OFFSET $2;
            `, [limit, offset]);
            customers = { ...customersQuery }
        } else {
            const customersQuery = cpf
                ? await db.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [`${cpf}%`])
                : await db.query(`
                    SELECT * 
                    FROM customers
                    LIMIT $1 OFFSET $2;
            `, [limit, offset]);

            customers = { ...customersQuery };
        }

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
    const { customer } = res.locals;
    try {
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
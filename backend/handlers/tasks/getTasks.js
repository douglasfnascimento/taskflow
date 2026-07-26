import { sendResponse } from "../../utils/sendResponse.js";
import pool from "../../src/db.js";

export async function getTasks(req, res) {
    try {
        const { rows } = await pool.query('SELECT * FROM tasks');

        sendResponse(res, { data: rows });
    } catch (err) {
        sendResponse(res, {
            statusCode: 500,
            data: { message: "Erro ao buscar tarefas no banco de dados." }
        });
        console.error(err);
    }
}

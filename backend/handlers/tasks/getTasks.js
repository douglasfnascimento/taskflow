import { sendResponse } from "../../utils/sendResponse.js";
import pool from "../../src/db.js";

export async function getTasks(req, res) {
    try {
        const userId = req.user.id;
        const { rows } = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);

        sendResponse(res, { data: rows });
    } catch (err) {
        sendResponse(res, {
            statusCode: 500,
            data: { message: "Erro ao buscar tarefas no banco de dados." }
        });
        console.error(err);
    }
}

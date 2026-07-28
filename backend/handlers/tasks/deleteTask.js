import pool from "../../src/db.js";
import { sendResponse } from "../../utils/sendResponse.js";

export async function deleteTask(req, res, id) {
    if (!id) {
        return sendResponse(res, { statusCode: 400, data: { "message": "Task id is required" } });
    }

    try {
        const userId = req.user.id;
        const query = `
            DELETE FROM tasks
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id, userId]);

        if (rows.length === 0) {
            return sendResponse(res, { statusCode: 404, data: { "message": "Task doesn't exist" } });
        }

        return sendResponse(res, { data: rows[0] });
    } catch (err) {
        console.error(err);
        return sendResponse(res, { statusCode: 500, data: { message: "Erro ao excluir tarefa no banco." } });
    }
}
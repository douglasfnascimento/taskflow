import pool from "../../src/db.js";
import { parseJSONBody } from "../../utils/parseJSONBody.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { validateTaskData } from "../../utils/validateTaskData.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

export async function updateTask(req, res, id) {
    if (!id) {
        return sendResponse(res, { statusCode: 400, data: { "message": "Task id is required" } });
    }

    let body;
    try {
        body = await parseJSONBody(req);
    } catch (err) {
        return sendResponse(res, { statusCode: 400, data: { "message": "Invalid JSON format" } });
    }

    let finalData;
    try {
        finalData = sanitizeInput(validateTaskData(body));
    } catch (err) {
        return sendResponse(res, { statusCode: 400, data: { "message": err.message } });
    }

    try {
        const userId = req.user.id;
        const query = `
            UPDATE tasks
            SET title = $1, description = $2, priority = $3, status = $4, tags = $5, "dueDate" = $6
            WHERE id = $7 AND user_id = $8
            RETURNING *
        `;
        const values = [
            finalData.title,
            finalData.description || null,
            finalData.priority,
            finalData.status || 'todo',
            finalData.tags || [],
            finalData.dueDate || null,
            id,
            userId
        ];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return sendResponse(res, { statusCode: 404, data: { "message": "Task not found" } });
        }

        return sendResponse(res, { data: rows[0] });
    } catch (err) {
        console.error(err);
        return sendResponse(res, { statusCode: 500, data: { "message": "Erro ao atualizar tarefa no banco." } });
    }
}
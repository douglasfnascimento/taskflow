import { parseJSONBody } from "../../utils/parseJSONBody.js";
import { validateTaskData } from "../../utils/validateTaskData.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import { generateId } from "../../utils/generateId.js";
import { sendResponse } from "../../utils/sendResponse.js";
import pool from "../../src/db.js";

export async function createTask(req, res) {
    try {
        const parsedBody = await parseJSONBody(req);
        const data = sanitizeInput(validateTaskData(parsedBody));

        const userId = req.user.id;

        const query = `
            INSERT INTO tasks (id, title, description, priority, status, tags, "dueDate", user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const values = [
            generateId(),
            data.title,
            data.description || null,
            data.priority,
            data.status || 'todo',
            data.tags || [],
            data.dueDate || null,
            userId
        ];


        const { rows } = await pool.query(query, values);
        const newTask = rows[0];

        sendResponse(res, { statusCode: 201, data: newTask });
    } catch (err) {
        sendResponse(res, { statusCode: 400, data: { message: err.message } });
        console.error(err);
    }
}

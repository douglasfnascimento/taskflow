import { parseJSONBody } from "../../utils/parseJSONBody.js";
import { validateTaskData } from "../../utils/validateTaskData.js"
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import { generateId } from "../../utils/generateId.js";
import { getData } from "../../utils/getData.js";
import { saveData } from "../../utils/saveData.js";
import { sendResponse } from "../../utils/sendResponse.js";


export async function createTask(req, res) {
    try {
        const parsedBody = await parseJSONBody(req)
        const data = sanitizeInput(validateTaskData(parsedBody))
        const createdAt = new Date().toISOString()
        const newTask = { ...data, createdAt, id: generateId() }

        const tasks = await getData()
        tasks.push(newTask)
        await saveData(tasks)

        sendResponse(res, { statusCode: 201, data: newTask })
    } catch (err) {
        sendResponse(res, { statusCode: 400, data: { message: err.message } })
    }
}
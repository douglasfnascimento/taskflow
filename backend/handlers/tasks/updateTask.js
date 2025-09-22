import { getData } from "../../utils/getData.js";
import { parseJSONBody } from "../../utils/parseJSONBody.js";
import { saveData } from "../../utils/saveData.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { validateTaskData } from "../../utils/validateTaskData.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";



export async function updateTask(req, res, id) {

    if (!id) {
        return sendResponse(res, { statusCode: 400, data: { "message": "Task id is required" } })
    }

    const tasks = await getData()
    const task = tasks.find(task => task.id === id)

    if (!task) {
        return sendResponse(res, { statusCode: 404, data: { "message": "Task not found" } })
    }

    let body

    try {
        body = await parseJSONBody(req)
    } catch (err) {
        return sendResponse(res, { statusCode: 400, data: { "message": "Invalid JSON format" } })
    }

    let finalData

    try {
        finalData = sanitizeInput(validateTaskData(body))
    } catch (err) {
        return sendResponse(res, { statusCode: 400, data: { "message": err.message } })
    }

    const index = tasks.findIndex(task => task.id === id)
    tasks[index] = { ...finalData, id: task.id, createdAt: task.createdAt }
    saveData(tasks)

    return sendResponse(res, { data: tasks[index] })
}
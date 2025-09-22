import { getData } from "../../utils/getData.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { saveData } from "../../utils/saveData.js";

export async function deleteTask(req, res, id) {

    if (!id) {
        return sendResponse(res, { statusCode: 400, data: { "message": "Task id is required" } })
    }


    let tasks

    try {
        tasks = await getData()
    } catch (err) {
        return sendResponse(res, { statusCode: 500, data: { message: "Internal server error" } })
    }


    const task = tasks.find(task => task.id === id)

    if (!task) {
        return sendResponse(res, { statusCode: 404, data: { "message": "Task doesn't exist" } })
    }

    const newTasks = tasks.filter(task => task.id !== id)

    try {
        await saveData(newTasks)
    } catch (err) {
        return sendResponse(res, { statusCode: 500, data: { message: "Internal server error" } })
    }

    sendResponse(res, { data: task })
}
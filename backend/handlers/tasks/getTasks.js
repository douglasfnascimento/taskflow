import { sendResponse } from "../../utils/sendResponse.js"
import { getData } from "../../utils/getData.js"

export async function getTasks(req, res) {
    const data = await getData()
    sendResponse(res, { data: data })
}
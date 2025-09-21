import { getFilePath } from "./getFilePath.js";
import fs from "node:fs/promises"

export async function saveData(newData) {

    try {
        const filePath = getFilePath('../data/tasks.json')
        await fs.writeFile(
            filePath,
            JSON.stringify(newData, null, 2),
            'utf-8'
        )
    } catch (err) {
        throw err
    }

}
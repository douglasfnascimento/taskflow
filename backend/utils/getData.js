import fs from 'node:fs/promises'
//import path from 'node:path'
import { fileURLToPath } from 'node:url'

const tasksFileUrl = new URL('../data/tasks.json', import.meta.url)

export async function getData() {
    try {
        const tasksFilePath = fileURLToPath(tasksFileUrl)
        const data = await fs.readFile(tasksFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        throw err
    }
}
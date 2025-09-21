import fs from 'node:fs/promises'
import { getFilePath } from './getFilePath.js'

export async function getData() {
    try {
        const tasksFilePath = getFilePath('../data/tasks.json')
        const data = await fs.readFile(tasksFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        throw err
    }
}
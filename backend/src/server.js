import { createServer } from 'node:http'
import { sendResponse } from '../utils/sendResponse.js'
import { getTasks } from '../handlers/tasks/getTasks.js'
import { createTask } from '../handlers/tasks/createTask.js'

const port = 8000

const server = createServer(async (req, res) => {
    if (req.url === '/tasks' && req.method === 'GET') {
        await getTasks(req, res)
    } else if (req.url === '/tasks' && req.method === 'POST') {
        await createTask(req, res)
    } else if (req.method === 'OPTIONS') {
        sendResponse(res, 204)
    } else {
        sendResponse(res, 404, { message: 'Not found' })
    }
})

server.listen(port, () => console.log(`Server running at port ${port}`))
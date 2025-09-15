import { createServer } from 'node:http'
import { sendResponse } from '../utils/sendResponse.js'
import { getTasks } from '../handlers/tasks/getTasks.js'

const port = 8000

const server = createServer(async (req, res) => {

    if (req.url === '/tasks' && req.method === 'GET') {
        getTasks(req, res)
    } else if (req.method === 'OPTIONS') {
        sendResponse(res, 204)
    }

})

server.listen(port, () => console.log(`Server running at port ${port}`))
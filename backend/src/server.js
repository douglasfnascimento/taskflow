import { createServer } from 'node:http'
import { sendResponse } from '../utils/sendResponse.js'
import { getTasks } from '../handlers/tasks/getTasks.js'
import { createTask } from '../handlers/tasks/createTask.js'
import { updateTask } from '../handlers/tasks/updateTask.js'
import { deleteTask } from '../handlers/tasks/deleteTask.js'
import { register, login } from '../handlers/auth/auth.js'
import { authenticate } from '../utils/authMiddleware.js'



const port = 8000

const server = createServer(async (req, res) => {
    // CORS pré-flight
    if (req.method === 'OPTIONS') {
        return sendResponse(res, { statusCode: 204 })
    }

    // Rotas públicas (Autenticação e Health Check)
    if (req.url === '/health' && (req.method === 'GET' || req.method === 'HEAD')) {
        return sendResponse(res, { statusCode: 200, data: { status: 'ok' } })
    } else if (req.url === '/auth/register' && req.method === 'POST') {
        return await register(req, res)
    } else if (req.url === '/auth/login' && req.method === 'POST') {
        return await login(req, res)
    }

    // Proteger rotas privadas
    if (req.url.startsWith('/tasks')) {
        try {
            await authenticate(req, res);
        } catch (error) {
            return; // O middleware já envia a resposta de erro
        }

        if (req.url === '/tasks' && req.method === 'GET') {
            return await getTasks(req, res)
        } else if (req.url === '/tasks' && req.method === 'POST') {
            return await createTask(req, res)
        } else if (req.url.startsWith('/tasks/') && req.method === 'PUT') {
            const id = req.url.split('/')[2]
            return await updateTask(req, res, id)
        } else if (req.url.startsWith('/tasks/') && req.method === 'DELETE') {
            const id = req.url.split('/')[2]
            return await deleteTask(req, res, id)
        }
    }

    sendResponse(res, { statusCode: 404, data: { message: 'Not found' } })
})


server.listen(port, () => console.log(`Server running at port ${port}`))
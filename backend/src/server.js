import { createServer } from 'http'

const port = 8000
const server = createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    res.end(JSON.stringify({ message: 'Servidor rodando com sucesso!' }))
})

server.listen(port, () => console.log(`Server running at port ${port}`))
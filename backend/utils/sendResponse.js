export async function sendResponse(res, { statusCode = 200, data = {}, contentType = "application/json" } = {}) {
    // mudar os parametros futuramente e colocar data e contentType como um objeto opcional
    const response = data || {}
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Content-Type', contentType || 'application/json')
    res.statusCode = statusCode
    res.end(JSON.stringify(response))
}
export async function sendResponse(res, statusCode, data, contentType) {
    const response = data || {}
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', contentType || 'application/json')
    res.statusCode = statusCode
    res.end(JSON.stringify(response))
}
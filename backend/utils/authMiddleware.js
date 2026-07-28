import jwt from 'jsonwebtoken';
import { sendResponse } from './sendResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-portfolio';

export function authenticate(req, res) {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            sendResponse(res, { statusCode: 401, data: { message: "Token de autenticação não fornecido." } });
            return reject(new Error("No token"));
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded; // { id, username, ... }
            resolve(decoded);
        } catch (err) {
            sendResponse(res, { statusCode: 401, data: { message: "Token de autenticação inválido ou expirado." } });
            reject(new Error("Invalid token"));
        }
    });
}

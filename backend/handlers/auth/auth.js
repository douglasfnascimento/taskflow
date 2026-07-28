import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../src/db.js';
import { sendResponse } from '../../utils/sendResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-portfolio';

// Auxiliar para pegar o corpo da requisição JSON
const getJsonBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
    });
};

export async function register(req, res) {
    try {
        const { username, password } = await getJsonBody(req);

        if (!username || !password) {
            return sendResponse(res, { statusCode: 400, data: { message: "Usuário e senha são obrigatórios." } });
        }

        // Verifica se o usuário já existe
        const { rows: existingUsers } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existingUsers.length > 0) {
            return sendResponse(res, { statusCode: 409, data: { message: "Nome de usuário já existe." } });
        }

        // Hash da senha
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insere o usuário
        const insertQuery = `
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
            RETURNING id, username
        `;
        const { rows: newUser } = await pool.query(insertQuery, [username, passwordHash]);

        sendResponse(res, { statusCode: 201, data: { message: "Usuário criado com sucesso!", user: newUser[0] } });
    } catch (err) {
        console.error(err);
        sendResponse(res, { statusCode: 500, data: { message: "Erro interno no servidor ao registrar usuário." } });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = await getJsonBody(req);

        if (!username || !password) {
            return sendResponse(res, { statusCode: 400, data: { message: "Usuário e senha são obrigatórios." } });
        }

        // Busca o usuário
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = rows[0];

        if (!user) {
            return sendResponse(res, { statusCode: 401, data: { message: "Credenciais inválidas." } });
        }

        // Verifica a senha
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return sendResponse(res, { statusCode: 401, data: { message: "Credenciais inválidas." } });
        }

        // Gera o JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' } // Token válido por 7 dias
        );

        sendResponse(res, { data: { token, user: { id: user.id, username: user.username } } });
    } catch (err) {
        console.error(err);
        sendResponse(res, { statusCode: 500, data: { message: "Erro interno no servidor ao fazer login." } });
    }
}

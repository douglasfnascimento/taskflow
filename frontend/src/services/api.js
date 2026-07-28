const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Função auxiliar para pegar os headers com o token
function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
}

export async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Falha no login");
        return data;
    } catch (err) {
        throw new Error(err.message || "Erro de conexão");
    }
}

export async function register(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Falha no registro");
        return data;
    } catch (err) {
        throw new Error(err.message || "Erro de conexão");
    }
}

export async function getTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: getHeaders()
        })
        if (response.status === 401) {
            throw new Error('Não autorizado. Faça login novamente.');
        }
        if (!response.ok) {
            throw new Error('Falha ao buscar tasks')
        }
        return await response.json()
    } catch (err) {
        if (err.message) {
            return ({ message: err.message })
        } else {
            throw new Error(err.message || "Não foi possível conectar ao servidor")
        }
    }
}

export async function createTask(task) {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(task),
        });

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message || "Falha ao enviar task");
        }

        return data;

    } catch (err) {
        throw new Error(err.message || "Não foi possível conectar ao servidor");
    }
}

export async function editTask(taskId, updatedTask) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(updatedTask)
            })

        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.message || "Falha ao editar task");
        }

        return data;
    } catch (err) {
        throw new Error(err.message || "Não foi possível conectar ao servidor")
    }
}

export async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        )
        if (!response.ok) {
            // Tratamento simplificado
            throw new Error("Erro ao deletar tarefa")
        }
    } catch (err) {
        throw new Error(err.message || "Não foi possível conectar ao servidor")
    }
}
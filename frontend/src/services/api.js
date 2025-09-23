export async function getTasks() {
    try {
        const response = await fetch('http://localhost:8000/tasks')
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
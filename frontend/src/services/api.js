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

export async function createTask(task) {
    try {
        const response = await fetch("http://localhost:8000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new Error("Falha ao enviar task");
        }

        return await response.json();
    } catch (err) {
        throw new Error(err.message || "Não foi possível conectar ao servidor");
    }
}

export async function editTask(taskId, updatedTask) {
    try {
        const response = await fetch(`http://localhost:8000/tasks/${taskId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
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
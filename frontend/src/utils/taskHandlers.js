import { deleteTask } from "../services/api.js";


export async function handleDelete(task, fetchTasks, showToast) {
    try {
        await deleteTask(task.id);
        await fetchTasks();
        showToast("Tarefa deletada com sucesso!", "success");
    } catch (err) {
        showToast(`Falha ao deletar a tarefa: ${err}`, "erro");
    }
}
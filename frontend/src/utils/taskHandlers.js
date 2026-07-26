import { deleteTask, editTask } from "../services/api.js";


export async function handleDelete(task, fetchTasks, showToast) {
    try {
        await deleteTask(task.id);
        await fetchTasks();
        showToast("Tarefa deletada com sucesso!", "success");
    } catch (err) {
        showToast(`Falha ao deletar a tarefa: ${err}`, "erro");
    }
}

export async function handleQuickStatus(task, newStatus, fetchTasks, showToast) {
    try {
        await editTask(task.id, { ...task, status: newStatus });
        await fetchTasks();
        showToast(`Status atualizado para ${newStatus === "doing" ? "Fazendo" : "Concluída"}!`, "success");
    } catch (err) {
        showToast(`Falha ao atualizar o status: ${err}`, "erro");
    }
}
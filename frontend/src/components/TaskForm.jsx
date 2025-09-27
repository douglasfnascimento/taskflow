import clsx from "clsx";
import { createTask, editTask } from "../services/api.js";
import { ChevronDown } from "lucide-react";

export default function TaskForm({
  mode,
  fetchTasks,
  closeModal,
  showToast,
  selectedTask,
}) {
  const formattedDate =
    mode === "edit" && selectedTask?.dueDate
      ? new Date(selectedTask.dueDate).toISOString().slice(0, 10)
      : "";

  const toastMessage = () => {
    if (mode === "create") {
      return "Tarefa criada com sucesso!";
    } else if (mode === "edit") {
      return "Tarefa editada com sucesso!";
    }
  };

  function prepareTaskData(formData) {
    const taskObject = {
      ...Object.fromEntries(formData),
      priority: Number(formData.get("priority")),
    };

    if (
      !taskObject.title ||
      taskObject.priority < 1 ||
      taskObject.priority > 3
    ) {
      throw new Error("Dados inválidos.");
    }

    return taskObject;
  }

  async function handleSubmit(formData) {
    try {
      const taskObject = prepareTaskData(formData);
      if (mode === "create") {
        await createTask(taskObject);
      } else if (mode === "edit") {
        await editTask(selectedTask.id, taskObject);
      }
      fetchTasks();
      closeModal();
      showToast(toastMessage(), "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <section>
      <form action={handleSubmit} className="flex flex-col gap-6 text-gray-700">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-semibold text-blue-800">
            Título <span className="text-red-700">*</span>
          </label>
          <input
            required
            id="title"
            type="text"
            name="title"
            placeholder="Adicione um título"
            className="border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={mode === "edit" ? selectedTask?.title : ""}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold text-blue-800">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Escreva uma descrição (opcional)"
            rows={4}
            defaultValue={mode === "edit" ? selectedTask?.description : ""}
            className="resize-none border border-gray-300 rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="font-semibold text-blue-800">Prioridade</legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value={1}
                defaultChecked={
                  mode === "create" || selectedTask?.priority === 1
                }
                className="accent-green-600"
              />
              Baixa
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value={2}
                className="accent-orange-400"
                defaultChecked={selectedTask?.priority === 2}
              />
              Média
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="priority"
                value={3}
                className="accent-red-600"
                defaultChecked={selectedTask?.priority === 3}
              />
              Alta
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="font-semibold text-blue-800">
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              id="status"
              defaultValue={mode === "create" ? "todo" : selectedTask?.status}
              disabled={mode === "create"}
              className={clsx(
                "border border-gray-300 rounded-xl px-4 py-2 focus:outline-none appearance-none w-full pr-10",
                mode === "create" && "bg-gray-100 text-gray-500"
              )}
            >
              <option value="todo">A fazer</option>
              <option value="doing">Fazendo</option>
              <option value="done">Concluída</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="dueDate" className="font-semibold text-blue-800">
            Prazo
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            defaultValue={formattedDate}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-500 cursor-pointer transition-colors self-end"
        >
          Salvar
        </button>
      </form>
    </section>
  );
}

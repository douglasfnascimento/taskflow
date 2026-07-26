import clsx from "clsx";
import { createTask, editTask } from "../services/api.js";
import { ChevronDown, X, Calendar, Check, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "./Button.jsx";

export default function TaskForm({
  mode,
  fetchTasks,
  closeModal,
  showToast,
  selectedTask,
}) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [titleError, setTitleError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(
    mode === "create" ? "todo" : selectedTask?.status || "todo"
  );

  useEffect(() => {
    if (mode === "edit" && selectedTask) {
      setTags([...selectedTask.tags]);
    }
  }, [mode, selectedTask]);

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
      tags: tags,
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
    const title = formData.get("title");
    if (!title.trim()) {
      setTitleError("O título é obrigatório");
      return;
    } else {
      setTitleError("");
    }

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

  function handleTags(tag) {
    if (!tag.trim()) return;
    if (tags.includes(tag.trim())) return; // Evitar tags duplicadas
    if (tags.length >= 5) return;

    setTags((prevTags) => [...prevTags, tag.trim()]);
    setInputValue("");
  }

  return (
    <section>
      <form action={handleSubmit} className="flex flex-col gap-5 text-gray-700">
        {/* Título */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-semibold text-gray-700">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Adicione um título para a tarefa"
            className="w-full h-10 bg-white border border-gray-300 rounded-xl px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-sm"
            defaultValue={mode === "edit" ? selectedTask?.title : ""}
            onChange={() => {
              setTitleError("");
            }}
          />
          {titleError !== "" && (
            <p className="text-xs text-red-500 mt-1">{titleError}</p>
          )}
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-semibold text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Escreva uma descrição (opcional)"
            rows={3}
            defaultValue={mode === "edit" ? selectedTask?.description : ""}
            className="resize-none w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-sm"
          />
        </div>

        {/* Prioridade */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-gray-700 mb-1">Prioridade</legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer font-medium">
              <input
                type="radio"
                name="priority"
                value={1}
                defaultChecked={
                  mode === "create" || selectedTask?.priority === 1
                }
                className="accent-green-600 w-4 h-4 cursor-pointer"
              />
              Baixa
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer font-medium">
              <input
                type="radio"
                name="priority"
                value={2}
                className="accent-orange-500 w-4 h-4 cursor-pointer"
                defaultChecked={selectedTask?.priority === 2}
              />
              Média
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer font-medium">
              <input
                type="radio"
                name="priority"
                value={3}
                className="accent-red-600 w-4 h-4 cursor-pointer"
                defaultChecked={selectedTask?.priority === 3}
              />
              Alta
            </label>
          </div>
        </fieldset>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-semibold text-gray-700">
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={mode === "create"}
              className={clsx(
                "h-10 border border-gray-300 rounded-xl px-4 focus:outline-none appearance-none w-full pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm shadow-sm cursor-pointer",
                mode === "create" && "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-none"
              )}
            >
              <option value="todo">A fazer</option>
              <option value="doing">Fazendo</option>
              <option value="done">Concluída</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Prazo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">
            Prazo
          </label>
          <div className="relative">
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              defaultValue={formattedDate}
              disabled={selectedStatus === "done"}
              className={clsx(
                "h-10 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none w-full pr-10 text-sm shadow-sm cursor-pointer text-gray-700",
                selectedStatus === "done" && "bg-gray-100 text-gray-400 opacity-70 cursor-not-allowed"
              )}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className="text-sm font-semibold text-gray-700">
            Tags
          </label>

          <input
            id="tags"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "," || e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleTags(inputValue);
              }
            }}
            placeholder={tags.length >= 5 ? "Máximo de 5 tags atingido" : "Adicione tags separando por vírgula, enter ou espaço"}
            className={clsx(
              "h-10 border border-gray-300 rounded-xl px-4 focus:outline-none w-full text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all",
              tags.length >= 5 && "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-none"
            )}
            disabled={tags.length >= 5}
          />
          {tags.length >= 5 && (
            <p className="text-xs text-red-500 mt-1">
              Máximo de 5 tags atingido
            </p>
          )}

          {/* Listagem de Tags no Form */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 flex items-center gap-1.5 shadow-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setTags((prevTags) =>
                      prevTags.filter((_, i) => i !== index)
                    )
                  }
                  className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-red-500 hover:text-white transition-all text-xs cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Botão Salvar / Adicionar */}
        <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
          <div className="w-max">
            <Button
              type="submit"
              text={mode === "create" ? "Adicionar" : "Salvar"}
              Icon={mode === "create" ? Plus : Check}
              color="blue"
            />
          </div>
        </div>
      </form>
    </section>
  );
}

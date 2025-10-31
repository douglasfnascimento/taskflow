import { Calendar, Pencil, Trash, Loader2 } from "lucide-react";
import Button from "./Button";
import { handleDelete } from "../utils/taskHandlers";
import { useState } from "react";
import { priorityMap, statusMap } from "../utils/constants.js";

export function TaskView({
  selectedTask,
  fetchTasks,
  showToast,
  closeModal,
  onEdit,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function onDelete() {
    setIsDeleting(true);
    try {
      await handleDelete(selectedTask, fetchTasks, showToast);
      closeModal();
    } catch (err) {
      showToast(`Erro ao apagar a tarefa: ${err}`, "error");
    } finally {
      setIsDeleting(false);
    }
  }

  let formattedDate, formattedTime;

  if (selectedTask.createdAt) {
    const date = new Date(selectedTask.createdAt);

    formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    formattedTime = date
      .toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(":", "h");
  }

  let dueDateFormatted,
    isLate = false;
  if (selectedTask.dueDate) {
    const dueDate = new Date(selectedTask.dueDate);
    isLate = dueDate.getTime() < new Date().getTime();

    if (!isLate) {
      const weekday = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
      }).format(dueDate);
      const dayMonth = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }).format(dueDate);
      dueDateFormatted = `${weekday}, ${dayMonth}`;
    } else {
      dueDateFormatted = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }).format(dueDate);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {dueDateFormatted && (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            isLate ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          {isLate ? dueDateFormatted : `Entregar ${dueDateFormatted}`}
          {isLate && " (atrasado)"}
        </span>
      )}
      <p className="text-gray-500 text-sm mt-1">
        Criada em {formattedDate}, às {formattedTime}
      </p>
      {selectedTask.description && (
        <p className="text-xl text-gray-600 mt-2">{selectedTask.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {selectedTask.priority && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              priorityMap[selectedTask.priority].bg
            } ${priorityMap[selectedTask.priority].text}`}
          >
            {priorityMap[selectedTask.priority].label}
          </span>
        )}

        {selectedTask.status && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {statusMap[selectedTask.status].label}
          </span>
        )}

        {selectedTask.tags &&
          selectedTask.tags.length > 0 &&
          selectedTask.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
            >
              {tag}
            </span>
          ))}
      </div>
      <div className="flex gap-3 justify-end">
        <div className="w-max">
          <Button
            onClick={onDelete}
            text={isDeleting ? "Apagando..." : "Apagar"}
            Icon={isDeleting ? Loader2 : Trash}
            color="red"
            disabled={isDeleting}
          />
        </div>
        <div className="w-max">
          <Button
            onClick={() => {
              onEdit(selectedTask);
            }}
            text="Editar"
            Icon={Pencil}
            color="blue"
          />
        </div>
      </div>
    </div>
  );
}

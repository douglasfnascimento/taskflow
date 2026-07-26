import { Calendar, Pencil, Trash, Loader2, Clock, Tag } from "lucide-react";
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
      {/* Barra de Metadados / Datas */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 pb-4 border-b border-gray-100">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          Criada em {formattedDate} às {formattedTime}
        </span>
        {dueDateFormatted && (
          <span
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border ${
              isLate
                ? "bg-red-50 text-red-700 border-red-100"
                : "bg-blue-50 text-blue-700 border-blue-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {isLate ? `${dueDateFormatted} (atrasada)` : `Entregar ${dueDateFormatted}`}
          </span>
        )}
      </div>

      {/* Descrição da Tarefa */}
      {selectedTask.description ? (
        <div className="py-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Descrição
          </h3>
          <p className="text-gray-700 leading-relaxed font-light text-base bg-gray-50/50 p-4 rounded-xl border border-gray-100/80">
            {selectedTask.description}
          </p>
        </div>
      ) : (
        <div className="py-2 text-gray-400 italic text-sm">
          Sem descrição disponível.
        </div>
      )}

      {/* Colunas de Status e Prioridade */}
      <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Status
          </h4>
          <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {statusMap[selectedTask.status].label}
          </span>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Prioridade
          </h4>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              priorityMap[selectedTask.priority].bg
            } ${priorityMap[selectedTask.priority].text}`}
          >
            {priorityMap[selectedTask.priority].label}
          </span>
        </div>
      </div>

      {/* Seção de Tags */}
      {selectedTask.tags && selectedTask.tags.length > 0 && (
        <div className="py-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedTask.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ações do Rodapé */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 mt-2">
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

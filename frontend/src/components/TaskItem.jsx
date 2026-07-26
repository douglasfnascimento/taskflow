import { Calendar, Trash, Pencil, Play, CheckCheck } from "lucide-react";
import { handleDelete, handleQuickStatus } from "../utils/taskHandlers";
import { priorityMap, statusMap } from "../utils/constants.js";

export default function TaskItem({
  task,
  onEdit,
  onView,
  fetchTasks,
  showToast,
  onChipClick,
}) {
  function Button({ onClick, ariaLabel, Icon, title, extraClass = "" }) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        title={title}
        className={`cursor-pointer p-2 rounded-xl bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-200 shadow-sm ${extraClass}`}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 mb-4 relative group">
      {/* Botões */}
      <div className="absolute top-6 right-6 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-white/80 backdrop-blur-sm p-1 rounded-xl">
        {task.status === "todo" && (
          <Button
            onClick={() => handleQuickStatus(task, "doing", fetchTasks, showToast)}
            ariaLabel="Começar tarefa"
            title="Começar tarefa"
            Icon={Play}
            extraClass="hover:!bg-orange-50 hover:!text-orange-600 hover:!border-orange-200"
          />
        )}
        {task.status === "doing" && (
          <Button
            onClick={() => handleQuickStatus(task, "done", fetchTasks, showToast)}
            ariaLabel="Concluir tarefa"
            title="Concluir tarefa"
            Icon={CheckCheck}
            extraClass="hover:!bg-green-50 hover:!text-green-600 hover:!border-green-200"
          />
        )}
        <Button
          onClick={() => onEdit(task)}
          ariaLabel="Editar tarefa"
          title="Editar tarefa"
          Icon={Pencil}
        />
        <Button
          onClick={() => {
            handleDelete(task, fetchTasks, showToast);
          }}
          ariaLabel="Deletar tarefa"
          title="Deletar tarefa"
          Icon={Trash}
          extraClass="hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200"
        />
      </div>

      {/* Data de entrega */}
      {task.dueDate &&
        (() => {
          const date = new Date(task.dueDate);
          const now = new Date();
          const isPast = date.getTime() < now.getTime();

          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "short",
          }).format(date);

          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full mb-3 text-xs font-semibold px-2.5 py-0.5 border ${
                isPast
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-blue-50 text-blue-700 border-blue-100"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate.replace(".", "").trim()}
            </span>
          );
        })()}

      {/* Título */}
      <h2
        onClick={() => onView(task)}
        className="text-gray-900 text-2xl mb-2 font-extrabold cursor-pointer hover:text-blue-600 transition-colors block w-fit tracking-tight"
      >
        {task.title}
      </h2>

      {/* Descrição */}
      {task.description && (
        <p className="text-gray-500 text-sm mb-4 font-normal leading-relaxed max-w-2xl">
          {task.description}
        </p>
      )}

      {/* Divisor Mudo */}
      <div className="h-px bg-gray-100 w-full my-4" />

      {/* Chips: prioridade, status, tags */}
      <div className="flex flex-wrap gap-2">
        {/* Prioridade */}
        {task.priority && (
          <button
            onClick={() => onChipClick?.("priority", priorityMap[task.priority].label.toLowerCase())}
            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-85 transition-opacity ${
              priorityMap[task.priority].bg
            } ${priorityMap[task.priority].text}`}
          >
            {priorityMap[task.priority].label}
          </button>
        )}

        {/* Status */}
        {task.status && (
          <button
            onClick={() => onChipClick?.("status", statusMap[task.status].label.toLowerCase())}
            className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 hover:text-blue-900 transition-colors"
          >
            {statusMap[task.status].label}
          </button>
        )}

        {/* Tags */}
        {task.tags &&
          task.tags.length > 0 &&
          task.tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => onChipClick?.("tags", tag)}
              className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 hover:text-gray-900 transition-colors"
            >
              {tag}
            </button>
          ))}
      </div>
    </div>
  );
}

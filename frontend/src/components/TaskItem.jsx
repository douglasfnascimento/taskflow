import { Clock, Trash, Pencil, Eye, Calendar } from "lucide-react";
import { handleDelete } from "../utils/taskHandlers";
import { priorityMap, statusMap } from "../utils/constants.js";

export default function TaskItem({
  task,
  onEdit,
  onView,
  fetchTasks,
  showToast,
}) {
  function Button({ onClick, ariaLabel, Icon }) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className="cursor-pointer p-1.5 rounded bg-blue-200 text-blue-800 hover:bg-blue-800 hover:text-white transition-colors"
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow mb-4 relative group">
      {/* Botões */}
      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <Button
          onClick={() => onEdit(task)}
          ariaLabel="Editar tarefa"
          Icon={Pencil}
        />
        <Button
          onClick={() => {
            handleDelete(task, fetchTasks, showToast);
          }}
          ariaLabel="Deletar tarefa"
          Icon={Trash}
        />
        <Button
          onClick={() => onView(task)}
          ariaLabel="Visualizar tarefa"
          Icon={Eye}
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
              className={`inline-flex items-center gap-1  rounded-full mb-3 text-sm font-medium ${
                isPast ? " text-red-800" : " text-blue-500"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {formattedDate.replace(".", "").trim()}
            </span>
          );
        })()}

      {/* Título */}
      <h2 className="text-blue-800 text-4xl mb-4 font-bold">{task.title}</h2>

      {/* Descrição */}
      {task.description && (
        <p className="text-xl my-4 text-gray-500 font-light">
          {task.description}
        </p>
      )}

      <hr className="border-t border-gray-300 rounded my-2 mb-5" />

      {/* Chips: prioridade, status, tags */}
      <div className="flex flex-wrap gap-2">
        {/* Prioridade */}
        {task.priority && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              priorityMap[task.priority].bg
            } ${priorityMap[task.priority].text}`}
          >
            {priorityMap[task.priority].label}
          </span>
        )}

        {/* Status */}
        {task.status && (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {statusMap[task.status].label}
          </span>
        )}

        {/* Tags */}
        {task.tags &&
          task.tags.length > 0 &&
          task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
            >
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
}

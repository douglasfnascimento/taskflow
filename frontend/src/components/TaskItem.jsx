import { Clock } from "lucide-react";
import clsx from "clsx";

export default function TaskItem({ task }) {
  const priorityMap = {
    1: "baixa",
    2: "média",
    3: "alta",
  };

  const priority = priorityMap[task.priority];

  const statusMap = {
    todo: "a fazer",
    doing: "fazendo",
    done: "concluída",
  };

  const status = statusMap[task.status];
  let formattedDate;

  if (task.dueDate) {
    const date = new Date(task.dueDate);

    formattedDate = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(date);
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow mb-4">
      <h2 className="text-blue-800 text-4xl mb-4 font-bold">{task.title}</h2>
      {task.dueDate && (
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-xl text-blue-500">
            {formattedDate.replace("de", "").replace(".", "").trim()}
          </span>
        </div>
      )}

      {task.description && (
        <p className="text-xl my-4 text-gray-500 font-light">
          {task.description}
        </p>
      )}
      <hr className="border-t border-gray-300 rounded my-2 mb-5" />
      <div className="flex items-center gap-3">
        {task.priority && (
          <span
            className={clsx(
              "text-xl border px-2 py-0.5 text-white rounded-xl w-max inline-block",
              task.priority === 1 && "bg-green-600 border-green-600",
              task.priority === 2 && "bg-orange-400 border-orange-400",
              task.priority === 3 && "bg-red-600 border-red-600"
            )}
          >
            {priority}
          </span>
        )}

        {task.status && (
          <span className="text-xl text-blue-500 border border-blue-500 px-2 py-0.5 rounded-xl w-max inline-block">
            {status}
          </span>
        )}

        {task.tags && (
          <div className="flex gap-3">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xl italic border px-2 py-0.5 text-white rounded-xl w-max inline-block bg-gray-400 border-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

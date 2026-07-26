import TaskForm from "./TaskForm";
import { X } from "lucide-react";
import { TaskView } from "./TaskView";

export default function TaskModal({
  isOpen,
  closeModal,
  mode,
  fetchTasks,
  showToast,
  selectedTask,
  onEdit,
}) {
  if (!isOpen) return null;

  const modalTitle =
    mode === "create"
      ? "Adicionar nova tarefa"
      : mode === "edit"
      ? "Editar tarefa"
      : mode === "view"
      ? selectedTask.title
      : "";

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 shadow-xl w-[600px]"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{modalTitle}</h1>
          <button
            onClick={closeModal}
            className="w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(mode === "edit" || mode === "create") && (
          <TaskForm
            mode={mode}
            fetchTasks={fetchTasks}
            closeModal={closeModal}
            showToast={showToast}
            selectedTask={selectedTask}
          />
        )}

        {mode === "view" && (
          <TaskView
            onEdit={onEdit}
            selectedTask={selectedTask}
            showToast={showToast}
            fetchTasks={fetchTasks}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
}

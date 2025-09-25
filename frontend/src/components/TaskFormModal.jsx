import TaskForm from "./TaskForm";
import { X } from "lucide-react";

export default function TaskFormModal({
  isOpen,
  closeModal,
  mode,
  fetchTasks,
  showToast,
}) {
  if (!isOpen) return null;

  const modalTitle =
    mode === "create"
      ? "Adicionar nova tarefa"
      : mode === "edit"
      ? "Editar tarefa"
      : mode === "view"
      ? "Detalhes da tarefa"
      : "";

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 shadow-xl w-[600px]"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-800">{modalTitle}</h1>
          <button
            onClick={closeModal}
            className="w-7 h-7 text-gray-500 hover:text-white hover:bg-blue-800 hover:rounded-2xl flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <TaskForm
          mode={mode}
          fetchTasks={fetchTasks}
          closeModal={closeModal}
          showToast={showToast}
        />
      </div>
    </div>
  );
}

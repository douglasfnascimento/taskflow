import { useState } from "react";
import { useEffect } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { getTasks } from "./services/api.js";
import TaskControls from "./components/TaskControls.jsx";
import TaskFormModal from "./components/TaskFormModal.jsx";
import Toast from "./components/Toast.jsx";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  async function fetchTasks() {
    setLoading(true);
    try {
      const response = await getTasks();
      if (response.message) {
        setError(response.message);
      } else {
        setTasks(response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function showToast(message, type) {
    setToast({
      visible: true,
      message: message,
      type: type,
    });

    setTimeout(() => setToast({ visible: false }), 5000);
  }

  function onEdit(clickedTask) {
    setSelectedTask(clickedTask);
    setMode("edit");
    openModal();
  }

  function onAddTask() {
    setSelectedTask(null);
    setMode("create");
    openModal();
  }

  return (
    <div className="bg-blue-50 min-h-screen p-3">
      <Header />
      {loading && <p>Carregando...</p>}
      {error && <p> Erro: {error}</p>}
      <TaskControls onAddTask={onAddTask} />
      <TaskFormModal
        isOpen={showModal}
        closeModal={closeModal}
        mode={mode}
        fetchTasks={fetchTasks}
        showToast={showToast}
        selectedTask={selectedTask}
      />

      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onEdit={onEdit}
          fetchTasks={fetchTasks}
          showToast={showToast}
        />
      ) : (
        <p className="text-center text-2xl text-gray-500 mt-60 max-w-[60%] mx-auto">
          Você ainda não tem tarefas cadastradas. Clique em "nova tarefa +" para
          criar uma.
        </p>
      )}

      {
        <Toast
          isVisible={toast.visible}
          message={toast.message}
          type={toast.type}
        />
      }
    </div>
  );
}

export default App;

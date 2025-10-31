import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { getTasks } from "./services/api.js";
import TaskControls from "./components/TaskControls.jsx";
import TaskModal from "./components/TaskModal.jsx";
import Toast from "./components/Toast.jsx";
import { priorityMap, statusMap } from "./utils/constants.js";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    status: [],
  });
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("taskSortOrder") || "recent";
  });
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

  function onView(clickedTask) {
    setSelectedTask(clickedTask);
    setMode("view");
    openModal();
  }

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  function onSearchChange(searchInput) {
    if (!searchInput) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter((task) => {
      const matchesTitle = task.title
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const matchesDescription = task.description
        ?.toLowerCase()
        .includes(searchInput.toLowerCase());
      const matchesTag = task.tags?.some((tag) =>
        tag.toLowerCase().includes(searchInput.toLowerCase())
      );

      return matchesTitle || matchesDescription || matchesTag;
    });

    setFilteredTasks(filtered);
  }

  const sortedTasks = [...filteredTasks].sort((taskA, taskB) => {
    const dateA = new Date(taskA.createdAt).getTime();
    const dateB = new Date(taskB.createdAt).getTime();

    return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
  });

  function onToggleOrder() {
    setSortOrder((prev) => (prev === "recent" ? "oldest" : "recent"));
  }

  useEffect(() => {
    localStorage.setItem("taskSortOrder", sortOrder);
  }, [sortOrder]);

  function onFilterChange(selectedFilters) {
    setSelectedFilters(selectedFilters);
  }

  useEffect(() => {
    let filtered = tasks;
    if (selectedFilters.priority.length > 0) {
      filtered = filtered.filter((task) =>
        selectedFilters.priority.includes(
          priorityMap[task.priority].label.toLowerCase()
        )
      );
    }

    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter((task) =>
        selectedFilters.status.includes(
          statusMap[task.status].label.toLowerCase()
        )
      );
    }

    setFilteredTasks(filtered);
  }, [selectedFilters, tasks]);

  console.log(tasks);

  return (
    <div className="bg-blue-50 min-h-screen p-3">
      <Header />
      {loading && <p>Carregando...</p>}
      {error && <p> Erro: {error}</p>}
      <TaskControls
        onAddTask={onAddTask}
        onSearchChange={onSearchChange}
        onToggleOrder={onToggleOrder}
        sortOrder={sortOrder}
        onFilterChange={onFilterChange}
      />
      <TaskModal
        isOpen={showModal}
        closeModal={closeModal}
        mode={mode}
        fetchTasks={fetchTasks}
        showToast={showToast}
        selectedTask={selectedTask}
        onEdit={onEdit}
      />

      {tasks.length > 0 ? (
        <TaskList
          tasks={sortedTasks}
          onEdit={onEdit}
          onView={onView}
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

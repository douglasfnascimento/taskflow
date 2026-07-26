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
    tags: [],
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

  function handleChipClick(category, value) {
    setSelectedFilters((prev) => {
      const currentArray = prev[category] || [];
      const isSelected = currentArray.includes(value);

      return {
        ...prev,
        [category]: isSelected
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value],
      };
    });
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

    if (selectedFilters.tags && selectedFilters.tags.length > 0) {
      filtered = filtered.filter((task) =>
        task.tags?.some((tag) => selectedFilters.tags.includes(tag))
      );
    }

    setFilteredTasks(filtered);
  }, [selectedFilters, tasks]);

  console.log(tasks);

  return (
    <div className="bg-gradient-to-tr from-slate-100 to-blue-50 min-h-screen px-4 py-8 md:px-8">
      <Header />
      {loading && <p>Carregando...</p>}
      {error && <p> Erro: {error}</p>}
      <TaskControls
        onAddTask={onAddTask}
        onSearchChange={onSearchChange}
        onToggleOrder={onToggleOrder}
        sortOrder={sortOrder}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        tasks={tasks}
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
          onChipClick={handleChipClick}
        />
      ) : (
        <div className="text-center max-w-4xl mx-auto mt-20 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 p-16 rounded-2xl shadow-sm">
          <p className="text-gray-500 font-medium text-lg mb-1">
            Nenhuma tarefa cadastrada
          </p>
          <p className="text-gray-400 text-sm">
            Clique em "Nova tarefa" acima para criar sua primeira tarefa.
          </p>
        </div>
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

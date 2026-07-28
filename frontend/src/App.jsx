import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { getTasks } from "./services/api.js";
import TaskControls from "./components/TaskControls.jsx";
import TaskModal from "./components/TaskModal.jsx";
import Toast from "./components/Toast.jsx";
import { priorityMap, statusMap } from "./utils/constants.js";
import Login from "./components/Login.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    tags: [],
  });
  const [activeTab, setActiveTab] = useState("todo");
  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("taskSortOrder") || "recent";
  });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsAuthenticated(true);
      if (storedUsername) setUsername(storedUsername);
    }
  }, []);

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
      // Se der erro de não autorizado (401), desloga o usuário
      if (err.message.includes("Não autorizado")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  function handleLoginSuccess() {
    setIsAuthenticated(true);
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    setTasks([]);
  }

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
    
    // Filtro por Aba (Status)
    if (activeTab !== "all") {
      filtered = filtered.filter((task) => task.status === activeTab);
    }

    // Filtros Adicionais
    if (selectedFilters.priority.length > 0) {
      filtered = filtered.filter((task) =>
        selectedFilters.priority.includes(
          priorityMap[task.priority].label.toLowerCase()
        )
      );
    }

    if (selectedFilters.tags && selectedFilters.tags.length > 0) {
      filtered = filtered.filter((task) =>
        task.tags?.some((tag) => selectedFilters.tags.includes(tag))
      );
    }

    setFilteredTasks(filtered);
  }, [selectedFilters, activeTab, tasks]);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-gradient-to-tr from-slate-100 to-blue-50 min-h-screen px-4 py-8 md:px-8">
      <Header onLogout={handleLogout} username={username} />
      <TaskControls
        onAddTask={onAddTask}
        onSearchChange={onSearchChange}
        onToggleOrder={onToggleOrder}
        sortOrder={sortOrder}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        tasks={tasks}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
      {loading ? (
        <div className="text-center max-w-4xl mx-auto mt-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Carregando tarefas...</p>
        </div>
      ) : error ? (
        <div className="text-center max-w-4xl mx-auto mt-20 bg-red-50 border border-red-200 p-6 rounded-2xl">
          <p className="text-red-700 font-semibold mb-1">Erro ao carregar tarefas</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : tasks.length > 0 ? (
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

      {toast.visible && (
        <Toast
          isVisible={toast.visible}
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
}

export default App;

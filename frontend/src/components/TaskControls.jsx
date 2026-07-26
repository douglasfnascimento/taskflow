import { Plus } from "lucide-react";
import Button from "./Button";
import FilterPopover from "./FilterPopover";
import Search from "./Search";
import clsx from "clsx";

export default function TaskControls({
  onAddTask,
  onSearchChange,
  onToggleOrder,
  sortOrder,
  selectedFilters,
  setSelectedFilters,
  tasks,
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    { id: "todo", label: "A fazer" },
    { id: "doing", label: "Fazendo" },
    { id: "done", label: "Concluídas" },
    { id: "all", label: "Todas" },
  ];

  return (
    <div className="mx-auto max-w-4xl flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-gray-200/50 shadow-sm relative z-20">
      {/* Esquerda: Abas de Navegação */}
      <div className="flex bg-gray-100/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
              activeTab === tab.id
                ? "bg-white text-blue-700 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Direita: Busca, Filtro e Nova Tarefa */}
      <div className="flex flex-row flex-nowrap items-center gap-3 w-full md:w-auto justify-end">
        <div className="hidden md:block w-48">
          <Search onSearchChange={onSearchChange} />
        </div>
        
        <FilterPopover
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          tasks={tasks}
          sortOrder={sortOrder}
          onToggleOrder={onToggleOrder}
        />

        <Button text="Nova tarefa" onClick={onAddTask} Icon={Plus} color="blue" />
      </div>
      
      {/* Busca em telas menores */}
      <div className="block md:hidden w-full">
        <Search onSearchChange={onSearchChange} />
      </div>
    </div>
  );
}

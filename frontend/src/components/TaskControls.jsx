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
    <div className="mx-auto max-w-4xl flex flex-col-reverse md:flex-row gap-4 items-center justify-between mb-8 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-gray-200/50 shadow-sm relative z-20">
      {/* Abas de Navegação (Mobile: Bottom, Desktop: Left) */}
      <div className="flex bg-gray-100/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-2 md:px-4 py-2 rounded-lg text-[13px] md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex-1 md:flex-none text-center",
              activeTab === tab.id
                ? "bg-white text-blue-700 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Busca, Filtro e Nova Tarefa (Mobile: Top, Desktop: Right) */}
      <div className="flex flex-row items-center gap-2 w-full md:w-auto justify-between">
        <div className="flex-grow md:w-48 md:flex-grow-0">
          <Search onSearchChange={onSearchChange} />
        </div>
        
        <div className="flex gap-2 shrink-0">
          <FilterPopover
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            tasks={tasks}
            sortOrder={sortOrder}
            onToggleOrder={onToggleOrder}
          />
  
          <Button text="Nova tarefa" onClick={onAddTask} Icon={Plus} color="blue" hideTextOnMobile={true} />
        </div>
      </div>
    </div>
  );
}

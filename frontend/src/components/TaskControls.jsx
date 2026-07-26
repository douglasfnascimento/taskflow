import { Plus, ArrowDown, ArrowUp } from "lucide-react";
import Button from "./Button";
import FilterPopover from "./FilterPopover";
import Search from "./Search";

export default function TaskControls({
  onAddTask,
  onSearchChange,
  onToggleOrder,
  sortOrder,
  selectedFilters,
  setSelectedFilters,
  tasks,
}) {
  return (
    <div className="mx-auto max-w-4xl flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-gray-200/50 shadow-sm relative z-20">
      {/* Esquerda: Busca */}
      <div className="w-full md:w-auto flex-shrink-0">
        <Search onSearchChange={onSearchChange} />
      </div>

      {/* Direita: Filtro, Ordenação e Nova Tarefa */}
      <div className="flex flex-row flex-nowrap items-center gap-3 w-full md:w-auto justify-end">
        <FilterPopover
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          tasks={tasks}
        />
        
        <button
          className="h-10 px-5 text-gray-700 bg-white border border-gray-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 focus:outline-none shadow-sm text-sm whitespace-nowrap min-w-[140px]"
          onClick={onToggleOrder}
        >
          <span className="font-semibold">{sortOrder === "recent" ? "Mais recentes" : "Mais antigas"}</span>
          {sortOrder === "recent" ? (
            <ArrowDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          ) : (
            <ArrowUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
          )}
        </button>

        <Button text="Nova tarefa" onClick={onAddTask} Icon={Plus} color="blue" />
      </div>
    </div>
  );
}

import { Filter, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";

export default function FilterPopover({ selectedFilters, setSelectedFilters, tasks = [], sortOrder, onToggleOrder }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  // Fechamento ao clicar ou tocar fora
  useEffect(() => {
    function handleOutsideClick(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsPopoverOpen(false);
      }
    }

    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isPopoverOpen]);

  function Chips({ text, isSelected, onClick }) {
    return (
      <button
        onClick={onClick}
        type="button"
        className={
          isSelected
            ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white cursor-pointer transition-colors"
            : "px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 transition-colors"
        }
      >
        {text}
      </button>
    );
  }

  function toggleFilter(category, value) {
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

  // Calcular contagem de filtros ativos
  const activeFiltersCount =
    (selectedFilters.priority?.length || 0) +
    (selectedFilters.tags?.length || 0);

  return (
    <div ref={popoverRef} className="relative flex items-stretch">
      <button
        className="min-w-32 h-10 px-4 text-gray-700 bg-white border border-gray-300 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-all duration-200 hover:bg-gray-50 focus:outline-none shadow-sm text-sm whitespace-nowrap"
        onClick={() => setIsPopoverOpen((prev) => !prev)}
        type="button"
      >
        <span>Filtrar</span>
        <div className="flex gap-1.5 items-center">
          <Filter className="w-4 h-4 text-gray-500" />
          {activeFiltersCount > 0 && (
            <span className="flex w-5 h-5 items-center justify-center rounded-full text-xs text-white bg-blue-500 font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>
      </button>

      {isPopoverOpen && (
        <div className="p-5 absolute rounded-2xl bg-white shadow-2xl w-80 h-auto top-full right-0 mt-2 z-50 border border-gray-100">
          <button
            onClick={() => setIsPopoverOpen(false)}
            type="button"
            className="absolute top-3 right-3 w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-blue-800 font-bold mb-2">Prioridade</h2>
          <div className="flex gap-2 mb-4">
            <Chips
              text="baixa"
              isSelected={selectedFilters.priority?.includes("baixa")}
              onClick={() => toggleFilter("priority", "baixa")}
            ></Chips>
            <Chips
              text="média"
              isSelected={selectedFilters.priority?.includes("média")}
              onClick={() => toggleFilter("priority", "média")}
            ></Chips>
            <Chips
              text="alta"
              isSelected={selectedFilters.priority?.includes("alta")}
              onClick={() => toggleFilter("priority", "alta")}
            ></Chips>
          </div>
          
          <h2 className="text-blue-800 font-bold mb-2">Ordenação</h2>
          <div className="flex gap-2 mb-4">
            <Chips
              text="Mais recentes"
              isSelected={sortOrder === "recent"}
              onClick={sortOrder !== "recent" ? onToggleOrder : undefined}
            />
            <Chips
              text="Mais antigas"
              isSelected={sortOrder === "oldest"}
              onClick={sortOrder !== "oldest" ? onToggleOrder : undefined}
            />
          </div>

          {/* Seção de Tags */}
          {selectedFilters.tags && selectedFilters.tags.length > 0 && (
            <>
              <h2 className="text-blue-800 font-bold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2 mb-4 max-h-36 overflow-y-auto">
                {selectedFilters.tags.map((tag) => (
                  <Chips
                    key={tag}
                    text={tag}
                    isSelected={true}
                    onClick={() => toggleFilter("tags", tag)}
                  />
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end mt-7">
            <Button
              onClick={() =>
                setSelectedFilters({
                  priority: [],
                  tags: [],
                })
              }
              text="limpar filtros"
            />
          </div>
        </div>
      )}
    </div>
  );
}

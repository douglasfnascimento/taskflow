import { Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "./Button";

export default function FilterPopover({ onFilterChange }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    status: [],
  });
  function Chips({ text, isSelected, onClick }) {
    return (
      <button
        onClick={onClick}
        className={
          isSelected
            ? "px-3 py-1 rounded-full text-sm font-medium bg-blue-500 text-white"
            : "px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
        }
      >
        {text}
      </button>
    );
  }

  function toggleFilter(category, value) {
    setSelectedFilters((prev) => {
      const currentArray = prev[category];
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
    onFilterChange(selectedFilters);
  }, [selectedFilters]);

  return (
    <>
      <div className="relative flex items-stretch">
        <button
          className="min-w-42 py-1 px-3 text-blue-800 bg-white border border-gray-400 rounded-xl flex items-center justify-between cursor-pointer transition-colors duration-200 focus:outline-none"
          onClick={() => setIsPopoverOpen(true)}
        >
          <span>Filtrar</span>
          <div className="flex gap-1">
            <Filter className="w-5 h-5" />
            <span className="hidden w-6 h-6 rounded-2xl text-white bg-blue-500">
              1
            </span>
          </div>
        </button>
        {isPopoverOpen && (
          <div className="p-5 absolute rounded-2xl bg-white shadow-2xl w-80 h-auto top-full left-0 mt-2 z-10">
            <button
              onClick={() => setIsPopoverOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 text-gray-500 hover:text-white hover:bg-blue-800 rounded-full flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-blue-800 font-bold mb-2">Prioridade</h2>
            <div className="flex gap-2 mb-4">
              <Chips
                text="baixa"
                isSelected={selectedFilters.priority.includes("baixa")}
                onClick={() => toggleFilter("priority", "baixa")}
              ></Chips>
              <Chips
                text="média"
                isSelected={selectedFilters.priority.includes("média")}
                onClick={() => toggleFilter("priority", "média")}
              ></Chips>
              <Chips
                text="alta"
                isSelected={selectedFilters.priority.includes("alta")}
                onClick={() => toggleFilter("priority", "alta")}
              ></Chips>
            </div>
            <h2 className="text-blue-800 font-bold mb-2">Status</h2>
            <div className="flex gap-2">
              <Chips
                text="a fazer"
                isSelected={selectedFilters.status.includes("a fazer")}
                onClick={() => toggleFilter("status", "a fazer")}
              ></Chips>
              <Chips
                text="fazendo"
                isSelected={selectedFilters.status.includes("fazendo")}
                onClick={() => toggleFilter("status", "fazendo")}
              ></Chips>
              <Chips
                text="concluído"
                isSelected={selectedFilters.status.includes("concluída")}
                onClick={() => toggleFilter("status", "concluída")}
              ></Chips>
            </div>
            <div className="flex justify-end mt-7">
              <Button
                onClick={() =>
                  setSelectedFilters({
                    priority: [],
                    status: [],
                  })
                }
                text="limpar filtros"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

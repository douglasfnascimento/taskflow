import { Plus, ArrowDown, ArrowUp } from "lucide-react";
import Button from "./Button";
import Search from "./Search";

export default function TaskControls({
  onAddTask,
  onSearchChange,
  onToggleOrder,
  sortOrder,
}) {
  return (
    <div className="mx-auto max-w-[60%] flex justify-between mb-5">
      <Search onSearchChange={onSearchChange} />
      <button
        className="min-w-42 py-1 px-3 text-blue-800 bg-white border border-gray-400 rounded-xl flex items-center justify-between cursor-pointer transition-colors duration-200 focus:outline-none"
        onClick={onToggleOrder}
      >
        <span>{sortOrder === "recent" ? "mais recentes" : "mais antigas"}</span>
        {sortOrder === "recent" ? (
          <ArrowDown className="w-4 h-4" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </button>

      <Button text="nova tarefa" onClick={onAddTask} Icon={Plus} color="blue" />
    </div>
  );
}

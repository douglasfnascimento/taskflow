import { Plus, Search } from "lucide-react";
import Button from "./Button";

export default function TaskControls({ onAddTask }) {
  return (
    <div className="mx-auto max-w-[60%] flex justify-between mb-5">
      <div className="relative">
        <input
          className="min-w-57 bg-white border italic border-gray-400 rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400"
          type="text"
          placeholder="título, descrição ou tag"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <Button text="nova tarefa" onClick={onAddTask} Icon={Plus} color="blue" />
    </div>
  );
}

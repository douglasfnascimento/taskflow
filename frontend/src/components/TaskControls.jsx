import { Plus } from "lucide-react";
import Button from "./Button";
import Search from "./Search";

export default function TaskControls({ onAddTask, onSearchChange }) {
  return (
    <div className="mx-auto max-w-[60%] flex justify-between mb-5">
      <Search onSearchChange={onSearchChange} />
      <Button text="nova tarefa" onClick={onAddTask} Icon={Plus} color="blue" />
    </div>
  );
}

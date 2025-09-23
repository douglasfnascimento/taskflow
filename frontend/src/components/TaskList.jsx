import TaskItem from "./TaskItem";

export default function TaskList({ tasks }) {
  return tasks.map((task) => (
    <div className="mx-auto max-w-[50%]" key={task.id}>
      <TaskItem task={task} />
    </div>
  ));
}

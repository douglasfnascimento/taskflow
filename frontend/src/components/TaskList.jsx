import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onEdit,
  fetchTasks,
  showToast,
  onView,
  onChipClick,
}) {
  return tasks.map((task) => (
    <div className="mx-auto max-w-4xl" key={task.id}>
      <TaskItem
        task={task}
        onEdit={onEdit}
        fetchTasks={fetchTasks}
        showToast={showToast}
        onView={onView}
        onChipClick={onChipClick}
      />
    </div>
  ));
}

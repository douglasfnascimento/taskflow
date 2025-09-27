import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onEdit, fetchTasks, showToast }) {
  return tasks.map((task) => (
    <div className="mx-auto max-w-[60%]" key={task.id}>
      <TaskItem
        task={task}
        onEdit={onEdit}
        fetchTasks={fetchTasks}
        showToast={showToast}
      />
    </div>
  ));
}

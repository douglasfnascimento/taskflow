export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center mt-8 mb-12">
      <div className="flex items-center gap-0.5">
        <span className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          task
        </span>
        <span className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
          flow
        </span>
        <span className="text-4xl md:text-5xl font-extrabold text-indigo-600">
          .
        </span>
      </div>
      <p className="text-gray-400 text-xs md:text-sm font-normal mt-2 tracking-wide">
        Organize suas tarefas com simplicidade e eficiência
      </p>
    </div>
  );
}

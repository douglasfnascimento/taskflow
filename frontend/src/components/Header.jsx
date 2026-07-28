import { LogOut } from 'lucide-react';

export default function Header({ onLogout, username }) {
  return (
    <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between mt-8 mb-12 gap-4">
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

      {username && (
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-600">
            Olá, <span className="text-blue-600 font-bold">{username}</span>
          </span>
          <div className="w-px h-4 bg-gray-200"></div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-500 hover:text-red-500 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { X, Search as SearchInput } from "lucide-react";

export default function Search({ onSearchChange }) {
  const [searchInput, setSearchInput] = useState("");

  function handleSearch(e) {
    const value = e.target.value;
    setSearchInput(value);
    onSearchChange(value);
  }

  function handleIcon() {
    const className =
      "absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors z-10";

    if (searchInput === "") {
      return <SearchInput className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />;
    } else {
      return (
        <X
          className={className}
          onClick={() => {
            setSearchInput("");
            onSearchChange("");
          }}
        />
      );
    }
  }

  return (
    <div className="relative w-full max-w-xs">
      <input
        value={searchInput}
        onChange={(e) => handleSearch(e)}
        className="w-full h-10 bg-white border border-gray-300 rounded-xl pl-4 pr-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm text-sm"
        type="text"
        placeholder="Buscar tarefa..."
      />
      {handleIcon()}
    </div>
  );
}

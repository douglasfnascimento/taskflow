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
      "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400";

    if (searchInput === "") {
      return <SearchInput className={className} />;
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
    <div className="relative">
      <input
        value={searchInput}
        onChange={(e) => handleSearch(e)}
        className="min-w-57 bg-white border italic border-gray-400 rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400"
        type="text"
        placeholder="título, descrição ou tag"
      />
      {handleIcon()}
    </div>
  );
}

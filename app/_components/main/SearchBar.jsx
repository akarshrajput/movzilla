import { useState } from "react";
export default function SearchBar({ onSearch }) {
  const [v, setV] = useState("");
  return (
    <form className="w-full mb-4">
      <input
        className="w-full bg-neutral-800 text-white rounded px-4 py-2 focus:outline-none"
        placeholder="Search movies by name, tag, language, genre, cast..."
        value={v}
        onChange={(e) => {
          setV(e.target.value);
          onSearch(e.target.value);
        }}
      />
    </form>
  );
}

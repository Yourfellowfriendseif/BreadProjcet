// src/components/search/SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("bread");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-grow">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${
            searchType === "bread" ? "bread listings" : "users"
          }`}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800"
        />
      </div>
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="px-3 py-2 border rounded-lg bg-white text-gray-800"
      >
        <option value="bread">Bread</option>
        <option value="user">Users</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
      >
        Search
      </button>
    </form>
  );
}

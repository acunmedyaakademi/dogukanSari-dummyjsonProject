import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="searchBar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by title"
        className="searchInput"
      />
    </div>
  );
}

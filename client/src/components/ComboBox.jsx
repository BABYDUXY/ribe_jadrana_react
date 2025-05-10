import { useState } from "react";

function ComboBox({ lista, name }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = lista.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (value) => {
    setInputValue(value);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        onFocus={() => {
          if (filteredSuggestions.length > 0) setShowDropdown(true);
        }}
        className="h-10 w-full rounded-[7px] p-3 text-moja_plava font-semibold "
        placeholder="Napiši ili odaberi"
        name={name}
        id={name}
        required
      />
      {showDropdown && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded shadow max-h-60">
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              onMouseDown={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default ComboBox;

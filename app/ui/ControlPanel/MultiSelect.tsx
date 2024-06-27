import { useState, useRef, useEffect } from "react";
import { cn } from "@/app/utils";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  updateSelected: (tags: string[]) => void;
}

const MultiSelect = ({
  options,
  selected,
  updateSelected,
}: MultiSelectProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option: string) => {
    if (!selected.includes(option)) {
      updateSelected([...selected, option]);
    }
  };

  const removeOption = (option: string) => {
    updateSelected(selected.filter((o) => o !== option));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="text-[15px] max-w-[400px] relative mb-1 z-[1] text-text"
      ref={dropdownRef}
    >
      <div
        className={cn(
          "border py-2 px-2.5 rounded flex gap-2",
          dropdownOpen ? "border-[#8d8d8d]" : "border-border"
        )}
        onClick={toggleDropdown}
      >
        {selected.map((option) => (
          <div
            className={cn(
              "rounded-sm px-1.5",
              options.includes(option) ? "bg-hoverElement" : "bg-accentRed/20"
            )}
            key={option}
          >
            {option}
            <span
              className="ml-1 text-accentRed cursor-pointer hover:text-hoverRed"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(option);
              }}
            >
              ×
            </span>
          </div>
        ))}
        <div className="text-placeholder">
          {selected.length === 0 && "Select tags..."}
        </div>
      </div>
      {dropdownOpen && (
        <div className="mt-2 border border-border rounded py-1 absolute top-full left-0 right-0 bg-element max-h-[285px] overflow-y-auto shadow-xl">
          {options.map(
            (option) =>
              !selected.includes(option) && (
                <div
                  className="py-1 px-2.5 hover:bg-hoverElement cursor-pointer"
                  key={option}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

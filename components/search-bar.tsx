"use client";

import { body } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRef, useState } from "react";
import { useRoastume } from "@/lib/store";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search resumes by title...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef<number | null>(null);
  const { totalResumes } = useRoastume();

  const triggerSearch = (value: string) => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    debounceRef.current = window.setTimeout(() => {
      onSearch(value.trim());
    }, 400);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const clearSearch = () => {
    setQuery("");
    triggerSearch("");
  };

  return (
    <div className={cn("w-full flex items-center gap-4", className)}>
      <div className="relative flex-1">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2c2c2c] w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              triggerSearch(query);
            }
          }}
          placeholder={placeholder}
          className={cn(
            body.className,
            "w-full pl-10 pr-10 py-3 rounded-full",
            "comic-border bg-[#A3D8D6]",
            "comic-shadow-3",
            "focus:outline-none",
            "focus:shadow-[4px_4px_0_#2c2c2c]",
            "focus:-translate-y-0.5 transition-all duration-200",
            "placeholder:text-gray-600 text-[#2c2c2c] font-medium"
          )}
        />
        <button
          type="button"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-0 pointer-events-none"
          aria-hidden
          tabIndex={-1}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2c2c2c] hover:text-red-600 transition-colors"
            aria-label="Clear search"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
        <span className={cn(body.className, "font-medium")}>
          {totalResumes} resume{totalResumes !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

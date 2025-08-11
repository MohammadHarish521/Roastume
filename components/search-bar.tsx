"use client";

import { body } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2c2c2c] w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            body.className,
            "w-full pl-10 pr-10 py-3 rounded-full",
            "border-[3px] border-[#2c2c2c] bg-green-400",
            "shadow-[3px_3px_0_#2c2c2c]",
            "focus:outline-none focus:shadow-[4px_4px_0_#2c2c2c]",
            "focus:-translate-y-0.5 transition-all duration-200",
            "placeholder:text-gray-600 text-[#2c2c2c] font-medium"
          )}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2c2c2c] hover:text-red-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

import { cn } from "~/lib/cn";
import SearchIcon from "@icons/search.svg?react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Найти",
  className = "",
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        width={20}
        height={20}
        className="absolute left-3 top-1/2 -translate-y-1/2"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#242EDB] transition-colors"
      />
    </div>
  );
}

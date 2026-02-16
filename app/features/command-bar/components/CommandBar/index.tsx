import { useState, useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { cn } from "~/lib/cn";
import SearchIcon from "@icons/search.svg?react";
import type { Command } from "../../schemas/command.schema";

interface CommandBarProps {
  onCommand: (command: Command) => void;
  className?: string;
}

export function CommandBar({ onCommand, className }: CommandBarProps) {
  const [input, setInput] = useState("");
  const fetcher = useFetcher<{ command: Command }>();
  const processedRef = useRef<string | null>(null);
  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      const key = JSON.stringify(fetcher.data.command);
      if (processedRef.current === key) return;
      processedRef.current = key;

      const command = fetcher.data.command;
      if (command.type !== "search") {
        setInput("");
      }
      onCommand(command);
    }
  }, [fetcher.data, fetcher.state, onCommand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    processedRef.current = null;
    fetcher.submit(
      { input: trimmed },
      { method: "POST", action: "/api/command" },
    );
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <SearchIcon
        width={20}
        height={20}
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 transition-opacity",
          isLoading && "animate-pulse opacity-60",
        )}
      />
      <input
        type="text"
        placeholder="Поиск или команда..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          "w-full h-10 pl-10 pr-12 rounded-lg border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors",
          isLoading
            ? "border-[#242EDB] bg-indigo-50/50"
            : "border-gray-200 focus:border-[#242EDB]",
        )}
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-[#242EDB] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10m0 0L9 4m4 4L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

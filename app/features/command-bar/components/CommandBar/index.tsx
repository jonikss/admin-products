import { useState, useEffect, useRef, useCallback } from "react";
import { useFetcher } from "react-router";
import { cn } from "~/lib/cn";
import SearchIcon from "@icons/search.svg?react";
import type { Command } from "../../schemas/command.schema";

interface CommandBarProps {
  onCommand: (command: Command) => void;
  className?: string;
}

const HINTS = [
  "iphone — поиск товара",
  "sort by price desc — сортировка",
  "add Samsung Galaxy — добавить товар",
  "page 3 — перейти на страницу",
  "refresh — обновить данные",
];

export function CommandBar({ onCommand, className }: CommandBarProps) {
  const [input, setInput] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [focused, setFocused] = useState(false);
  const fetcher = useFetcher<{ command: Command }>();
  const processedRef = useRef<string | null>(null);
  const wrapperRef = useRef<HTMLFormElement>(null);
  const isLoading = fetcher.state !== "idle";

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (!input.trim()) setShowHints(true);
  }, [input]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    setTimeout(() => setShowHints(false), 150);
  }, []);

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
    <form onSubmit={handleSubmit} ref={wrapperRef} className={cn("relative", className)}>
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
        onChange={(e) => {
          setInput(e.target.value);
          setShowHints(!e.target.value.trim() && focused);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
      {showHints && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-50">
          {HINTS.map((hint) => (
            <button
              key={hint}
              type="button"
              className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const command = hint.split(" — ")[0];
                setInput(command);
                setShowHints(false);
              }}
            >
              <span className="font-medium text-gray-900">{hint.split(" — ")[0]}</span>
              <span className="text-gray-400"> — {hint.split(" — ")[1]}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

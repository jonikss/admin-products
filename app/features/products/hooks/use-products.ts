import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import type { SortingState } from "@tanstack/react-table";
import { fetchProducts } from "../api";

const STORAGE_KEY = "products-sorting";
const PAGE_SIZE = 10;

function loadSorting(): SortingState {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSorting(sorting: SortingState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorting));
}

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>(loadSorting());
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const setPage = useCallback(
    (next: number) => {
      setSearchParams(
        (prev) => {
          if (next <= 1) {
            prev.delete("page");
          } else {
            prev.set("page", String(next));
          }
          return prev;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );



  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const handleSortingChange = (next: SortingState) => {
    setSorting(next);
    saveSorting(next);
    setPage(1);
  };

  const setSortingFromCommand = (field: string, direction: "asc" | "desc") => {
    const columnId = field === "title" ? "name" : field;
    const next: SortingState = [{ id: columnId, desc: direction === "desc" }];
    setSorting(next);
    saveSorting(next);
    setPage(1);
  };

  const sortBy = sorting[0]?.id === "name" ? "title" : sorting[0]?.id;
  const order = sorting[0]?.desc ? "desc" : "asc";
  const skip = (page - 1) * PAGE_SIZE;

  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["products", { skip, sortBy, order: sorting.length ? order : undefined, search: debouncedSearch }],
    queryFn: () =>
      fetchProducts({
        limit: PAGE_SIZE,
        skip,
        sortBy: sorting.length ? sortBy : undefined,
        order: sorting.length ? order : undefined,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showFrom = total === 0 ? 0 : skip + 1;
  const showTo = Math.min(skip + PAGE_SIZE, total);

  return {
    products,
    total,
    page,
    setPage,
    sorting,
    setSorting: handleSortingChange,
    search,
    setSearch: handleSearchChange,
    setSortingFromCommand,
    isFetching,
    isLoading,
    refetch,
    totalPages,
    showFrom,
    showTo,
    pageSize: PAGE_SIZE,
  };
}

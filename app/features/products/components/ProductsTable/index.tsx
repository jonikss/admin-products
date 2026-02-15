import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  type RowSelectionState,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Product } from "../../api";
import { formatPrice } from "./utils";

interface ProductsTableProps {
  data: Product[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
} 

export function ProductsTable({
  data,
  sorting,
  onSortingChange,
}: ProductsTableProps) {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <button
            onClick={table.getToggleAllRowsSelectedHandler()}
            className="flex items-center justify-center"
          >
            <img
              src={table.getIsAllRowsSelected() ? "/icons/checkbox-checked.svg" : "/icons/checkbox.svg"}
              alt=""
              width={20}
              height={20}
            />
          </button>
        ),
        cell: ({ row }) => (
          <button
            onClick={row.getToggleSelectedHandler()}
            className="flex items-center justify-center"
          >
            <img
              src={row.getIsSelected() ? "/icons/checkbox-checked.svg" : "/icons/checkbox.svg"}
              alt=""
              width={20}
              height={20}
            />
          </button>
        ),
        size: 48,
        enableSorting: false,
      },
      {
        id: "name",
        accessorKey: "title",
        header: "Наименование",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.thumbnail}
              alt={row.original.title}
              className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {row.original.title}
              </div>
              <div className="text-sm text-gray-400 truncate capitalize">
                {row.original.category}
              </div>
            </div>
          </div>
        ),
        size: 280,
        enableSorting: true,
      },
      {
        accessorKey: "brand",
        header: "Вендор",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">
            {(getValue() as string) || "—"}
          </span>
        ),
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "sku",
        header: "Артикул",
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue() as string}</span>
        ),
        size: 140,
        enableSorting: false,
      },
      {
        accessorKey: "rating",
        header: "Оценка",
        cell: ({ getValue }) => {
          const rating = getValue() as number;
          return <span className="text-gray-600">{rating.toFixed(1)}/5</span>;
        },
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "price",
        header: "Цена, ₽",
        cell: ({ getValue }) => (
          <span className="text-gray-900">
            {formatPrice(getValue() as number)}
          </span>
        ),
        size: 130,
        enableSorting: true,
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full bg-[#242EDB] text-white flex items-center justify-center hover:bg-[#1a22b0] transition-colors">
              <img src="/icons/plus.svg" alt="Добавить" width={16} height={16} />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <img src="/icons/dots.svg" alt="Ещё" width={16} height={16} />
            </button>
          </div>
        ),
        size: 80,
        enableSorting: false,
      },
    ],
    []
  );

  const rowSelection: RowSelectionState = {};

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange(next);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-gray-100">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={`px-4 py-3 text-left text-sm font-medium text-gray-400 ${
                      canSort ? "cursor-pointer select-none hover:text-gray-600" : ""
                    }`}
                    style={{ width: header.getSize() }}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {canSort && (
                        <img
                          src={
                            sorted === "asc"
                              ? "/icons/sort-asc-active.svg"
                              : sorted === "desc"
                                ? "/icons/sort-desc-active.svg"
                                : "/icons/sort-asc.svg"
                          }
                          alt=""
                          width={12}
                          height={12}
                          className="ml-1"
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                row.getIsSelected() ? "bg-blue-50/50" : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

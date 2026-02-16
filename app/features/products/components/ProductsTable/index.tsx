import { useMemo, useState } from "react";
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
import { cn } from "~/lib/cn";
import { Checkbox } from "~/components/ui/Checkbox";
import PlusIcon from "@icons/plus.svg?react";
import DotsIcon from "@icons/dots.svg?react";
import SortAscIcon from "@icons/sort-asc.svg?react";
import SortAscActiveIcon from "@icons/sort-asc-active.svg?react";
import SortDescActiveIcon from "@icons/sort-desc-active.svg?react";

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
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={() => table.toggleAllRowsSelected()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={() => row.toggleSelected()}
          />
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
          return <span className="text-gray-600"><span className={cn(rating < 3 && "text-red-500")}>{rating.toFixed(1)}</span>/5</span>;
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
              <PlusIcon width={16} height={16} />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <DotsIcon width={16} height={16} />
            </button>
          </div>
        ),
        size: 80,
        enableSorting: false,
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
    onRowSelectionChange: setRowSelection,
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
              {headerGroup.headers.map((header, headerCellIndex) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-gray-400",
                      canSort && "cursor-pointer select-none hover:text-gray-600",
                       headerCellIndex === 0 && "border-l-4 border-l-transparent"
                    )}
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
                        sorted === "asc"
                          ? <SortAscActiveIcon width={12} height={12} className="ml-1" />
                          : sorted === "desc"
                            ? <SortDescActiveIcon width={12} height={12} className="ml-1" />
                            : <SortAscIcon width={12} height={12} className="ml-1" />
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
              className={cn(
                "group border-b border-gray-50 hover:bg-gray-50/50 transition-colors",
                row.getIsSelected() && "bg-blue-50/50"
              )}
            >
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={cell.id}
                  className={cn(
                    "px-4 py-3 transition-colors",
                    cellIndex === 0 && "border-l-4 border-l-transparent group-hover:border-l-[#242EDB]"
                  )}
                >
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

import { useCallback } from "react";
import { Outlet } from "react-router";
import type { Route } from "./+types/products.index";
import { useProducts } from "~/features/products/hooks/use-products";
import { ProductsTable } from "~/features/products/components/ProductsTable";
import { ProductsTableSkeleton } from "~/features/products/components/ProductsTableSkeleton";
import { ProductsToolbar } from "~/features/products/components/ProductsToolbar";
import { CommandBar, useCommandExecutor } from "~/features/command-bar";
import { Pagination } from "~/components/ui/Pagination";
import { ProgressBar } from "~/components/ui/ProgressBar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Товары — Admin Products" },
    { name: "description", content: "Управление товарами" },
  ];
}

export default function ProductsIndex() {
  const {
    products,
    total,
    page,
    setPage,
    sorting,
    setSorting,
    setSearch,
    setSortingFromCommand,
    isFetching,
    isLoading,
    refetch,
    resetAndRefetch,
    totalPages,
    showFrom,
    showTo,
    pageSize,
  } = useProducts();

  const { executeCommand } = useCommandExecutor({
    onSearch: setSearch,
    onSort: setSortingFromCommand,
    onRefresh: resetAndRefetch,
    onGotoPage: setPage,
  });

  const handleCommand = useCallback(
    (command: Parameters<typeof executeCommand>[0]) => {
      executeCommand(command);
    },
    [executeCommand],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar visible={isFetching} />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex items-center gap-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <CommandBar
            onCommand={handleCommand}
            className="flex-1"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ProductsToolbar onRefresh={resetAndRefetch} />

          {isLoading ? (
            <ProductsTableSkeleton rows={pageSize} />
          ) : (
            <ProductsTable
              data={products}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            showFrom={showFrom}
            showTo={showTo}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>

      <Outlet />
    </div>
  );
}

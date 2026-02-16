import { Link } from "react-router";
import RefreshIcon from "@icons/refresh.svg?react";
import PlusIcon from "@icons/plus.svg?react";

interface ProductsToolbarProps {
  onRefresh: () => void;
}

export function ProductsToolbar({ onRefresh }: ProductsToolbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm font-medium text-gray-900">
        Все позиции
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <RefreshIcon width={20} height={20} />
        </button>
        <Link
          to="/add"
          className="h-9 px-4 rounded-lg bg-[#242EDB] text-white text-sm font-medium flex items-center gap-2 hover:bg-[#1a22b0] transition-colors"
        >
          <PlusIcon width={16} height={16} />
          Добавить
        </Link>
      </div>
    </div>
  );
}

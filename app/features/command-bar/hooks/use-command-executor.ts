import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import type { Command } from "../schemas/command.schema";

interface CommandCallbacks {
  onSearch: (query: string) => void;
  onSort: (field: string, direction: "asc" | "desc") => void;
  onRefresh: () => void;
  onGotoPage: (page: number) => void;
}

export function useCommandExecutor(callbacks: CommandCallbacks) {
  const navigate = useNavigate();

  const executeCommand = (command: Command) => {
    switch (command.type) {
      case "search":
        callbacks.onSearch(command.query);
        break;
      case "sort":
        callbacks.onSort(command.field, command.direction);
        toast.success(`Сортировка: ${command.field} ${command.direction}`);
        break;
      case "navigate": {
        const params = new URLSearchParams();
        if (command.title) params.set("title", command.title);
        if (command.price != null) params.set("price", String(command.price));
        if (command.brand) params.set("brand", command.brand);
        const qs = params.toString();
        navigate(qs ? `/add?${qs}` : "/add");
        toast.info("Открытие формы добавления товара");
        break;
      }
      case "refresh":
        callbacks.onRefresh();
        toast.success("Данные обновлены");
        break;
      case "goto_page":
        callbacks.onGotoPage(command.page);
        toast.success(`Переход на страницу ${command.page}`);
        break;
    }
  };

  return { executeCommand };
}

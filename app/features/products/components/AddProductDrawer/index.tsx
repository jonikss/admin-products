import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { z } from "zod";
import { addProduct } from "../../api";
import { TextInput } from "~/components/ui/TextInput";
import CloseIcon from "@icons/close.svg?react";

const addProductSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  price: z.string().min(1, "Обязательное поле"),
  brand: z.string().min(1, "Обязательное поле"),
  sku: z.string().min(1, "Обязательное поле"),
});

type AddProductFormData = z.infer<typeof addProductSchema>;

export function AddProductDrawer() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
  });

  const close = () => navigate("/");

  const mutation = useMutation({
    mutationFn: (data: AddProductFormData) =>
      addProduct({
        title: data.title,
        price: Number(data.price),
        brand: data.brand,
        sku: data.sku,
      }),
    onSuccess: () => {
      toast.success("Товар успешно добавлен!");
      close();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ошибка при добавлении товара");
    },
  });

  const onSubmit = (data: AddProductFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={close} />

      <div className="relative w-full max-w-[480px] bg-white h-full shadow-xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Добавление товара</h2>
          <button
            onClick={close}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <TextInput
              {...register("title")}
              label="Наименование"
              placeholder="Введите название товара"
              error={errors.title?.message}
            />
            <TextInput
              {...register("price")}
              label="Цена"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
            />
            <TextInput
              {...register("brand")}
              label="Вендор"
              placeholder="Введите бренд"
              error={errors.brand?.message}
            />
            <TextInput
              {...register("sku")}
              label="Артикул"
              placeholder="Введите артикул"
              error={errors.sku?.message}
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={close}
              disabled={mutation.isPending}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 h-11 rounded-xl bg-[#242EDB] text-white text-sm font-medium hover:bg-[#1a22b0] disabled:opacity-70 transition-colors"
            >
              {mutation.isPending ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

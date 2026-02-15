import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { login, saveSession } from "../../api";
import { loginSchema, type LoginFormData } from "./validation";
import { TextInput } from "~/components/ui/TextInput";
import { Checkbox } from "~/components/ui/Checkbox";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "emilys",
      password: "emilyspass",
    },
  });

  const usernameValue = watch("username");

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: (data) => {
      saveSession(data, rememberMe);
      toast.success("Успешный вход!");
      navigate("/"); // Redirect to home page after successful login
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ошибка авторизации");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[527px] rounded-[40px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.04)] border border-[#EDEDED] relative overflow-hidden">
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-[rgba(35,35,35,0.03)] to-transparent pointer-events-none" />

        <div className="relative px-16 pt-14 pb-12">
          <div className="flex justify-center mb-8">
            <div className="w-[52px] h-[52px] rounded-full border border-[#EDEDED] flex items-center justify-center shadow-[0_12px_8px_rgba(0,0,0,0.03)] bg-white">
              <img src="/icons/sound-wave.svg" alt="" width={24} height={24} />
            </div>
          </div>

          <h1 className="text-center text-[#232323] text-[28px] font-bold leading-tight mb-2">
            Добро пожаловать!
          </h1>
          <p className="text-center text-[#E0E0E0] text-sm mb-10">
            Показывай каталоги, товары, бренды, тестируй и прочую информацию
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <TextInput
                {...register("username")}
                label="Логин"
                type="text"
                placeholder="test@test.com"
                error={errors.username?.message}
                icon={<img src="/icons/user.svg" alt="" width={16} height={18} />}
                endAction={
                  usernameValue ? (
                    <button
                      type="button"
                      onClick={() => setValue("username", "", { shouldValidate: true })}
                      className="hover:opacity-60 transition-opacity"
                    >
                      <img src="/icons/close.svg" alt="" width={16} height={16} />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <div className="mb-4">
              <TextInput
                {...register("password")}
                label="Пароль"
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                error={errors.password?.message}
                icon={<img src="/icons/lock.svg" alt="" width={18} height={20} />}
                endAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:opacity-60 transition-opacity"
                  >
                    <img
                      src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"}
                      alt=""
                      width={22}
                      height={showPassword ? 16 : 18}
                    />
                  </button>
                }
              />
            </div>

            <div className="mb-6">
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="Запомнить данные для входа"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full h-[54px] rounded-xl bg-[#242EDB] border border-[#367AFF] text-white font-medium text-base cursor-pointer hover:bg-[#1e27c4] active:bg-[#191fb0] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-[0_8px_8px_rgba(54,122,255,0.03)]"
            >
              {mutation.isPending ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#EDEDED]" />
            <span className="px-6 text-[#EBEBEB] text-sm">или</span>
            <div className="flex-1 h-px bg-[#EDEDED]" />
          </div>

          <p className="text-center text-[#6C6C6C] text-sm">
            Нет аккаунта?{" "}
            <a
              href="#"
              className="text-[#242EDB] underline underline-offset-4 hover:text-[#1e27c4] transition-colors"
            >
              Создать аккаунт
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

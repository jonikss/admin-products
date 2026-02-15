import type { Route } from "./+types/login";
import { LoginForm } from "~/features/auth/components/LoginForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Вход — Admin Products" },
    { name: "description", content: "Вход в панель управления товарами" },
  ];
}

export default function LoginPage() {
  return <LoginForm />;
}

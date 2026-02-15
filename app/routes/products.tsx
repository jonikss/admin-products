import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/products";
import { getSession } from "~/features/auth/api";

export function clientLoader({}: Route.ClientLoaderArgs) {
  const session = getSession();
  if (!session) {
    throw redirect("/login");
  }
  return null;
}

export default function ProductsLayout() {
  return <Outlet />;
}

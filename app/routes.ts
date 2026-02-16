import { type RouteConfig, layout, route, index } from "@react-router/dev/routes";

export default [
    layout("routes/products.tsx", [
        layout("routes/products.index.tsx", [
            index("routes/products.empty.tsx"),
            route("add", "routes/products.add.tsx"),
        ]),
    ]),
    route("login", "routes/login.tsx"),
    route("api/command", "routes/api.command.ts"),
] satisfies RouteConfig;

import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  resolve: {
    alias: {
      "@icons": path.resolve(__dirname, "public/icons"),
    },
  },
  plugins: [tailwindcss(), svgr(), reactRouter(), tsconfigPaths()],
});

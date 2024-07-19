import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      include: ["test/**/*.ts"],
      reporter: ["html"],
      thresholds: {
        100: true,
      },
    },
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["html"],
      thresholds: {
        100: true,
      },
    },
  },
});

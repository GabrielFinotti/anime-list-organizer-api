import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  minify: !options.watch,
  splitting: false,
  skipNodeModulesBundle: true,
  treeshake: true,
  tsconfig: "tsconfig.json",
}));

import esbuild from "esbuild";
import { copyFile, readFile, writeFile, rm } from "node:fs/promises";

const sharedOptions = {
  sourcemap: "external",
  sourcesContent: true,
  minify: false,
  allowOverwrite: true,
  packages: "external",
};

async function main() {
  // Start with a clean slate
  await rm("pkg", { recursive: true, force: true });
  // Build the source code for a neutral platform as ESM
  await esbuild.build({
    entryPoints: ["./src/*.ts", "./src/**/*.ts"],
    outdir: "pkg/dist-src",
    bundle: false,
    platform: "neutral",
    format: "esm",
    ...sharedOptions,
    sourcemap: false,
  });

  await Promise.all([
    // Build the a CJS Node.js bundle
    esbuild.build({
      entryPoints: ["./pkg/dist-src/index.js"],
      outdir: "pkg/dist-node",
      bundle: true,
      platform: "node",
      target: "node20",
      format: "esm",
      ...sharedOptions,
    }),
    // Build an ESM browser bundle
    esbuild.build({
      entryPoints: [{ in: "./pkg/dist-src/web.js", out: "index" }],
      outdir: "pkg/dist-web",
      bundle: true,
      platform: "browser",
      format: "esm",
      ...sharedOptions,
    }),
  ]);

  // Copy the README, LICENSE to the pkg folder
  await copyFile("LICENSE", "pkg/LICENSE");
  await copyFile("README.md", "pkg/README.md");

  // Handle the package.json
  let pkg = JSON.parse((await readFile("package.json", "utf8")).toString());
  // Remove unnecessary fields from the package.json
  delete pkg.scripts;
  delete pkg.prettier;
  delete pkg.release;
  delete pkg.jest;
  await writeFile(
    "pkg/package.json",
    JSON.stringify(
      {
        ...pkg,
        files: ["dist-*/**"],
        exports: {
          ".": {
            node: {
              types: "./dist-types/index.d.ts",
              import: "./dist-node/index.js",
            },
            browser: {
              types: "./dist-types/web.d.ts",
              import: "./dist-web/index.js",
            },
            default: {
              types: "./dist-types/index.d.ts",
              import: "./dist-node/index.js",
            },
          },
        },
        sideEffects: false,
      },
      null,
      2,
    ),
  );
}
main();

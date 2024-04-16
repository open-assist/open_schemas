import { build, emptyDir } from "dnt";

const inDir = "./valibot";
const outDir = "./npm_valibot";
await emptyDir(outDir);

await build({
  entryPoints: [
    "./valibot/openai/mod.ts",
    {
      name: "./valibot/anthropic",
      path: "./valibot/anthropic/mod.ts",
    },
    {
      name: "./valibot/openai",
      path: "./valibot/openai/mod.ts",
    },
  ],
  outDir,
  shims: {
    deno: false,
  },
  package: {
    name: "@open-schemas/valibot",
    version: Deno.args[0],
    description: "valibot schemas for the OpenAPI of LLM.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/open-assist/open-schemas.git",
    },
    bugs: {
      url: "https://github.com/open-assist/open-schemas/issues",
    },
    devDependencies: {
      "@types/node": "^20.11.5",
    },
    peerDependencies: {
      valibot: "^0.30.0",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", `${outDir}/LICENSE`);
    Deno.copyFileSync(`${inDir}/README.md`, `${outDir}/README.md`);
  },
});

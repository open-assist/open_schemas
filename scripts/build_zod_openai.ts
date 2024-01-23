import { build, emptyDir } from "dnt";

const inDir = "./zod/openai";
const outDir = "./npm_zod_openai";
await emptyDir(outDir);

await build({
  entryPoints: ["./zod/openai/mod.ts"],
  outDir,
  shims: {
    deno: false,
    // blob: true,
  },
  package: {
    // package.json properties
    name: "@open-schemas/zod-openai",
    version: Deno.args[0],
    description: "Zod schemas for the OpenAPI of OpenAI.",
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
      zod: "^3.20.0",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", `${outDir}/LICENSE`);
    Deno.copyFileSync(`${inDir}/README.md`, `${outDir}/README.md`);
  },
});

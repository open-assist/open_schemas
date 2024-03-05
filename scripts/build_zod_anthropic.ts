import { build, emptyDir } from "dnt";

const inDir = "./zod/anthropic";
const outDir = "./npm_zod_anthropic";
await emptyDir(outDir);

await build({
  entryPoints: ["./zod/anthropic/mod.ts"],
  outDir,
  shims: {
    deno: false,
  },
  package: {
    name: "@open-schemas/zod-anthropic",
    version: Deno.args[0],
    description: "Zod schemas for the API of Google AI.",
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
    Deno.copyFileSync("LICENSE", `${outDir}/LICENSE`);
    Deno.copyFileSync(`${inDir}/README.md`, `${outDir}/README.md`);
  },
});

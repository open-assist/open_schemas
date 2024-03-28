import * as log from "@std/log";

if (Deno.args.length < 1) {
  log.error("Need version argument.");
  Deno.exit(1);
}

const TOOLS = ["zod", "valibot", "types"];
const toolImportMap = {
  valibot: "jsr:@valibot/valibot@^0.30.0",
  zod: "npm:zod@3.22.4",
};

TOOLS.forEach(async (tool) => {
  const config = {
    name: `@open-schemas/${tool}`,
    version: Deno.args[0],
    exports: {
      "./anthropic": "./anthropic/mod.ts",
      "./openai": "./openai/mod.ts",
    },
    imports: toolImportMap[tool] && {
      [tool]: toolImportMap[tool],
    },
  };
  const configFilePath = `./${tool}/deno.json`;
  try {
    await Deno.writeTextFile(configFilePath, JSON.stringify(config));
  } catch (err) {
    log.error(err);
  }
  log.info(`Generated ${configFilePath} file.`);
});

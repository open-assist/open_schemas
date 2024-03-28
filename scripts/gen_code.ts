import * as log from "@std/log";
import * as Codegen from "typebox-codegen";

const providers = ["anthropic", "ollama", "openai", "vertex_ai"];
const TOOLS = ["zod", "valibot"];

const [provider, file, tool] = Deno.args;

if (!providers.includes(provider)) {
  log.error(`Invalid provider. Only support ${providers.join(",")}.`);
  Deno.exit(1);
}

const path = `./types/${provider}/${file}.ts`;
try {
  await Deno.lstat(path);
} catch (err) {
  if (err instanceof Deno.errors.NotFound) {
    log.error(`${path} is not a file.`);
  } else {
    log.error(err);
  }
  Deno.exit(1);
}

if (tool && !TOOLS.includes(tool)) {
  log.error(`Invalid tool. Only support ${TOOLS.join(",")}.`);
  Deno.exit(1);
}

const typescript = await Deno.readTextFile(path);
const model = Codegen.TypeScriptToModel.Generate(typescript);

async function generateFile(tool) {
  let code;
  switch (tool) {
    case "zod":
      code = Codegen.ModelToZod.Generate(model);
      break;
    case "valibot":
      code = Codegen.ModelToValibot.Generate(model);
      break;
    case "yup":
      code = Codegen.ModelToYup.Generate(model);
      break;
  }

  const genFilePath = `./${tool}/${provider}/${file}.ts`;
  try {
    await Deno.writeTextFile(genFilePath, code);
  } catch (err) {
    log.error(err);
    Deno.exit(1);
  }
  log.info(`Generated ${genFilePath} file.`);
}

if (tool) {
  await generateFile(tool);
} else {
  TOOLS.forEach(async (tool) => {
    await generateFile(tool);
  });
}

# @open-schemas/valibot

[Valibot](https://valibot.dev/) schemas for the API of LLM providers:

- Anthropic
- Ollama
- OpenAI
- Vertex AI

## Installtion

### From [npm](https://www.npmjs.com/)

```bash
deno add npm:@open-schemas/valibot
```

```bash
npm add @open-schemas/valibot
```

```bash
yarn add @open-schemas/valibot
```

```bash
pnpm add @open-schemas/valibot
```

```bash
bun add @open-schemas/valibot
```

### From [JSR](https://jsr.io/)

```bash
deno add @open-schemas/valibot
```

```bash
npx jsr add @open-schemas/valibot
```

```bash
yarn dlx jsr add @open-schemas/valibot
```

```bash
pnpm dlx jsr add @open-schemas/valibot
```

```bash
bunx jsr add @open-schemas/valibot
```

## Usage

```ts
import { CreateChatCompletionRequest } from "@open-schemas/valibot/openai";

CreateChatCompletionRequest.parse({});
```

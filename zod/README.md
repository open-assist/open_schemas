# @open-schemas/zod

[Zod](https://zod.dev/) schemas for the API of LLM providers:

- Anthropic
- Ollama
- OpenAI
- Vertex AI

## Installtion

### From [npm](https://www.npmjs.com/)

```bash
deno add npm:@open-schemas/zod
```

```bash
npm add @open-schemas/zod
```

```bash
yarn add @open-schemas/zod
```

```bash
pnpm add @open-schemas/zod
```

```bash
bun add @open-schemas/zod
```

### From [JSR](https://jsr.io/)

```bash
deno add @open-schemas/zod
```

```bash
npx jsr add @open-schemas/zod
```

```bash
yarn dlx jsr add @open-schemas/zod
```

```bash
pnpm dlx jsr add @open-schemas/zod
```

```bash
bunx jsr add @open-schemas/zod
```

## Usage

### Anthropic

```ts
import { CreateMessageRequest } from "@open-schemas/zod/anthropic";

CreateMessageRequest.parse({});
```

### OpenAI

```ts
import { CreateChatCompletionRequest } from "@open-schemas/zod/openai";

CreateChatCompletionRequest.parse({});
```

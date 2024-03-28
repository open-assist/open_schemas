# @open-schemas/types

Typescript types for the API of LLM providers:

- Anthropic
- Ollama
- OpenAI
- Vertex AI

## Installtion

### From [npm](https://www.npmjs.com/)

```bash
deno add npm:@open-schemas/types
```

```bash
npm add @open-schemas/types
```

```bash
yarn add @open-schemas/types
```

```bash
pnpm add @open-schemas/types
```

```bash
bun add @open-schemas/types
```

### From [JSR](https://jsr.io/)

```bash
deno add @open-schemas/types
```

```bash
npx jsr add @open-schemas/types
```

```bash
yarn dlx jsr add @open-schemas/types
```

```bash
pnpm dlx jsr add @open-schemas/types
```

```bash
bunx jsr add @open-schemas/types
```

## Usage

### Anthropic

```ts
import { CreateMessageRequest } from "@open-schemas/types/anthropic";

const request: CreateMessageRequest = {};
```

### OpenAI

```ts
import { CreateChatCompletionRequest } from "@open-schemas/types/openai";

const request: CreateChatCompletionRequest = {};
```

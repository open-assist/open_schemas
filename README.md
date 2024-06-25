# Open Schemas

Open Schemas is an open source tool that defines schemas for various LLM (Large Language Model) APIs like OpenAI, Google, etc using schema validation tools like Zod, Valibot, etc.

## Motivation

LLMs like GPT-3, LaMDA, and others provide powerful natural language APIs that can be leveraged by developers to build amazing applications. However, these APIs often lack formal schema definitions which can make them harder to use reliably.

Open Schemas aims to solve this by crowdsourcing schema definitions for major LLM APIs using popular schema validation libraries. This provides developers with clear expectations for inputs and outputs of LLM API endpoints.

## Features

- Community-driven schema definitions for LLM APIs like OpenAI, Anthropic, Google, etc.
- Schemas defined using various validation libraries like Zod, Valibot, io-ts, etc.
- Schema definitions for major LLM API endpoints like text completion, embeddings, moderation, etc.
- Easy to integrate schemas into existing or new applications and tools.

## Usage

```ts
import { CreateAssistantRequest } from "https://deno.land/x/open_schemas@0.0.1/zod/openai/mod.ts";

const assistant = CreateAssistantRequest.parse({});
```

## License

Open Schemas is licensed under the MIT license. See [LICENSE](LICENSE) for more information.

## Contact

For questions, suggestions, or discussions, please open an issue or discuss on the repository discussions page.

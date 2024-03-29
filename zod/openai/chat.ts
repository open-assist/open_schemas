import z from "zod";

export type ChatCompletionRequestSystemMessage = z.infer<
  typeof ChatCompletionRequestSystemMessage
>;
export const ChatCompletionRequestSystemMessage = z.object({
  content: z.string(),
  role: z.literal("system").default("system"),
  name: z.string().nullish(),
});

export type ChatCompletionRequestMessageTextContentPart = z.infer<
  typeof ChatCompletionRequestMessageTextContentPart
>;
export const ChatCompletionRequestMessageTextContentPart = z.object({
  type: z.literal("text").default("text"),
  text: z.string(),
});

export type ChatCompletionRequestMessageImageContentPart = z.infer<
  typeof ChatCompletionRequestMessageImageContentPart
>;
export const ChatCompletionRequestMessageImageContentPart = z.object({
  type: z.literal("image_url").default("image_url"),
  image_url: z.object({
    url: z.string(),
    detail: z
      .union([z.literal("auto"), z.literal("low"), z.literal("hight")])
      .nullish(),
  }),
});

export type ChatCompletionRequestMessageContentPart = z.infer<
  typeof ChatCompletionRequestMessageContentPart
>;
export const ChatCompletionRequestMessageContentPart = z.union([
  ChatCompletionRequestMessageTextContentPart,
  ChatCompletionRequestMessageImageContentPart,
]);

export type ChatCompletionRequestUserMessage = z.infer<
  typeof ChatCompletionRequestUserMessage
>;
export const ChatCompletionRequestUserMessage = z.object({
  content: z.union([
    z.string(),
    z.array(ChatCompletionRequestMessageContentPart),
  ]),
  role: z.literal("user").default("user"),
  name: z.string().nullish(),
});

export type ChatCompletionMessageToolCall = z.infer<
  typeof ChatCompletionMessageToolCall
>;
export const ChatCompletionMessageToolCall = z.object({
  id: z.string(),
  type: z.literal("function").default("function"),
  function: z.object({
    name: z.string(),
    arguments: z.string(),
  }),
});

export type ChatCompletionRequestAssistantMessage = z.infer<
  typeof ChatCompletionRequestAssistantMessage
>;
export const ChatCompletionRequestAssistantMessage = z.object({
  content: z.string().nullish(),
  role: z.literal("assistant").default("assistant"),
  name: z.string().nullish(),
  tool_calls: z.array(ChatCompletionMessageToolCall).nullish(),
});

export type ChatCompletionRequestToolMessage = z.infer<
  typeof ChatCompletionRequestToolMessage
>;
export const ChatCompletionRequestToolMessage = z.object({
  role: z.literal("tool").default("tool"),
  content: z.string(),
  tool_call_id: z.string(),
});

export type ChatCompletionRequestMessage = z.infer<
  typeof ChatCompletionRequestMessage
>;
export const ChatCompletionRequestMessage = z.union([
  ChatCompletionRequestSystemMessage,
  ChatCompletionRequestUserMessage,
  ChatCompletionRequestAssistantMessage,
  ChatCompletionRequestToolMessage,
]);

export type ChatCompletionTool = z.infer<typeof ChatCompletionTool>;
export const ChatCompletionTool = z.object({
  type: z.literal("function").default("function"),
  function: z.object({
    name: z.string(),
    description: z.string().nullish(),
    parameters: z.any().nullish(),
  }),
});

export type CreateChatCompletionRequest = z.infer<
  typeof CreateChatCompletionRequest
>;
export const CreateChatCompletionRequest = z.object({
  messages: z.array(ChatCompletionRequestMessage),
  model: z.string(),
  frequency_penalty: z.number().min(-2).max(2).default(0).nullish(),
  logit_bias: z.record(z.number()).nullish(),
  logprobs: z.boolean().nullish(),
  top_logprobs: z.number().min(0).max(20).nullish(),
  max_tokens: z.number().nullish(),
  n: z.number().default(1).nullish(),
  presence_penalty: z.number().min(-2).max(2).default(0).nullish(),
  response_format: z
    .object({
      type: z
        .union([z.literal("text"), z.literal("json_object")])
        .default("text"),
    })
    .default({ type: "text" })
    .nullish(),
  seed: z.number().nullish(),
  stop: z.union([z.string(), z.string()]).nullish(),
  stream: z.boolean().default(false).nullish(),
  temperature: z.number().min(0).max(2).default(1).nullish(),
  top_p: z.number().default(1).nullish(),
  tools: z.array(ChatCompletionTool).nullish(),
  tool_choice: z
    .union([
      z.literal("none"),
      z.literal("auto"),
      z.object({
        type: z.literal("function"),
        function: z.object({
          name: z.string(),
        }),
      }),
    ])
    .nullish(),
  user: z.string().nullish(),
});

export type ChatCompletionToolCall = z.infer<typeof ChatCompletionToolCall>;
export const ChatCompletionToolCall = z.object({
  id: z.string(),
  type: z.literal("function"),
  function: z.object({
    name: z.string(),
    arguments: z.string(),
  }),
});

export type FinishReason = z.infer<typeof FinishReason>;
export const FinishReason = z.union([
  z.literal("stop"),
  z.literal("length"),
  z.literal("content_filter"),
  z.literal("tool_calls"),
]);

export type ChatCompletionLogprobs = z.infer<typeof ChatCompletionLogprobs>;
export const ChatCompletionLogprobs = z.object({
  content: z
    .array(
      z.object({
        token: z.string(),
        logprob: z.number(),
        bytes: z.array(z.number()).nullish(),
        top_logprobs: z.object({
          token: z.string(),
          logprob: z.number(),
          bytes: z.array(z.number()).nullish(),
        }),
      }),
    )
    .nullish(),
});

export type ChatCompletionChoiceContent = z.infer<
  typeof ChatCompletionChoiceContent
>;
export const ChatCompletionChoiceContent = z.object({
  content: z.string().nullish(),
  tool_calls: z.array(ChatCompletionToolCall).nullish(),
  role: z.literal("assistant").default("assistant"),
});

export type ChatCompletionChoice = z.infer<typeof ChatCompletionChoice>;
export const ChatCompletionChoice = z.object({
  finish_reason: FinishReason,
  index: z.number().min(0),
  message: ChatCompletionChoiceContent,
  logprobs: ChatCompletionLogprobs.nullish(),
});

export type ChatCompletionObject = z.infer<typeof ChatCompletionObject>;
export const ChatCompletionObject = z.object({
  id: z.string(),
  choices: z.array(ChatCompletionChoice),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  object: z.literal("chat.completion").default("chat.completion"),
  usage: z.object({
    completion_tokens: z.number(),
    prompt_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export type ChatCompletionChunkChoice = z.infer<
  typeof ChatCompletionChunkChoice
>;
export const ChatCompletionChunkChoice = z.object({
  delta: ChatCompletionChoiceContent,
  logprobs: ChatCompletionLogprobs.nullish(),
  finish_reason: FinishReason.nullish(),
  index: z.number().min(0),
});

export type ChatCompletionChunkObject = z.infer<
  typeof ChatCompletionChunkObject
>;
export const ChatCompletionChunkObject = z.object({
  id: z.string(),
  choices: z.array(ChatCompletionChunkChoice),
  created: z.number(),
  model: z.string(),
  system_fingerprint: z.string(),
  object: z.literal("chat.completion.chunk").default("chat.completion.chunk"),
});

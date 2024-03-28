import * as v from "valibot";

export type ChatCompletionRequestSystemMessage = v.Output<
  typeof ChatCompletionRequestSystemMessage
>;
export const ChatCompletionRequestSystemMessage = v.object({
  content: v.string(),
  role: v.literal("system"),
  name: v.nullish(v.string()),
});

export type ChatCompletionRequestMessageTextContentPart = v.Output<
  typeof ChatCompletionRequestMessageTextContentPart
>;
export const ChatCompletionRequestMessageTextContentPart = v.object({
  type: v.literal("text"),
  text: v.string(),
});

export type ChatCompletionRequestMessageImageContentPart = v.Output<
  typeof ChatCompletionRequestMessageImageContentPart
>;
export const ChatCompletionRequestMessageImageContentPart = v.object({
  type: v.literal("image_url"),
  image_url: v.object({
    url: v.string(),
    detail: v.nullish(
      v.union([v.literal("auto"), v.literal("low"), v.literal("hight")]),
    ),
  }),
});

export type ChatCompletionRequestMessageContentPart = v.Output<
  typeof ChatCompletionRequestMessageContentPart
>;
export const ChatCompletionRequestMessageContentPart = v.union([
  ChatCompletionRequestMessageTextContentPart,
  ChatCompletionRequestMessageImageContentPart,
]);

export type ChatCompletionRequestUserMessage = v.Output<
  typeof ChatCompletionRequestUserMessage
>;
export const ChatCompletionRequestUserMessage = v.object({
  content: v.union([
    v.string(),
    v.array(ChatCompletionRequestMessageContentPart),
  ]),
  role: v.literal("user"),
  name: v.nullish(v.string()),
});

export type ChatCompletionMessageToolCall = v.Output<
  typeof ChatCompletionMessageToolCall
>;
export const ChatCompletionMessageToolCall = v.object({
  id: v.string(),
  type: v.literal("function"),
  function: v.object({
    name: v.string(),
    arguments: v.string(),
  }),
});

export type ChatCompletionRequestAssistantMessage = v.Output<
  typeof ChatCompletionRequestAssistantMessage
>;
export const ChatCompletionRequestAssistantMessage = v.object({
  content: v.nullish(v.string()),
  role: v.literal("assistant"),
  name: v.nullish(v.string()),
  tool_calls: v.nullish(v.array(ChatCompletionMessageToolCall)),
});

export type ChatCompletionRequestToolMessage = v.Output<
  typeof ChatCompletionRequestToolMessage
>;
export const ChatCompletionRequestToolMessage = v.object({
  role: v.literal("tool"),
  content: v.string(),
  tool_call_id: v.string(),
});

export type ChatCompletionRequestMessage = v.Output<
  typeof ChatCompletionRequestMessage
>;
export const ChatCompletionRequestMessage = v.union([
  ChatCompletionRequestSystemMessage,
  ChatCompletionRequestUserMessage,
  ChatCompletionRequestAssistantMessage,
  ChatCompletionRequestToolMessage,
]);

export type ChatCompletionTool = v.Output<typeof ChatCompletionTool>;
export const ChatCompletionTool = v.object({
  type: v.literal("function"),
  function: v.object({
    name: v.string(),
    description: v.nullish(v.string()),
    parameters: v.nullish(v.any()),
  }),
});

export type CreateChatCompletionRequest = v.Output<
  typeof CreateChatCompletionRequest
>;
export const CreateChatCompletionRequest = v.object({
  messages: v.array(ChatCompletionRequestMessage),
  model: v.string(),
  frequency_penalty: v.nullish(v.number([v.minValue(-2), v.maxValue(2)])),
  logit_bias: v.nullish(v.record(v.number())),
  logprobs: v.nullish(v.boolean()),
  top_logprobs: v.nullish(v.number([v.minValue(0), v.maxValue(20)])),
  max_tokens: v.nullish(v.number()),
  n: v.nullish(v.number()),
  presence_penalty: v.nullish(v.number([v.minValue(-2), v.maxValue(2)])),
  response_format: v.nullish(
    v.object({
      type: v.union([v.literal("text"), v.literal("json_object")]),
    }),
  ),
  seed: v.nullish(v.number()),
  stop: v.nullish(v.union([v.string(), v.string()])),
  stream: v.nullish(v.boolean()),
  temperature: v.nullish(v.number([v.minValue(0), v.maxValue(2)])),
  top_p: v.nullish(v.number()),
  tools: v.nullish(v.array(ChatCompletionTool)),
  tool_choice: v.nullish(
    v.union([
      v.literal("none"),
      v.literal("auto"),
      v.object({
        type: v.literal("function"),
        function: v.object({
          name: v.string(),
        }),
      }),
    ]),
  ),
  user: v.nullish(v.string()),
});

export type ChatCompletionToolCall = v.Output<typeof ChatCompletionToolCall>;
export const ChatCompletionToolCall = v.object({
  id: v.string(),
  type: v.literal("function"),
  function: v.object({
    name: v.string(),
    arguments: v.string(),
  }),
});

export type FinishReason = v.Output<typeof FinishReason>;
export const FinishReason = v.union([
  v.literal("stop"),
  v.literal("length"),
  v.literal("content_filter"),
  v.literal("tool_calls"),
]);

export type ChatCompletionLogprobs = v.Output<typeof ChatCompletionLogprobs>;
export const ChatCompletionLogprobs = v.object({
  content: v.nullish(
    v.array(
      v.object({
        token: v.string(),
        logprob: v.number(),
        bytes: v.nullish(v.array(v.number())),
        top_logprobs: v.object({
          token: v.string(),
          logprob: v.number(),
          bytes: v.nullish(v.array(v.number())),
        }),
      }),
    ),
  ),
});

export type ChatCompletionChoiceContent = v.Output<
  typeof ChatCompletionChoiceContent
>;
export const ChatCompletionChoiceContent = v.object({
  content: v.nullish(v.string()),
  tool_calls: v.nullish(v.array(ChatCompletionToolCall)),
  role: v.literal("assistant"),
});

export type ChatCompletionChoice = v.Output<typeof ChatCompletionChoice>;
export const ChatCompletionChoice = v.object({
  finish_reason: FinishReason,
  index: v.number([v.minValue(0)]),
  message: ChatCompletionChoiceContent,
  logprobs: v.nullish(ChatCompletionLogprobs),
});

export type ChatCompletionObject = v.Output<typeof ChatCompletionObject>;
export const ChatCompletionObject = v.object({
  id: v.string(),
  choices: v.array(ChatCompletionChoice),
  created: v.number(),
  model: v.string(),
  system_fingerprint: v.string(),
  object: v.literal("chat.completion"),
  usage: v.object({
    completion_tokens: v.number(),
    prompt_tokens: v.number(),
    total_tokens: v.number(),
  }),
});

export type ChatCompletionChunkChoice = v.Output<
  typeof ChatCompletionChunkChoice
>;
export const ChatCompletionChunkChoice = v.object({
  delta: ChatCompletionChoiceContent,
  logprobs: v.nullish(ChatCompletionLogprobs),
  finish_reason: v.nullish(FinishReason),
  index: v.number([v.minValue(0)]),
});

export type ChatCompletionChunkObject = v.Output<
  typeof ChatCompletionChunkObject
>;
export const ChatCompletionChunkObject = v.object({
  id: v.string(),
  choices: v.array(ChatCompletionChunkChoice),
  created: v.number(),
  model: v.string(),
  system_fingerprint: v.string(),
  object: v.literal("chat.completion.chunk"),
  usage: v.object({
    completion_tokens: v.number(),
    prompt_tokens: v.number(),
    total_tokens: v.number(),
  }),
});

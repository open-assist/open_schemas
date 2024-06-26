import z from "zod";

export type ImageContentSource = z.infer<typeof ImageContentSource>;
export const ImageContentSource = z.object({
  type: z.literal("base64").default("base64"),
  media_type: z
    .union([z.literal("image/jpeg"), z.literal("image/png"), z.literal("image/gif")])
    .nullish(),
  data: z.string(),
});

export type ImageContent = z.infer<typeof ImageContent>;
export const ImageContent = z.object({
  type: z.literal("image").default("image"),
  source: ImageContentSource,
});

export type TextContent = z.infer<typeof TextContent>;
export const TextContent = z.object({
  type: z.literal("text").default("text"),
  text: z.string(),
});

export type ToolUseContent = z.infer<typeof ToolUseContent>;
export const ToolUseContent = z.object({
  type: z.literal("tool_use").default("tool_use"),
  id: z.string(),
  name: z.string(),
  input: z.record(z.unknown()),
});

export type ToolResultContent = z.infer<typeof ToolResultContent>;
export const ToolResultContent = z.object({
  type: z.literal("tool_result").default("tool_result"),
  tool_use_id: z.string(),
  content: z.union([z.string(), z.array(TextContent)]).nullish(),
  is_error: z.boolean().nullish(),
});

export type Content = z.infer<typeof Content>;
export const Content = z.union([TextContent, ImageContent, ToolUseContent, ToolResultContent]);

export type Message = z.infer<typeof Message>;
export const Message = z.object({
  role: z.union([z.literal("user"), z.literal("assistant")]),
  content: z.union([z.string(), z.array(Content)]).nullish(),
});

export type Tool = z.infer<typeof Tool>;
export const Tool = z.object({
  name: z.string(),
  description: z.string().nullish(),
  input_schema: z.record(z.unknown()),
});

export type CreateMessageRequest = z.infer<typeof CreateMessageRequest>;
export const CreateMessageRequest = z.object({
  model: z.string(),
  messages: z.array(Message).min(1),
  system: z.string().nullish(),
  max_tokens: z.number().min(1),
  metadata: z
    .object({
      user_id: z.string(),
    })
    .nullish(),
  stop_sequences: z.array(z.string()).nullish(),
  stream: z.boolean().default(false).nullish(),
  temperature: z.number().min(0).max(1).default(1).nullish(),
  tools: z.array(Tool).nullish(),
  top_p: z.number().nullish(),
  top_k: z.number().nullish(),
});

export type StopReason = z.infer<typeof StopReason>;
export const StopReason = z.union([
  z.literal("end_turn"),
  z.literal("max_tokens"),
  z.literal("stop_sequence"),
  z.literal("tool_use"),
]);

export type MessageUsage = z.infer<typeof MessageUsage>;
export const MessageUsage = z.object({
  input_tokens: z.number().min(0),
  output_tokens: z.number().min(0),
});

export type CreateMessageResponse = z.infer<typeof CreateMessageResponse>;
export const CreateMessageResponse = z.object({
  id: z.string(),
  type: z.literal("message").default("message"),
  role: z.literal("assistant").default("assistant"),
  content: z.array(z.union([TextContent, ToolUseContent])),
  model: z.string(),
  stop_reason: StopReason,
  stop_sequence: z.string().nullish(),
  usage: MessageUsage,
});

export type MessageStartEvent = z.infer<typeof MessageStartEvent>;
export const MessageStartEvent = z.object({
  type: z.literal("message_start").default("message_start"),
  message: z.object({
    id: z.string(),
    type: z.literal("message"),
    role: z.literal("assistant"),
    model: z.string(),
    usage: MessageUsage,
  }),
});

export type MessageDeltaEvent = z.infer<typeof MessageDeltaEvent>;
export const MessageDeltaEvent = z.object({
  type: z.literal("message_delta"),
  delta: z.object({
    stop_reason: StopReason.nullish(),
    stop_sequence: z.string().nullish(),
  }),
  usage: z.object({
    output_tokens: z.number().min(0),
  }),
});

export type MessageStopEvent = z.infer<typeof MessageStopEvent>;
export const MessageStopEvent = z.object({
  type: z.literal("message_stop"),
});

export type ContentBlockStartEvent = z.infer<typeof ContentBlockStartEvent>;
export const ContentBlockStartEvent = z.object({
  type: z.literal("content_block_start"),
  index: z.number().min(0),
  content_block: z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
});

export type ContentBlockDeltaEvent = z.infer<typeof ContentBlockDeltaEvent>;
export const ContentBlockDeltaEvent = z.object({
  type: z.literal("content_block_delta"),
  index: z.number(),
  delta: z.object({
    type: z.literal("text_delta"),
    text: z.string(),
  }),
});

export type ContentBlockStopEvent = z.infer<typeof ContentBlockStopEvent>;
export const ContentBlockStopEvent = z.object({
  type: z.literal("content_block_stop"),
  index: z.number().min(0),
});

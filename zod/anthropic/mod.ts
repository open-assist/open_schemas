import { z } from "zod";
export const TextContent = z.object({
  type: z.enum(["text"]),
  text: z.string(),
});
export type TextContentType = z.infer<typeof TextContent>;

export const ImageContent = z.object({
  type: z.enum(["image"]),
  source: z.object({
    type: z.enum(["base64"]),
    media_type: z.enum(["image/jpeg", "image/png", "image/gif"]),
    data: z.string(),
  }),
});
export type ImageContentType = z.infer<typeof ImageContent>;

export const Content = z.union([TextContent, ImageContent]);
export type ContentType = z.infer<typeof Content>;

export const Message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.union([z.string(), z.array(Content)]),
});
export type MessageType = z.infer<typeof Message>;

export const CreateMessageRequest = z.object({
  model: z.string(),
  messages: z.array(Message).min(1),
  system: z.string().optional(),
  max_tokens: z.number().min(1).max(4096),
  metadata: z
    .object({
      user_id: z.string(),
    })
    .optional(),
  stop_sequences: z.array(z.string()).optional(),
  stream: z.boolean().default(false).optional(),
  temperature: z.number().min(0).max(1).default(1).optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
});
export type CreateMessageRequestType = z.infer<typeof CreateMessageRequest>;

export const MessageUsage = z.object({
  input_tokens: z.number().optional(),
  output_tokens: z.number().optional(),
});
export type MessageUsageType = z.infer<typeof MessageUsage>;

export const StopReason = z.enum(["end_turn", "max_tokens", "stop_sequence"]);
export type StopReasonType = z.infer<typeof StopReason>;

export const CreateMessageResponse = z.object({
  id: z.string(),
  type: z.enum(["message"]),
  role: z.enum(["assistant"]),
  content: z.array(TextContent),
  model: z.string(),
  stop_reason: StopReason.nullish(),
  stop_sequence: z.string().nullish(),
  usage: MessageUsage.nullish(),
});
export type CreateMessageResponseType = z.infer<typeof CreateMessageResponse>;

export const MessageStartEvent = z.object({
  type: z.enum(["message_start"]),
  message: z.object({
    id: z.string(),
    type: z.enum(["message"]),
    role: z.string(),
    content: z.array(z.any()),
    model: z.string(),
    stop_reason: StopReason.nullish(),
    usage: MessageUsage.nullish(),
  }),
});
export type MessageStartEventType = z.infer<typeof MessageStartEvent>;

export const MessageDeltaEvent = z.object({
  type: z.enum(["message_delta"]),
  delta: z.object({
    stop_reason: StopReason.nullish(),
    stop_sequence: z.string().nullish(),
  }),
  usage: MessageUsage.nullish(),
});
export type MessageDeltaEventType = z.infer<typeof MessageDeltaEvent>;

export const MessageStopEvent = z.object({
  type: z.enum(["message_stop"]),
});
export type MessageStopEventType = z.infer<typeof MessageStopEvent>;

export const ContentBlockDeltaEvent = z.object({
  type: z.enum(["content_block_delta"]),
  index: z.number(),
  delta: z.object({
    type: z.string(),
    text: z.string(),
  }),
});
export type ContentBlockDeltaEventType = z.infer<typeof ContentBlockDeltaEvent>;

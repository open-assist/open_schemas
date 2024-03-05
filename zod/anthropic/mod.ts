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
  input_tokens: z.number(),
  output_tokens: z.number(),
});
export type MessageUsageType = z.infer<typeof MessageUsage>;

export const CreateMessageResponse = z.object({
  id: z.string(),
  type: z.enum(["message"]),
  role: z.enum(["assistant"]),
  content: z.array(TextContent),
  model: z.string(),
  stop_reason: z.enum(["end_turn", "max_tokens", "stop_sequence"]).optional(),
  stop_sequence: z.string().optional(),
  usage: MessageUsage.optional(),
});
export type CreateMessageResponseType = z.infer<typeof CreateMessageResponse>;

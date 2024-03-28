import z from "zod";

export type TextContent = z.infer<typeof TextContent>;
export const TextContent = z.object({
  type: z.literal("text").default("text"),
  text: z.string(),
});

export type ImageContentSource = z.infer<typeof ImageContentSource>;
export const ImageContentSource = z.object({
  type: z.literal("base64").default("base64"),
  media_type: z
    .union([
      z.literal("image/jpeg"),
      z.literal("image/png"),
      z.literal("image/gif"),
    ])
    .nullish(),
  data: z.string(),
});

export type ImageContent = z.infer<typeof ImageContent>;
export const ImageContent = z.object({
  type: z.literal("image").default("image"),
  source: ImageContentSource,
});

export type Content = z.infer<typeof Content>;
export const Content = z.union([TextContent, ImageContent]);

export type Message = z.infer<typeof Message>;
export const Message = z.object({
  role: z.union([z.literal("user"), z.literal("assistant")]),
  content: z.union([z.string(), z.array(Content)]).nullish(),
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
  top_p: z.number().nullish(),
  top_k: z.number().nullish(),
});

export type StopReason = z.infer<typeof StopReason>;
export const StopReason = z.union([
  z.literal("end_turn"),
  z.literal("max_tokens"),
  z.literal("stop_sequence"),
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
  content: z.array(TextContent),
  model: z.string(),
  stop_reason: StopReason,
  stop_sequence: z.string().nullish(),
  usage: MessageUsage,
});

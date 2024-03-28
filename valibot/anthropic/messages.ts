import * as v from "valibot";

export type ImageContentSource = v.Output<typeof ImageContentSource>;
export const ImageContentSource = v.object({
  type: v.literal("base64"),
  media_type: v.nullish(
    v.union([
      v.literal("image/jpeg"),
      v.literal("image/png"),
      v.literal("image/gif"),
    ]),
  ),
  data: v.string(),
});

export type ImageContent = v.Output<typeof ImageContent>;
export const ImageContent = v.object({
  type: v.literal("image"),
  source: ImageContentSource,
});

export type TextContent = v.Output<typeof TextContent>;
export const TextContent = v.object({
  type: v.literal("text"),
  text: v.string(),
});

export type Content = v.Output<typeof Content>;
export const Content = v.union([TextContent, ImageContent]);

export type Message = v.Output<typeof Message>;
export const Message = v.object({
  role: v.union([v.literal("user"), v.literal("assistant")]),
  content: v.nullish(v.union([v.string(), v.array(Content)])),
});

export type CreateMessageRequest = v.Output<typeof CreateMessageRequest>;
export const CreateMessageRequest = v.object({
  model: v.string(),
  messages: v.array(Message, [v.minLength(1)]),
  system: v.nullish(v.string()),
  max_tokens: v.number([v.minValue(1)]),
  metadata: v.nullish(
    v.object({
      user_id: v.string(),
    }),
  ),
  stop_sequences: v.nullish(v.array(v.string())),
  stream: v.nullish(v.boolean()),
  temperature: v.nullish(v.number([v.minValue(0), v.maxValue(1)])),
  top_p: v.nullish(v.number()),
  top_k: v.nullish(v.number()),
});

export type StopReason = v.Output<typeof StopReason>;
export const StopReason = v.union([
  v.literal("end_turn"),
  v.literal("max_tokens"),
  v.literal("stop_sequence"),
]);

export type MessageUsage = v.Output<typeof MessageUsage>;
export const MessageUsage = v.object({
  input_tokens: v.number([v.minValue(0)]),
  output_tokens: v.number([v.minValue(0)]),
});

export type CreateMessageResponse = v.Output<typeof CreateMessageResponse>;
export const CreateMessageResponse = v.object({
  id: v.string(),
  type: v.literal("message"),
  role: v.literal("assistant"),
  content: v.array(TextContent),
  model: v.string(),
  stop_reason: StopReason,
  stop_sequence: v.nullish(v.string()),
  usage: MessageUsage,
});

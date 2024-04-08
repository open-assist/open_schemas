import * as v from "valibot";

export type ImageContentSource = v.Output<typeof ImageContentSource>;
export const ImageContentSource = v.object({
  type: v.literal("base64"),
  media_type: v.optional(
    v.nullable(v.union([v.literal("image/jpeg"), v.literal("image/png"), v.literal("image/gif")])),
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

export type ToolUseContent = v.Output<typeof ToolUseContent>;
export const ToolUseContent = v.object({
  type: v.literal("tool_use"),
  id: v.string(),
  name: v.string(),
  input: v.record(v.unknown()),
});

export type ToolResultContent = v.Output<typeof ToolResultContent>;
export const ToolResultContent = v.object({
  type: v.literal("tool_result"),
  tool_use_id: v.string(),
  content: v.optional(v.nullable(v.union([v.string(), v.array(TextContent)]))),
  is_error: v.optional(v.boolean()),
});

export type Content = v.Output<typeof Content>;
export const Content = v.union([TextContent, ImageContent, ToolUseContent, ToolResultContent]);

export type Message = v.Output<typeof Message>;
export const Message = v.object({
  role: v.union([v.literal("user"), v.literal("assistant")]),
  content: v.optional(v.nullable(v.union([v.string(), v.array(Content)]))),
});

export type Tool = v.Output<typeof Tool>;
export const Tool = v.object({
  name: v.string(),
  description: v.optional(v.nullable(v.string())),
  input_schema: v.record(v.unknown()),
});

export type CreateMessageRequest = v.Output<typeof CreateMessageRequest>;
export const CreateMessageRequest = v.object({
  model: v.string(),
  messages: v.array(Message, [v.minLength(1)]),
  system: v.optional(v.nullable(v.string())),
  max_tokens: v.number([v.minValue(1)]),
  metadata: v.optional(
    v.nullable(
      v.object({
        user_id: v.string(),
      }),
    ),
  ),
  stop_sequences: v.optional(v.nullable(v.array(v.string()))),
  stream: v.optional(v.nullable(v.boolean())),
  temperature: v.optional(v.nullable(v.number([v.minValue(0), v.maxValue(1)]))),
  tools: v.optional(v.nullable(v.array(Tool))),
  top_p: v.optional(v.nullable(v.number())),
  top_k: v.optional(v.nullable(v.number())),
});

export type StopReason = v.Output<typeof StopReason>;
export const StopReason = v.union([
  v.literal("end_turn"),
  v.literal("max_tokens"),
  v.literal("stop_sequence"),
  v.literal("tool_use"),
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
  content: v.array(v.union([TextContent, ToolUseContent])),
  model: v.string(),
  stop_reason: StopReason,
  stop_sequence: v.optional(v.nullable(v.string())),
  usage: MessageUsage,
});

export type MessageStartEvent = v.Output<typeof MessageStartEvent>;
export const MessageStartEvent = v.object({
  type: v.literal("message_start"),
  message: v.object({
    id: v.string(),
    type: v.literal("message"),
    role: v.literal("assistant"),
    model: v.string(),
    usage: MessageUsage,
  }),
});

export type MessageDeltaEvent = v.Output<typeof MessageDeltaEvent>;
export const MessageDeltaEvent = v.object({
  type: v.literal("message_delta"),
  delta: v.object({
    stop_reason: v.optional(v.nullable(StopReason)),
    stop_sequence: v.optional(v.nullable(v.string())),
  }),
  usage: v.object({
    output_tokens: v.number([v.minValue(0)]),
  }),
});

export type MessageStopEvent = v.Output<typeof MessageStopEvent>;
export const MessageStopEvent = v.object({
  type: v.literal("message_stop"),
});

export type ContentBlockStartEvent = v.Output<typeof ContentBlockStartEvent>;
export const ContentBlockStartEvent = v.object({
  type: v.literal("content_block_start"),
  index: v.number([v.minValue(0)]),
  content_block: v.object({
    type: v.literal("text"),
    text: v.string(),
  }),
});

export type ContentBlockDeltaEvent = v.Output<typeof ContentBlockDeltaEvent>;
export const ContentBlockDeltaEvent = v.object({
  type: v.literal("content_block_delta"),
  index: v.number(),
  delta: v.object({
    type: v.literal("text_delta"),
    text: v.string(),
  }),
});

export type ContentBlockStopEvent = v.Output<typeof ContentBlockStopEvent>;
export const ContentBlockStopEvent = v.object({
  type: v.literal("content_block_stop"),
  index: v.number([v.minValue(0)]),
});

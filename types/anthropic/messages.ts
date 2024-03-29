/**
 * The source of ImageContent.
 *
 * Currently support the base64 source type for images, and the image/jpeg, image/png, image/gif,
 * and image/webp media types.
 */
export type ImageContentSource = {
  /**
   * @default base64
   */
  type: "base64";
  media_type?: "image/jpeg" | "image/png" | "image/gif";
  data: string;
};

/**
 * Starting with Claude 3 models, you can also send image content.
 *
 * @example
 * ```ts
 * {
 *   "type": "image",
 *   "source": {
 *     "type": "base64",
 *     "media_type": "image/jpeg",
 *     "data": "/9j/4AAQSkZJRg...",
 *   }
 * }
 * ```
 */
export type ImageContent = {
  /**
   * @default image
   */
  type: "image";
  source: ImageContentSource;
};

/**
 * Text content.
 *
 * @example
 * ```ts
 * {"type": "text", "text": "What is in this image?"}
 * ```
 */
export type TextContent = {
  /**
   * @default text
   */
  type: "text";
  text: string;
};

/**
 * The union type of TextContent and ImageContent.
 */
export type Content = TextContent | ImageContent;

/**
 * Input messages.
 *
 * Our models are trained to operate on alternating user and assistant conversational turns. When
 * creating a new Message, you specify the prior conversational turns with the messages parameter,
 * and the model then generates the next Message in the conversation.
 *
 * @example user message
 * ```ts
 * {"role": "user", "content": "Hello, Claude"}
 * ```
 *
 * @example assistant message
 * ```ts
 * {"role": "assistant", "content": [{"type": "text", "text": "Hello, How can I assist you today?"}]}
 * ```
 */
export type Message = {
  role: "user" | "assistant";
  content?: string | Content[];
};

/**
 * The request for
 * {@link https://docs.anthropic.com/claude/reference/messages_post | creating a message}.
 */
export type CreateMessageRequest = {
  model: string;
  /**
   * @minItems 1
   */
  messages: Message[];
  system?: string;
  /**
   * @minimum 1
   */
  max_tokens: number;
  metadata?: {
    user_id: string;
  };
  stop_sequences?: string[];
  /**
   * @default false
   */
  stream?: boolean;
  /**
   * @default 1
   * @maximum 1
   * @minimum 0
   */
  temperature?: number;
  top_p?: number;
  top_k?: number;
};

/**
 * The reason that we stopped.
 */
export type StopReason = "end_turn" | "max_tokens" | "stop_sequence";

/**
 * Billing and rate-limit usage.
 */
export type MessageUsage = {
  /**
   * @minimum 0
   */
  input_tokens: number;
  /**
   * @minimum 0
   */
  output_tokens: number;
};

/**
 * The response for
 * {@link https://docs.anthropic.com/claude/reference/messages_post | creating a message}.
 */
export type CreateMessageResponse = {
  id: string;
  /**
   * @default message
   */
  type: "message";
  /**
   * @default assistant
   */
  role: "assistant";
  content: TextContent[];
  model: string;
  stop_reason: StopReason;
  stop_sequence?: string;
  usage: MessageUsage;
};

/**
 * Contains a Message object with empty content.
 *
 * @example
 * ```js
 * event: message_start
 * data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-3-opus-20240229", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}
 * ```
 */
export type MessageStartEvent = {
  /**
   * @default message_start
   */
  type: "message_start";
  message: Message;
};

/**
 * Indicates top-level changes to the final Message object.
 *
 * @example
 * ```js
 * event: message_delta
 * data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null, "usage":{"output_tokens": 15}}}
 * ```
 */
export type MessageDeltaEvent = {
  type: "message_delta";
  delta: {
    stop_reason?: StopReason;
    stop_sequence?: string;
  };
  usage: {
    /**
     * @minimum 0
     */
    output_tokens: number;
  };
};

/**
 * A final message_stop event.
 *
 * @example
 * ```js
 * event: message_stop
 * data: {"type": "message_stop"}
 * ```
 */
export type MessageStopEvent = {
  type: "message_stop";
};

/**
 * The start event for content block.
 *
 * @example
 * ```js
 * event: content_block_start
 * data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}
 * ```
 */
export type ContentBlockStartEvent = {
  type: "content_block_start";
  /**
   * @minimum 0
   */
  index: number;
  content_block: {
    type: "text";
    text: string;
  };
};

/**
 * The delta event for content block.
 *
 * @example
 * ```js
 * event: content_block_delta
 * data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}
 * ```
 */
export type ContentBlockDeltaEvent = {
  type: "content_block_delta";
  index: number;
  delta: {
    type: "text_delta";
    text: string;
  };
};

/**
 * The stop event for content block.
 *
 * @example
 * ```js
 * event: content_block_stop
 * data: {"type": "content_block_stop", "index": 0}
 * ```
 */
export type ContentBlockStopEvent = {
  type: "content_block_stop";
  /**
   * @minimum 0
   */
  index: number;
};

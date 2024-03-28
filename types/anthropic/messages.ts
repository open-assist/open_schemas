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

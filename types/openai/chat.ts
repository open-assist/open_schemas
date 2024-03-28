export type ChatCompletionRequestSystemMessage = {
  content: string;
  /**
   * @default system
   */
  role: "system";
  name?: string;
};

export type ChatCompletionRequestMessageTextContentPart = {
  /**
   * @default text
   */
  type: "text";
  text: string;
};

export type ChatCompletionRequestMessageImageContentPart = {
  /**
   * @default image_url
   */
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "hight";
  };
};

export type ChatCompletionRequestMessageContentPart =
  | ChatCompletionRequestMessageTextContentPart
  | ChatCompletionRequestMessageImageContentPart;

export type ChatCompletionRequestUserMessage = {
  content: string | ChatCompletionRequestMessageContentPart[];
  /**
   * @default user
   */
  role: "user";
  name?: string;
};

export type ChatCompletionMessageToolCall = {
  id: string;
  /**
   * @default function
   */
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type ChatCompletionRequestAssistantMessage = {
  content?: string;
  /**
   * @default assistant
   */
  role: "assistant";
  name?: string;
  tool_calls?: ChatCompletionMessageToolCall[];
};

export type ChatCompletionRequestToolMessage = {
  /**
   * @default tool
   */
  role: "tool";
  content: string;
  tool_call_id: string;
};

export type ChatCompletionRequestMessage =
  | ChatCompletionRequestSystemMessage
  | ChatCompletionRequestUserMessage
  | ChatCompletionRequestAssistantMessage
  | ChatCompletionRequestToolMessage;

export type ChatCompletionTool = {
  /**
   * @default function
   */
  type: "function";
  function: {
    name: string;
    description?: string;
    // deno-lint-ignore no-explicit-any
    parameters?: any;
  };
};

export type CreateChatCompletionRequest = {
  messages: ChatCompletionRequestMessage[];
  model: string;
  /**
   * @maximum 2.0
   * @minimum '-2.0
   * @default 0
   */
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  logprobs?: boolean;
  /**
   * @maximum 20
   * @minimum 0
   */
  top_logprobs?: number;
  max_tokens?: number;
  /**
   * @default 1
   */
  n?: number;
  /**
   * @maximum 2.0
   * @minimum '-2.0
   * @default 0
   */
  presence_penalty?: number;
  /**
   * @default { type: 'text' }
   */
  response_format?: {
    /**
     * @default text
     */
    type: "text" | "json_object";
  };
  seed?: number;
  stop?: string | string;
  /**
   * @default false
   */
  stream?: boolean;
  /**
   * @maximum 2
   * @minimum 0
   * @default 1
   */
  temperature?: number;
  /**
   * @default 1
   */
  top_p?: number;
  tools?: ChatCompletionTool[];
  tool_choice?:
    | "none"
    | "auto"
    | {
        type: "function";
        function: {
          name: string;
        };
      };
  user?: string;
};

export type ChatCompletionToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type FinishReason = "stop" | "length" | "content_filter" | "tool_calls";

export type ChatCompletionLogprobs = {
  content?: {
    token: string;
    logprob: number;
    bytes?: number[];
    top_logprobs: {
      token: string;
      logprob: number;
      bytes?: number[];
    };
  }[];
};

export type ChatCompletionChoiceContent = {
  content?: string;
  tool_calls?: ChatCompletionToolCall[];
  /**
   * @default assistant
   */
  role: "assistant";
};

export type ChatCompletionChoice = {
  finish_reason: FinishReason;
  /**
   * @minimum 0
   */
  index: number;
  message: ChatCompletionChoiceContent;
  logprobs?: ChatCompletionLogprobs;
};

/**
 * Represents a chat completion response returned by model, based on the provided input.
 */
export type ChatCompletionObject = {
  /** */
  id: string;
  choices: ChatCompletionChoice[];
  created: number;
  model: string;
  system_fingerprint: string;
  /**
   * The object type, which is always `chat.completion`.
   *
   * @default chat.completion
   */
  object: "chat.completion";
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
};

export type ChatCompletionChunkChoice = {
  delta: ChatCompletionChoiceContent;
  logprobs?: ChatCompletionLogprobs;
  finish_reason?: FinishReason;
  /**
   * @minimum 0
   */
  index: number;
};

export type ChatCompletionChunkObject = {
  id: string;
  choices: ChatCompletionChunkChoice[];
  created: number;
  model: string;
  system_fingerprint: string;
  /**
   * The object type, which is always `chat.completion`.
   *
   * @default chat.completion.chunk
   */
  object: "chat.completion.chunk";
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
};

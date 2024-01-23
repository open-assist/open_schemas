import { z } from "zod";

const ChatCompletionRequestSystemMessage = z.object({
  content: z.string(),
  role: z.enum(["system"]),
  name: z.string().optional(),
});
const ChatCompletionRequestMessageContentPartText = z.object({ type: z.enum(["text"]), text: z.string() });
const ChatCompletionRequestMessageContentPartImage = z.object({
  type: z.enum(["image_url"]),
  image_url: z.object({ url: z.string().url(), detail: z.enum(["auto", "low", "high"]).optional().default("auto") }),
});
const ChatCompletionRequestMessageContentPart = z.union([
  ChatCompletionRequestMessageContentPartText,
  ChatCompletionRequestMessageContentPartImage,
]);
const ChatCompletionRequestUserMessage = z.object({
  content: z.union([z.string(), z.array(ChatCompletionRequestMessageContentPart)]),
  role: z.enum(["user"]),
  name: z.string().optional(),
});
const ChatCompletionMessageToolCall = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({ name: z.string(), arguments: z.string() }),
});
const ChatCompletionMessageToolCalls = z.array(ChatCompletionMessageToolCall);
const ChatCompletionRequestAssistantMessage = z.object({
  content: z.string().nullish(),
  role: z.enum(["assistant"]),
  name: z.string().optional(),
  tool_calls: ChatCompletionMessageToolCalls.optional(),
  function_call: z.object({ arguments: z.string(), name: z.string() }).optional(),
});
const ChatCompletionRequestToolMessage = z.object({
  role: z.enum(["tool"]),
  content: z.string(),
  tool_call_id: z.string(),
});
const ChatCompletionRequestFunctionMessage = z.object({
  role: z.enum(["function"]),
  content: z.string().nullable(),
  name: z.string(),
});
const ChatCompletionRequestMessage = z.union([
  ChatCompletionRequestSystemMessage,
  ChatCompletionRequestUserMessage,
  ChatCompletionRequestAssistantMessage,
  ChatCompletionRequestToolMessage,
  ChatCompletionRequestFunctionMessage,
]);
const FunctionParameters = z.object({}).partial().passthrough();
const FunctionObject = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: FunctionParameters.optional(),
});
const ChatCompletionTool = z.object({ type: z.enum(["function"]), function: FunctionObject });
const ChatCompletionNamedToolChoice = z.object({
  type: z.enum(["function"]),
  function: z.object({ name: z.string() }),
});
const ChatCompletionToolChoiceOption = z.union([z.enum(["none", "auto"]), ChatCompletionNamedToolChoice]);
const ChatCompletionFunctionCallOption = z.object({ name: z.string() });
const ChatCompletionFunctions = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: FunctionParameters.optional(),
});
const CreateChatCompletionRequest = z.object({
  messages: z.array(ChatCompletionRequestMessage).min(1),
  model: z.union([
    z.union([
      z.string(),
      z.enum([
        "gpt-4-1106-preview",
        "gpt-4-vision-preview",
        "gpt-4",
        "gpt-4-0314",
        "gpt-4-0613",
        "gpt-4-32k",
        "gpt-4-32k-0314",
        "gpt-4-32k-0613",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-16k",
        "gpt-3.5-turbo-0301",
        "gpt-3.5-turbo-0613",
        "gpt-3.5-turbo-1106",
        "gpt-3.5-turbo-16k-0613",
      ]),
    ]),
    z.array(
      z.union([
        z.string(),
        z.enum([
          "gpt-4-1106-preview",
          "gpt-4-vision-preview",
          "gpt-4",
          "gpt-4-0314",
          "gpt-4-0613",
          "gpt-4-32k",
          "gpt-4-32k-0314",
          "gpt-4-32k-0613",
          "gpt-3.5-turbo",
          "gpt-3.5-turbo-16k",
          "gpt-3.5-turbo-0301",
          "gpt-3.5-turbo-0613",
          "gpt-3.5-turbo-1106",
          "gpt-3.5-turbo-16k-0613",
        ]),
      ])
    ),
  ]),
  frequency_penalty: z.number().gte(-2).lte(2).nullish(),
  logit_bias: z.record(z.number()).nullish(),
  logprobs: z.boolean().nullish(),
  top_logprobs: z.number().int().lte(5).nullish(),
  max_tokens: z.number().int().nullish(),
  n: z.number().int().gte(1).lte(128).nullish().default(1),
  presence_penalty: z.number().gte(-2).lte(2).nullish(),
  response_format: z
    .object({ type: z.enum(["text", "json_object"]).default("text") })
    .partial()
    .optional(),
  seed: z.number().int().gte(-9223372036854776000).lte(9223372036854776000).nullish(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  stream: z.boolean().nullish(),
  temperature: z.number().lte(2).nullish().default(1),
  top_p: z.number().lte(1).nullish().default(1),
  tools: z.array(ChatCompletionTool).optional(),
  tool_choice: ChatCompletionToolChoiceOption.optional(),
  user: z.string().optional(),
  function_call: z.union([z.enum(["none", "auto"]), ChatCompletionFunctionCallOption]).optional(),
  functions: z.array(ChatCompletionFunctions).min(1).max(128).optional(),
});
const ChatCompletionResponseMessage = z.object({
  content: z.string().nullable(),
  tool_calls: ChatCompletionMessageToolCalls.optional(),
  role: z.enum(["assistant"]),
  function_call: z.object({ arguments: z.string(), name: z.string() }).optional(),
});
const ChatCompletionTokenLogprob = z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.array(z.number()).nullable(),
  top_logprobs: z.array(z.object({ token: z.string(), logprob: z.number(), bytes: z.array(z.number()).nullable() })),
});
const CompletionUsage = z.object({
  completion_tokens: z.number().int(),
  prompt_tokens: z.number().int(),
  total_tokens: z.number().int(),
});
const CreateChatCompletionResponse = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      finish_reason: z.enum(["stop", "length", "tool_calls", "content_filter", "function_call"]),
      index: z.number().int(),
      message: ChatCompletionResponseMessage,
      logprobs: z.object({ content: z.array(ChatCompletionTokenLogprob).nullable() }).nullable(),
    })
  ),
  created: z.number().int(),
  model: z.string(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["chat.completion"]),
  usage: CompletionUsage.optional(),
});
const CreateCompletionRequest = z.object({
  model: z.union([
    z.union([z.string(), z.enum(["gpt-3.5-turbo-instruct", "davinci-002", "babbage-002"])]),
    z.array(z.union([z.string(), z.enum(["gpt-3.5-turbo-instruct", "davinci-002", "babbage-002"])])),
  ]),
  prompt: z
    .union([z.string(), z.array(z.string()), z.array(z.number()), z.array(z.array(z.number()))])
    .nullable()
    .default("<|endoftext|>"),
  best_of: z.number().int().lte(20).nullish().default(1),
  echo: z.boolean().nullish(),
  frequency_penalty: z.number().gte(-2).lte(2).nullish(),
  logit_bias: z.record(z.number()).nullish(),
  logprobs: z.number().int().lte(5).nullish(),
  max_tokens: z.number().int().nullish().default(16),
  n: z.number().int().gte(1).lte(128).nullish().default(1),
  presence_penalty: z.number().gte(-2).lte(2).nullish(),
  seed: z.number().int().gte(-9223372036854776000).lte(9223372036854776000).nullish(),
  stop: z.union([z.string(), z.array(z.string())]).nullish(),
  stream: z.boolean().nullish(),
  suffix: z.string().nullish(),
  temperature: z.number().lte(2).nullish().default(1),
  top_p: z.number().lte(1).nullish().default(1),
  user: z.string().optional(),
});
const CreateCompletionResponse = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      finish_reason: z.enum(["stop", "length", "content_filter"]),
      index: z.number().int(),
      logprobs: z
        .object({
          text_offset: z.array(z.number()),
          token_logprobs: z.array(z.number()),
          tokens: z.array(z.string()),
          top_logprobs: z.array(z.record(z.number())),
        })
        .partial()
        .nullable(),
      text: z.string(),
    })
  ),
  created: z.number().int(),
  model: z.string(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["text_completion"]),
  usage: CompletionUsage.optional(),
});
const CreateImageRequest = z.object({
  prompt: z.string(),
  model: z
    .union([
      z.union([z.string(), z.enum(["dall-e-2", "dall-e-3"])]),
      z.array(z.union([z.string(), z.enum(["dall-e-2", "dall-e-3"])])),
    ])
    .nullish()
    .default("dall-e-2"),
  n: z.number().int().gte(1).lte(10).nullish().default(1),
  quality: z.enum(["standard", "hd"]).optional().default("standard"),
  response_format: z.enum(["url", "b64_json"]).nullish().default("url"),
  size: z.enum(["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"]).nullish().default("1024x1024"),
  style: z.enum(["vivid", "natural"]).nullish().default("vivid"),
  user: z.string().optional(),
});
const Image = z.object({ b64_json: z.string(), url: z.string(), revised_prompt: z.string() }).partial();
const ImagesResponse = z.object({ created: z.number().int(), data: z.array(Image) });
const CreateImageEditRequest = z.object({
  image: z.instanceof(Blob),
  prompt: z.string(),
  mask: z.instanceof(Blob).optional(),
  model: z
    .union([z.union([z.string(), z.enum(["dall-e-2"])]), z.array(z.union([z.string(), z.enum(["dall-e-2"])]))])
    .nullish()
    .default("dall-e-2"),
  n: z.number().int().gte(1).lte(10).nullish().default(1),
  size: z.enum(["256x256", "512x512", "1024x1024"]).nullish().default("1024x1024"),
  response_format: z.enum(["url", "b64_json"]).nullish().default("url"),
  user: z.string().optional(),
});
const CreateImageVariationRequest = z.object({
  image: z.instanceof(Blob),
  model: z
    .union([z.union([z.string(), z.enum(["dall-e-2"])]), z.array(z.union([z.string(), z.enum(["dall-e-2"])]))])
    .nullish()
    .default("dall-e-2"),
  n: z.number().int().gte(1).lte(10).nullish().default(1),
  response_format: z.enum(["url", "b64_json"]).nullish().default("url"),
  size: z.enum(["256x256", "512x512", "1024x1024"]).nullish().default("1024x1024"),
  user: z.string().optional(),
});
const CreateEmbeddingRequest = z.object({
  input: z.union([z.string(), z.array(z.string()), z.array(z.number()), z.array(z.array(z.number()))]),
  model: z.union([
    z.union([z.string(), z.enum(["text-embedding-ada-002"])]),
    z.array(z.union([z.string(), z.enum(["text-embedding-ada-002"])])),
  ]),
  encoding_format: z.enum(["float", "base64"]).optional().default("float"),
  user: z.string().optional(),
});
const Embedding = z.object({ index: z.number().int(), embedding: z.array(z.number()), object: z.enum(["embedding"]) });
const CreateEmbeddingResponse = z.object({
  data: z.array(Embedding),
  model: z.string(),
  object: z.enum(["list"]),
  usage: z.object({ prompt_tokens: z.number().int(), total_tokens: z.number().int() }),
});
const CreateSpeechRequest = z.object({
  model: z.union([
    z.union([z.string(), z.enum(["tts-1", "tts-1-hd"])]),
    z.array(z.union([z.string(), z.enum(["tts-1", "tts-1-hd"])])),
  ]),
  input: z.string().max(4096),
  voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]),
  response_format: z.enum(["mp3", "opus", "aac", "flac"]).optional().default("mp3"),
  speed: z.number().gte(0.25).lte(4).optional().default(1),
});
const CreateTranscriptionRequest = z.object({
  file: z.instanceof(Blob),
  model: z.union([z.union([z.string(), z.enum(["whisper-1"])]), z.array(z.union([z.string(), z.enum(["whisper-1"])]))]),
  language: z.string().optional(),
  prompt: z.string().optional(),
  response_format: z.enum(["json", "text", "srt", "verbose_json", "vtt"]).optional().default("json"),
  temperature: z.number().optional(),
});
const CreateTranscriptionResponse = z.object({ text: z.string() });
const CreateTranslationRequest = z.object({
  file: z.instanceof(Blob),
  model: z.union([z.union([z.string(), z.enum(["whisper-1"])]), z.array(z.union([z.string(), z.enum(["whisper-1"])]))]),
  prompt: z.string().optional(),
  response_format: z.string().optional().default("json"),
  temperature: z.number().optional(),
});
const CreateTranslationResponse = z.object({ text: z.string() });
const OpenAIFile = z.object({
  id: z.string(),
  bytes: z.number().int(),
  created_at: z.number().int(),
  filename: z.string(),
  object: z.enum(["file"]),
  purpose: z.enum(["fine-tune", "fine-tune-results", "assistants", "assistants_output"]),
  status: z.enum(["uploaded", "processed", "error"]),
  status_details: z.string().optional(),
});
const ListFilesResponse = z.object({ data: z.array(OpenAIFile), object: z.enum(["list"]) });
const CreateFileRequest = z.object({ file: z.instanceof(Blob), purpose: z.enum(["fine-tune", "assistants"]) });
const DeleteFileResponse = z.object({ id: z.string(), object: z.enum(["file"]), deleted: z.boolean() });
const CreateFineTuningJobRequest = z.object({
  model: z.union([
    z.union([z.string(), z.enum(["babbage-002", "davinci-002", "gpt-3.5-turbo"])]),
    z.array(z.union([z.string(), z.enum(["babbage-002", "davinci-002", "gpt-3.5-turbo"])])),
  ]),
  training_file: z.string(),
  hyperparameters: z
    .object({
      batch_size: z.union([z.enum(["auto"]), z.number()]).default("auto"),
      learning_rate_multiplier: z.union([z.enum(["auto"]), z.number()]).default("auto"),
      n_epochs: z.union([z.enum(["auto"]), z.number()]).default("auto"),
    })
    .partial()
    .optional(),
  suffix: z.string().min(1).max(40).nullish(),
  validation_file: z.string().nullish(),
});
const FineTuningJob = z.object({
  id: z.string(),
  created_at: z.number().int(),
  error: z.object({ code: z.string(), message: z.string(), param: z.string().nullable() }).nullable(),
  fine_tuned_model: z.string().nullable(),
  finished_at: z.number().int().nullable(),
  hyperparameters: z.object({ n_epochs: z.union([z.enum(["auto"]), z.number()]).default("auto") }),
  model: z.string(),
  object: z.enum(["fine_tuning.job"]),
  organization_id: z.string(),
  result_files: z.array(z.string()),
  status: z.enum(["validating_files", "queued", "running", "succeeded", "failed", "cancelled"]),
  trained_tokens: z.number().int().nullable(),
  training_file: z.string(),
  validation_file: z.string().nullable(),
});
const ListPaginatedFineTuningJobsResponse = z.object({
  data: z.array(FineTuningJob),
  has_more: z.boolean(),
  object: z.enum(["list"]),
});
const FineTuningJobEvent = z.object({
  id: z.string(),
  created_at: z.number().int(),
  level: z.enum(["info", "warn", "error"]),
  message: z.string(),
  object: z.enum(["fine_tuning.job.event"]),
});
const ListFineTuningJobEventsResponse = z.object({ data: z.array(FineTuningJobEvent), object: z.enum(["list"]) });
const Model = z.object({ id: z.string(), created: z.number().int(), object: z.enum(["model"]), owned_by: z.string() });
const ListModelsResponse = z.object({ object: z.enum(["list"]), data: z.array(Model) });
const DeleteModelResponse = z.object({ id: z.string(), deleted: z.boolean(), object: z.string() });
const CreateModerationRequest = z.object({
  input: z.union([z.string(), z.array(z.string())]),
  model: z
    .union([
      z.union([z.string(), z.enum(["text-moderation-latest", "text-moderation-stable"])]),
      z.array(z.union([z.string(), z.enum(["text-moderation-latest", "text-moderation-stable"])])),
    ])
    .optional()
    .default("text-moderation-latest"),
});
const CreateModerationResponse = z.object({
  id: z.string(),
  model: z.string(),
  results: z.array(
    z.object({
      flagged: z.boolean(),
      categories: z.object({
        hate: z.boolean(),
        "hate/threatening": z.boolean(),
        harassment: z.boolean(),
        "harassment/threatening": z.boolean(),
        "self-harm": z.boolean(),
        "self-harm/intent": z.boolean(),
        "self-harm/instructions": z.boolean(),
        sexual: z.boolean(),
        "sexual/minors": z.boolean(),
        violence: z.boolean(),
        "violence/graphic": z.boolean(),
      }),
      category_scores: z.object({
        hate: z.number(),
        "hate/threatening": z.number(),
        harassment: z.number(),
        "harassment/threatening": z.number(),
        "self-harm": z.number(),
        "self-harm/intent": z.number(),
        "self-harm/instructions": z.number(),
        sexual: z.number(),
        "sexual/minors": z.number(),
        violence: z.number(),
        "violence/graphic": z.number(),
      }),
    })
  ),
});
const AssistantToolsCode = z.object({ type: z.enum(["code_interpreter"]) });
const AssistantToolsRetrieval = z.object({ type: z.enum(["retrieval"]) });
const AssistantToolsFunction = z.object({ type: z.enum(["function"]), function: FunctionObject });
const AssistantObject = z.object({
  id: z.string(),
  object: z.enum(["assistant"]),
  created_at: z.number().int(),
  name: z.string().max(256).nullable(),
  description: z.string().max(512).nullable(),
  model: z.string(),
  instructions: z.string().max(32768).nullable(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(128)
    .default([]),
  file_ids: z.array(z.string()).max(20).default([]),
  metadata: z.object({}).partial().nullable(),
});
const ListAssistantsResponse = z.object({
  object: z.string(),
  data: z.array(AssistantObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const CreateAssistantRequest = z.object({
  model: z.string(),
  name: z.string().max(256).nullish(),
  description: z.string().max(512).nullish(),
  instructions: z.string().max(32768).nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(128)
    .optional()
    .default([]),
  file_ids: z.array(z.string()).max(20).optional().default([]),
  metadata: z.object({}).partial().nullish(),
});
const ModifyAssistantRequest = z
  .object({
    model: z.string(),
    name: z.string().max(256).nullable(),
    description: z.string().max(512).nullable(),
    instructions: z.string().max(32768).nullable(),
    tools: z
      .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
      .max(128)
      .default([]),
    file_ids: z.array(z.string()).max(20).default([]),
    metadata: z.object({}).partial().nullable(),
  })
  .partial();
const DeleteAssistantResponse = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["assistant.deleted"]),
});
const CreateMessageRequest = z.object({
  role: z.enum(["user"]),
  content: z.string().min(1).max(32768),
  file_ids: z.array(z.string()).min(1).max(10).optional().default([]),
  metadata: z.object({}).partial().nullish(),
});
const CreateThreadRequest = z
  .object({ messages: z.array(CreateMessageRequest), metadata: z.object({}).partial().nullable() })
  .partial();
const ThreadObject = z.object({
  id: z.string(),
  object: z.enum(["thread"]),
  created_at: z.number().int(),
  metadata: z.object({}).partial().nullable(),
});
const ModifyThreadRequest = z.object({ metadata: z.object({}).partial().nullable() }).partial();
const DeleteThreadResponse = z.object({ id: z.string(), deleted: z.boolean(), object: z.enum(["thread.deleted"]) });
const MessageContentImageFileObject = z.object({
  type: z.enum(["image_file"]),
  image_file: z.object({ file_id: z.string() }),
});
const MessageContentTextAnnotationsFileCitationObject = z.object({
  type: z.enum(["file_citation"]),
  text: z.string(),
  file_citation: z.object({ file_id: z.string(), quote: z.string() }),
  start_index: z.number().int(),
  end_index: z.number().int(),
});
const MessageContentTextAnnotationsFilePathObject = z.object({
  type: z.enum(["file_path"]),
  text: z.string(),
  file_path: z.object({ file_id: z.string() }),
  start_index: z.number().int(),
  end_index: z.number().int(),
});
const MessageContentTextObject = z.object({
  type: z.enum(["text"]),
  text: z.object({
    value: z.string(),
    annotations: z.array(
      z.union([MessageContentTextAnnotationsFileCitationObject, MessageContentTextAnnotationsFilePathObject])
    ),
  }),
});
const MessageObject = z.object({
  id: z.string(),
  object: z.enum(["thread.message"]),
  created_at: z.number().int(),
  thread_id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.array(z.union([MessageContentImageFileObject, MessageContentTextObject])),
  assistant_id: z.string().nullable(),
  run_id: z.string().nullable(),
  file_ids: z.array(z.string()).max(10).default([]),
  metadata: z.object({}).partial().nullable(),
});
const ListMessagesResponse = z.object({
  object: z.string(),
  data: z.array(MessageObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const ModifyMessageRequest = z.object({ metadata: z.object({}).partial().nullable() }).partial();
const CreateThreadAndRunRequest = z.object({
  assistant_id: z.string(),
  thread: CreateThreadRequest.optional(),
  model: z.string().nullish(),
  instructions: z.string().nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(20)
    .nullish(),
  metadata: z.object({}).partial().nullish(),
});
const RunToolCallObject = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({ name: z.string(), arguments: z.string() }),
});
const RunCompletionUsage = z.object({
  completion_tokens: z.number().int(),
  prompt_tokens: z.number().int(),
  total_tokens: z.number().int(),
});
const RunObject = z.object({
  id: z.string(),
  object: z.enum(["thread.run"]),
  created_at: z.number().int(),
  thread_id: z.string(),
  assistant_id: z.string(),
  status: z.enum([
    "queued",
    "in_progress",
    "requires_action",
    "cancelling",
    "cancelled",
    "failed",
    "completed",
    "expired",
  ]),
  required_action: z
    .object({
      type: z.enum(["submit_tool_outputs"]),
      submit_tool_outputs: z.object({ tool_calls: z.array(RunToolCallObject) }),
    })
    .nullable(),
  last_error: z.object({ code: z.enum(["server_error", "rate_limit_exceeded"]), message: z.string() }).nullable(),
  expires_at: z.number().int(),
  started_at: z.number().int().nullable(),
  cancelled_at: z.number().int().nullable(),
  failed_at: z.number().int().nullable(),
  completed_at: z.number().int().nullable(),
  model: z.string(),
  instructions: z.string(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(20)
    .default([]),
  file_ids: z.array(z.string()).default([]),
  metadata: z.object({}).partial().nullable(),
  usage: RunCompletionUsage.nullable(),
});
const ListRunsResponse = z.object({
  object: z.string(),
  data: z.array(RunObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const CreateRunRequest = z.object({
  assistant_id: z.string(),
  model: z.string().nullish(),
  instructions: z.string().nullish(),
  additional_instructions: z.string().nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(20)
    .nullish(),
  metadata: z.object({}).partial().nullish(),
});
const ModifyRunRequest = z.object({ metadata: z.object({}).partial().nullable() }).partial();
const SubmitToolOutputsRunRequest = z.object({
  tool_outputs: z.array(z.object({ tool_call_id: z.string(), output: z.string() }).partial()),
});
const RunStepDetailsMessageCreationObject = z.object({
  type: z.enum(["message_creation"]),
  message_creation: z.object({ message_id: z.string() }),
});
const RunStepDetailsToolCallsCodeOutputLogsObject = z.object({ type: z.enum(["logs"]), logs: z.string() });
const RunStepDetailsToolCallsCodeOutputImageObject = z.object({
  type: z.enum(["image"]),
  image: z.object({ file_id: z.string() }),
});
const RunStepDetailsToolCallsCodeObject = z.object({
  id: z.string(),
  type: z.enum(["code_interpreter"]),
  code_interpreter: z.object({
    input: z.string(),
    outputs: z.array(
      z.union([RunStepDetailsToolCallsCodeOutputLogsObject, RunStepDetailsToolCallsCodeOutputImageObject])
    ),
  }),
});
const RunStepDetailsToolCallsRetrievalObject = z.object({
  id: z.string(),
  type: z.enum(["retrieval"]),
  retrieval: z.object({}).partial(),
});
const RunStepDetailsToolCallsFunctionObject = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({ name: z.string(), arguments: z.string(), output: z.string().nullable() }),
});
const RunStepDetailsToolCallsObject = z.object({
  type: z.enum(["tool_calls"]),
  tool_calls: z.array(
    z.union([
      RunStepDetailsToolCallsCodeObject,
      RunStepDetailsToolCallsRetrievalObject,
      RunStepDetailsToolCallsFunctionObject,
    ])
  ),
});
const RunStepCompletionUsage = z.object({
  completion_tokens: z.number().int(),
  prompt_tokens: z.number().int(),
  total_tokens: z.number().int(),
});
const RunStepObject = z.object({
  id: z.string(),
  object: z.enum(["thread.run.step"]),
  created_at: z.number().int(),
  assistant_id: z.string(),
  thread_id: z.string(),
  run_id: z.string(),
  type: z.enum(["message_creation", "tool_calls"]),
  status: z.enum(["in_progress", "cancelled", "failed", "completed", "expired"]),
  step_details: z.union([RunStepDetailsMessageCreationObject, RunStepDetailsToolCallsObject]),
  last_error: z.object({ code: z.enum(["server_error", "rate_limit_exceeded"]), message: z.string() }).nullable(),
  expired_at: z.number().int().nullable(),
  cancelled_at: z.number().int().nullable(),
  failed_at: z.number().int().nullable(),
  completed_at: z.number().int().nullable(),
  metadata: z.object({}).partial().nullable(),
  usage: RunStepCompletionUsage.nullable(),
});
const ListRunStepsResponse = z.object({
  object: z.string(),
  data: z.array(RunStepObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const AssistantFileObject = z.object({
  id: z.string(),
  object: z.enum(["assistant.file"]),
  created_at: z.number().int(),
  assistant_id: z.string(),
});
const ListAssistantFilesResponse = z.object({
  object: z.string(),
  data: z.array(AssistantFileObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const CreateAssistantFileRequest = z.object({ file_id: z.string() });
const DeleteAssistantFileResponse = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["assistant.file.deleted"]),
});
const MessageFileObject = z.object({
  id: z.string(),
  object: z.enum(["thread.message.file"]),
  created_at: z.number().int(),
  message_id: z.string(),
});
const ListMessageFilesResponse = z.object({
  object: z.string(),
  data: z.array(MessageFileObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const Error = z.object({
  code: z.string().nullable(),
  message: z.string(),
  param: z.string().nullable(),
  type: z.string(),
});
const ErrorResponse = z.object({ error: Error });
const ChatCompletionMessageToolCallChunk = z.object({
  index: z.number().int(),
  id: z.string().optional(),
  type: z.enum(["function"]).optional(),
  function: z.object({ name: z.string(), arguments: z.string() }).partial().optional(),
});
const ChatCompletionRole = z.enum(["system", "user", "assistant", "tool", "function"]);
const ChatCompletionStreamResponseDelta = z
  .object({
    content: z.string().nullable(),
    function_call: z.object({ arguments: z.string(), name: z.string() }).partial(),
    tool_calls: z.array(ChatCompletionMessageToolCallChunk),
    role: z.enum(["system", "user", "assistant", "tool"]),
  })
  .partial();
const CreateChatCompletionFunctionResponse = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      finish_reason: z.enum(["stop", "length", "function_call", "content_filter"]),
      index: z.number().int(),
      message: ChatCompletionResponseMessage,
    })
  ),
  created: z.number().int(),
  model: z.string(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["chat.completion"]),
  usage: CompletionUsage.optional(),
});
const CreateChatCompletionStreamResponse = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      delta: ChatCompletionStreamResponseDelta,
      logprobs: z.object({ content: z.array(ChatCompletionTokenLogprob).nullable() }).nullish(),
      finish_reason: z.enum(["stop", "length", "tool_calls", "content_filter", "function_call"]).nullable(),
      index: z.number().int(),
    })
  ),
  created: z.number().int(),
  model: z.string(),
  system_fingerprint: z.string().optional(),
  object: z.enum(["chat.completion.chunk"]),
});
const CreateChatCompletionImageResponse = z.object({}).partial();
const ListThreadsResponse = z.object({
  object: z.string(),
  data: z.array(ThreadObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
const DeleteMessageResponse = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["thread.message.deleted"]),
});

export {
  ChatCompletionRequestSystemMessage,
  ChatCompletionRequestMessageContentPartText,
  ChatCompletionRequestMessageContentPartImage,
  ChatCompletionRequestMessageContentPart,
  ChatCompletionRequestUserMessage,
  ChatCompletionMessageToolCall,
  ChatCompletionMessageToolCalls,
  ChatCompletionRequestAssistantMessage,
  ChatCompletionRequestToolMessage,
  ChatCompletionRequestFunctionMessage,
  ChatCompletionRequestMessage,
  FunctionParameters,
  FunctionObject,
  ChatCompletionTool,
  ChatCompletionNamedToolChoice,
  ChatCompletionToolChoiceOption,
  ChatCompletionFunctionCallOption,
  ChatCompletionFunctions,
  CreateChatCompletionRequest,
  ChatCompletionResponseMessage,
  ChatCompletionTokenLogprob,
  CompletionUsage,
  CreateChatCompletionResponse,
  CreateCompletionRequest,
  CreateCompletionResponse,
  CreateImageRequest,
  Image,
  ImagesResponse,
  CreateImageEditRequest,
  CreateImageVariationRequest,
  CreateEmbeddingRequest,
  Embedding,
  CreateEmbeddingResponse,
  CreateSpeechRequest,
  CreateTranscriptionRequest,
  CreateTranscriptionResponse,
  CreateTranslationRequest,
  CreateTranslationResponse,
  OpenAIFile,
  ListFilesResponse,
  CreateFileRequest,
  DeleteFileResponse,
  CreateFineTuningJobRequest,
  FineTuningJob,
  ListPaginatedFineTuningJobsResponse,
  FineTuningJobEvent,
  ListFineTuningJobEventsResponse,
  Model,
  ListModelsResponse,
  DeleteModelResponse,
  CreateModerationRequest,
  CreateModerationResponse,
  AssistantToolsCode,
  AssistantToolsRetrieval,
  AssistantToolsFunction,
  AssistantObject,
  ListAssistantsResponse,
  CreateAssistantRequest,
  ModifyAssistantRequest,
  DeleteAssistantResponse,
  CreateMessageRequest,
  CreateThreadRequest,
  ThreadObject,
  ModifyThreadRequest,
  DeleteThreadResponse,
  MessageContentImageFileObject,
  MessageContentTextAnnotationsFileCitationObject,
  MessageContentTextAnnotationsFilePathObject,
  MessageContentTextObject,
  MessageObject,
  ListMessagesResponse,
  ModifyMessageRequest,
  CreateThreadAndRunRequest,
  RunToolCallObject,
  RunCompletionUsage,
  RunObject,
  ListRunsResponse,
  CreateRunRequest,
  ModifyRunRequest,
  SubmitToolOutputsRunRequest,
  RunStepDetailsMessageCreationObject,
  RunStepDetailsToolCallsCodeOutputLogsObject,
  RunStepDetailsToolCallsCodeOutputImageObject,
  RunStepDetailsToolCallsCodeObject,
  RunStepDetailsToolCallsRetrievalObject,
  RunStepDetailsToolCallsFunctionObject,
  RunStepDetailsToolCallsObject,
  RunStepCompletionUsage,
  RunStepObject,
  ListRunStepsResponse,
  AssistantFileObject,
  ListAssistantFilesResponse,
  CreateAssistantFileRequest,
  DeleteAssistantFileResponse,
  MessageFileObject,
  ListMessageFilesResponse,
  Error,
  ErrorResponse,
  ChatCompletionMessageToolCallChunk,
  ChatCompletionRole,
  ChatCompletionStreamResponseDelta,
  CreateChatCompletionFunctionResponse,
  CreateChatCompletionStreamResponse,
  CreateChatCompletionImageResponse,
  ListThreadsResponse,
  DeleteMessageResponse,
};

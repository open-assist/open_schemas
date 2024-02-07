import { z } from "zod";

export const ChatCompletionRequestSystemMessage = z.object({
  content: z.string(),
  role: z.enum(["system"]),
  name: z.string().optional(),
});
export type ChatCompletionRequestSystemMessageType = z.infer<typeof ChatCompletionRequestSystemMessage>;

export const ChatCompletionRequestMessageContentPartText = z.object({ type: z.enum(["text"]), text: z.string() });
export type ChatCompletionRequestMessageContentPartTextType = z.infer<
  typeof ChatCompletionRequestMessageContentPartText
>;

export const ChatCompletionRequestMessageContentPartImage = z.object({
  type: z.enum(["image_url"]),
  image_url: z.object({ url: z.string().url(), detail: z.enum(["auto", "low", "high"]).optional().default("auto") }),
});
export type ChatCompletionRequestMessageContentPartImageType = z.infer<
  typeof ChatCompletionRequestMessageContentPartImage
>;

export const ChatCompletionRequestMessageContentPart = z.union([
  ChatCompletionRequestMessageContentPartText,
  ChatCompletionRequestMessageContentPartImage,
]);
export type ChatCompletionRequestMessageContentPartType = z.infer<typeof ChatCompletionRequestMessageContentPart>;

export const ChatCompletionRequestUserMessage = z.object({
  content: z.union([z.string(), z.array(ChatCompletionRequestMessageContentPart)]),
  role: z.enum(["user"]),
  name: z.string().optional(),
});
export type ChatCompletionRequestUserMessageType = z.infer<typeof ChatCompletionRequestUserMessage>;

export const ChatCompletionMessageToolCall = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({ name: z.string(), arguments: z.string() }),
});
export type ChatCompletionMessageToolCallType = z.infer<typeof ChatCompletionMessageToolCall>;

export const ChatCompletionMessageToolCalls = z.array(ChatCompletionMessageToolCall);
export type ChatCompletionMessageToolCallsType = z.infer<typeof ChatCompletionMessageToolCalls>;

export const ChatCompletionRequestAssistantMessage = z.object({
  content: z.string().nullish(),
  role: z.enum(["assistant"]),
  name: z.string().optional(),
  tool_calls: ChatCompletionMessageToolCalls.optional(),
  function_call: z.object({ arguments: z.string(), name: z.string() }).optional(),
});
export type ChatCompletionRequestAssistantMessageType = z.infer<typeof ChatCompletionRequestAssistantMessage>;

export const ChatCompletionRequestToolMessage = z.object({
  role: z.enum(["tool"]),
  content: z.string(),
  tool_call_id: z.string(),
});
export type ChatCompletionRequestToolMessageType = z.infer<typeof ChatCompletionRequestToolMessage>;

export const ChatCompletionRequestFunctionMessage = z.object({
  role: z.enum(["function"]),
  content: z.string().nullable(),
  name: z.string(),
});
export type ChatCompletionRequestFunctionMessageType = z.infer<typeof ChatCompletionRequestFunctionMessage>;

export const ChatCompletionRequestMessage = z.union([
  ChatCompletionRequestSystemMessage,
  ChatCompletionRequestUserMessage,
  ChatCompletionRequestAssistantMessage,
  ChatCompletionRequestToolMessage,
  ChatCompletionRequestFunctionMessage,
]);
export type ChatCompletionRequestMessageType = z.infer<typeof ChatCompletionRequestMessage>;

export const FunctionParameters = z.object({}).partial().passthrough();
export type FunctionParametersType = z.infer<typeof FunctionParameters>;

export const FunctionObject = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: FunctionParameters.optional(),
});
export type FunctionObjectType = z.infer<typeof FunctionObject>;

export const ChatCompletionTool = z.object({ type: z.enum(["function"]), function: FunctionObject });
export type ChatCompletionToolType = z.infer<typeof ChatCompletionTool>;

export const ChatCompletionNamedToolChoice = z.object({
  type: z.enum(["function"]),
  function: z.object({ name: z.string() }),
});
export type ChatCompletionNamedToolChoiceType = z.infer<typeof ChatCompletionNamedToolChoice>;

export const ChatCompletionToolChoiceOption = z.union([z.enum(["none", "auto"]), ChatCompletionNamedToolChoice]);
export type ChatCompletionToolChoiceOptionType = z.infer<typeof ChatCompletionToolChoiceOption>;

export const ChatCompletionFunctionCallOption = z.object({ name: z.string() });
export type ChatCompletionFunctionCallOptionType = z.infer<typeof ChatCompletionFunctionCallOption>;

export const ChatCompletionFunctions = z.object({
  description: z.string().optional(),
  name: z.string(),
  parameters: FunctionParameters.optional(),
});
export type ChatCompletionFunctionsType = z.infer<typeof ChatCompletionFunctions>;

export const CreateChatCompletionRequest = z.object({
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
export type CreateChatCompletionRequestType = z.infer<typeof CreateChatCompletionRequest>;

export const ChatCompletionResponseMessage = z.object({
  content: z.string().nullable(),
  tool_calls: ChatCompletionMessageToolCalls.optional(),
  role: z.enum(["assistant"]),
  function_call: z.object({ arguments: z.string(), name: z.string() }).optional(),
});
export type ChatCompletionResponseMessageType = z.infer<typeof ChatCompletionResponseMessage>;

export const ChatCompletionTokenLogprob = z.object({
  token: z.string(),
  logprob: z.number(),
  bytes: z.array(z.number()).nullable(),
  top_logprobs: z.array(z.object({ token: z.string(), logprob: z.number(), bytes: z.array(z.number()).nullable() })),
});
export type ChatCompletionTokenLogprobType = z.infer<typeof ChatCompletionTokenLogprob>;

export const CompletionUsage = z.object({
  completion_tokens: z.number().int(),
  prompt_tokens: z.number().int(),
  total_tokens: z.number().int(),
});
export type CompletionUsageType = z.infer<typeof CompletionUsage>;

export const CreateChatCompletionResponse = z.object({
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
export type CreateChatCompletionResponseType = z.infer<typeof CreateChatCompletionResponse>;

export const CreateCompletionRequest = z.object({
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
export type CreateCompletionRequestType = z.infer<typeof CreateCompletionRequest>;

export const CreateCompletionResponse = z.object({
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
export type CreateCompletionResponseType = z.infer<typeof CreateCompletionResponse>;

export const CreateImageRequest = z.object({
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
export type CreateImageRequestType = z.infer<typeof CreateImageRequest>;

export const Image = z.object({ b64_json: z.string(), url: z.string(), revised_prompt: z.string() }).partial();
export type ImageType = z.infer<typeof Image>;

export const ImagesResponse = z.object({ created: z.number().int(), data: z.array(Image) });
export type ImagesResponseType = z.infer<typeof ImagesResponse>;

export const CreateImageEditRequest = z.object({
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
export type CreateImageEditRequestType = z.infer<typeof CreateImageEditRequest>;

export const CreateImageVariationRequest = z.object({
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
export type CreateImageVariationRequestType = z.infer<typeof CreateImageVariationRequest>;

export const CreateEmbeddingRequest = z.object({
  input: z.union([z.string(), z.array(z.string()), z.array(z.number()), z.array(z.array(z.number()))]),
  model: z.union([
    z.union([z.string(), z.enum(["text-embedding-ada-002"])]),
    z.array(z.union([z.string(), z.enum(["text-embedding-ada-002"])])),
  ]),
  encoding_format: z.enum(["float", "base64"]).optional().default("float"),
  user: z.string().optional(),
});
export type CreateEmbeddingRequestType = z.infer<typeof CreateEmbeddingRequest>;

export const Embedding = z.object({
  index: z.number().int(),
  embedding: z.array(z.number()),
  object: z.enum(["embedding"]),
});
export type EmbeddingType = z.infer<typeof Embedding>;

export const CreateEmbeddingResponse = z.object({
  data: z.array(Embedding),
  model: z.string(),
  object: z.enum(["list"]),
  usage: z.object({ prompt_tokens: z.number().int(), total_tokens: z.number().int() }),
});
export type CreateEmbeddingResponseType = z.infer<typeof CreateEmbeddingResponse>;

export const CreateSpeechRequest = z.object({
  model: z.union([
    z.union([z.string(), z.enum(["tts-1", "tts-1-hd"])]),
    z.array(z.union([z.string(), z.enum(["tts-1", "tts-1-hd"])])),
  ]),
  input: z.string().max(4096),
  voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]),
  response_format: z.enum(["mp3", "opus", "aac", "flac"]).optional().default("mp3"),
  speed: z.number().gte(0.25).lte(4).optional().default(1),
});
export type CreateSpeechRequestType = z.infer<typeof CreateSpeechRequest>;

export const CreateTranscriptionRequest = z.object({
  file: z.instanceof(Blob),
  model: z.union([z.union([z.string(), z.enum(["whisper-1"])]), z.array(z.union([z.string(), z.enum(["whisper-1"])]))]),
  language: z.string().optional(),
  prompt: z.string().optional(),
  response_format: z.enum(["json", "text", "srt", "verbose_json", "vtt"]).optional().default("json"),
  temperature: z.number().optional(),
});
export type CreateTranscriptionRequestType = z.infer<typeof CreateTranscriptionRequest>;

export const CreateTranscriptionResponse = z.object({ text: z.string() });
export type CreateTranscriptionResponseType = z.infer<typeof CreateTranscriptionResponse>;

export const CreateTranslationRequest = z.object({
  file: z.instanceof(Blob),
  model: z.union([z.union([z.string(), z.enum(["whisper-1"])]), z.array(z.union([z.string(), z.enum(["whisper-1"])]))]),
  prompt: z.string().optional(),
  response_format: z.string().optional().default("json"),
  temperature: z.number().optional(),
});
export type CreateTranslationRequestType = z.infer<typeof CreateTranslationRequest>;

export const CreateTranslationResponse = z.object({ text: z.string() });
export type CreateTranslationResponseType = z.infer<typeof CreateTranslationResponse>;

export const OpenAIFile = z.object({
  id: z.string(),
  bytes: z.number().int(),
  created_at: z.number().int(),
  filename: z.string(),
  object: z.enum(["file"]),
  purpose: z.enum(["fine-tune", "fine-tune-results", "assistants", "assistants_output"]),
  status: z.enum(["uploaded", "processed", "error"]),
  status_details: z.string().optional(),
});
export type OpenAIFileType = z.infer<typeof OpenAIFile>;

export const ListFilesResponse = z.object({ data: z.array(OpenAIFile), object: z.enum(["list"]) });
export type ListFilesResponseType = z.infer<typeof ListFilesResponse>;

export const CreateFileRequest = z.object({ file: z.instanceof(Blob), purpose: z.enum(["fine-tune", "assistants"]) });
export type CreateFileRequestType = z.infer<typeof CreateFileRequest>;

export const DeleteFileResponse = z.object({ id: z.string(), object: z.enum(["file"]), deleted: z.boolean() });
export type DeleteFileResponseType = z.infer<typeof DeleteFileResponse>;

export const CreateFineTuningJobRequest = z.object({
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
export type CreateFineTuningJobRequestType = z.infer<typeof CreateFineTuningJobRequest>;

export const FineTuningJob = z.object({
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
export type FineTuningJobType = z.infer<typeof FineTuningJob>;

export const ListPaginatedFineTuningJobsResponse = z.object({
  data: z.array(FineTuningJob),
  has_more: z.boolean(),
  object: z.enum(["list"]),
});
export type ListPaginatedFineTuningJobsResponseType = z.infer<typeof ListPaginatedFineTuningJobsResponse>;

export const FineTuningJobEvent = z.object({
  id: z.string(),
  created_at: z.number().int(),
  level: z.enum(["info", "warn", "error"]),
  message: z.string(),
  object: z.enum(["fine_tuning.job.event"]),
});
export type FineTuningJobEventType = z.infer<typeof FineTuningJobEvent>;

export const ListFineTuningJobEventsResponse = z.object({
  data: z.array(FineTuningJobEvent),
  object: z.enum(["list"]),
});
export type ListFineTuningJobEventsResponseType = z.infer<typeof ListFineTuningJobEventsResponse>;

export const Model = z.object({
  id: z.string(),
  created: z.number().int(),
  object: z.enum(["model"]),
  owned_by: z.string(),
});
export type ModelType = z.infer<typeof Model>;

export const ListModelsResponse = z.object({ object: z.enum(["list"]), data: z.array(Model) });
export type ListModelsResponseType = z.infer<typeof ListModelsResponse>;

export const DeleteModelResponse = z.object({ id: z.string(), deleted: z.boolean(), object: z.string() });
export type DeleteModelResponseType = z.infer<typeof DeleteModelResponse>;

export const CreateModerationRequest = z.object({
  input: z.union([z.string(), z.array(z.string())]),
  model: z
    .union([
      z.union([z.string(), z.enum(["text-moderation-latest", "text-moderation-stable"])]),
      z.array(z.union([z.string(), z.enum(["text-moderation-latest", "text-moderation-stable"])])),
    ])
    .optional()
    .default("text-moderation-latest"),
});
export type CreateModerationRequestType = z.infer<typeof CreateModerationRequest>;

export const CreateModerationResponse = z.object({
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
export type CreateModerationResponseType = z.infer<typeof CreateModerationResponse>;

export const Metadata = z.record(z.string().min(1).max(64), z.string().max(512).nullable());
export type MetadataType = z.infer<typeof Metadata>;

export const AssistantToolsCode = z.object({ type: z.enum(["code_interpreter"]) });
export type AssistantToolsCodeType = z.infer<typeof AssistantToolsCode>;

export const AssistantToolsRetrieval = z.object({ type: z.enum(["retrieval"]) });
export type AssistantToolsRetrievalType = z.infer<typeof AssistantToolsRetrieval>;

export const AssistantToolsFunction = z.object({ type: z.enum(["function"]), function: FunctionObject });
export type AssistantToolsFunctionType = z.infer<typeof AssistantToolsFunction>;

export const AssistantObject = z.object({
  id: z.string(),
  object: z.enum(["assistant"]),
  created_at: z.number().int(),
  name: z.string().max(256).nullish(),
  description: z.string().max(512).nullish(),
  model: z.string(),
  instructions: z.string().max(32768).nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(128)
    .default([])
    .nullish(),
  file_ids: z.array(z.string()).max(20).default([]).nullish(),
  metadata: Metadata.nullish(),
});
export type AssistantObjectType = z.infer<typeof AssistantObject>;

export const ListAssistantsResponse = z.object({
  object: z.string(),
  data: z.array(AssistantObject),
  first_id: z.string().nullish(),
  last_id: z.string().nullish(),
  has_more: z.boolean(),
});
export type ListAssistantsResponseType = z.infer<typeof ListAssistantsResponse>;

export const CreateAssistantRequest = z.object({
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
  metadata: Metadata.nullish(),
});
export type CreateAssistantRequestType = z.infer<typeof CreateAssistantRequest>;

export const ModifyAssistantRequest = z.object({
  model: z.string().optional(),
  name: z.string().max(256).nullish(),
  description: z.string().max(512).nullish(),
  instructions: z.string().max(32768).nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(128)
    .default([]),
  file_ids: z.array(z.string()).max(20).default([]),
  metadata: Metadata.nullish(),
});
export type ModifyAssistantRequestType = z.infer<typeof ModifyAssistantRequest>;

export const DeleteAssistantResponse = z.object({
  id: z.string(),
  deleted: z.boolean().default(true),
  object: z.enum(["assistant.deleted"]).default("assistant.deleted"),
});
export type DeleteAssistantResponseType = z.infer<typeof DeleteAssistantResponse>;

export const CreateMessageRequest = z.object({
  role: z.enum(["user"]),
  content: z.string().min(1).max(32768),
  file_ids: z.array(z.string()).max(10).optional().default([]),
  metadata: Metadata.nullish(),
});
export type CreateMessageRequestType = z.infer<typeof CreateMessageRequest>;

export const CreateThreadRequest = z
  .object({ messages: z.array(CreateMessageRequest), metadata: Metadata.nullish() })
  .partial();
export type CreateThreadRequestType = z.infer<typeof CreateThreadRequest>;

export const ThreadObject = z.object({
  id: z.string(),
  object: z.enum(["thread"]),
  created_at: z.number().int(),
  metadata: Metadata.nullish(),
});
export type ThreadObjectType = z.infer<typeof ThreadObject>;

export const ModifyThreadRequest = z.object({ metadata: Metadata.nullish() }).partial();
export type ModifyThreadRequestType = z.infer<typeof ModifyThreadRequest>;

export const DeleteThreadResponse = z.object({
  id: z.string(),
  deleted: z.boolean().default(true),
  object: z.enum(["thread.deleted"]).default("thread.deleted"),
});
export type DeleteThreadResponseType = z.infer<typeof DeleteThreadResponse>;

export const MessageContentImageFileObject = z.object({
  type: z.enum(["image_file"]),
  image_file: z.object({ file_id: z.string() }),
});
export type MessageContentImageFileObjectType = z.infer<typeof MessageContentImageFileObject>;

export const MessageContentTextAnnotationsFileCitationObject = z.object({
  type: z.enum(["file_citation"]),
  text: z.string(),
  file_citation: z.object({ file_id: z.string(), quote: z.string() }),
  start_index: z.number().int(),
  end_index: z.number().int(),
});
export type MessageContentTextAnnotationsFileCitationObjectType = z.infer<
  typeof MessageContentTextAnnotationsFileCitationObject
>;

export const MessageContentTextAnnotationsFilePathObject = z.object({
  type: z.enum(["file_path"]),
  text: z.string(),
  file_path: z.object({ file_id: z.string() }),
  start_index: z.number().int(),
  end_index: z.number().int(),
});
export type MessageContentTextAnnotationsFilePathObjectType = z.infer<
  typeof MessageContentTextAnnotationsFilePathObject
>;

export const MessageContentTextObject = z.object({
  type: z.enum(["text"]),
  text: z.object({
    value: z.string(),
    annotations: z
      .array(z.union([MessageContentTextAnnotationsFileCitationObject, MessageContentTextAnnotationsFilePathObject]))
      .nullish(),
  }),
});
export type MessageContentTextObjectType = z.infer<typeof MessageContentTextObject>;

export const MessageObject = z.object({
  id: z.string(),
  object: z.enum(["thread.message"]),
  created_at: z.number().int(),
  thread_id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.array(z.union([MessageContentImageFileObject, MessageContentTextObject])),
  assistant_id: z.string().nullish(),
  run_id: z.string().nullish(),
  file_ids: z.array(z.string()).max(10).default([]).nullish(),
  metadata: z.object({}).partial().nullish(),
});
export type MessageObjectType = z.infer<typeof MessageObject>;

export const ListMessagesResponse = z.object({
  object: z.string(),
  data: z.array(MessageObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
export type ListMessagesResponseType = z.infer<typeof ListMessagesResponse>;

export const ModifyMessageRequest = z.object({ metadata: z.object({}).partial().nullable() }).partial();
export type ModifyMessageRequestType = z.infer<typeof ModifyMessageRequest>;

export const CreateThreadAndRunRequest = z.object({
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
export type CreateThreadAndRunRequestType = z.infer<typeof CreateThreadAndRunRequest>;

export const RunToolCallObject = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({ name: z.string(), arguments: z.string() }),
});
export type RunToolCallObjectType = z.infer<typeof RunToolCallObject>;

export const RunCompletionUsage = z.object({
  completion_tokens: z.number().int(),
  prompt_tokens: z.number().int(),
  total_tokens: z.number().int(),
});
export type RunCompletionUsageType = z.infer<typeof RunCompletionUsage>;

export const RunObject = z.object({
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
    .nullish(),
  last_error: z.object({ code: z.enum(["server_error", "rate_limit_exceeded"]), message: z.string() }).nullish(),
  expires_at: z.number().int(),
  started_at: z.number().int().nullish(),
  cancelled_at: z.number().int().nullish(),
  failed_at: z.number().int().nullish(),
  completed_at: z.number().int().nullish(),
  model: z.string().nullish(),
  instructions: z.string().nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(20)
    .default([])
    .nullish(),
  file_ids: z.array(z.string()).default([]).nullish(),
  metadata: Metadata.nullish(),
  usage: RunCompletionUsage.nullish(),
});
export type RunObjectType = z.infer<typeof RunObject>;

export const ListRunsResponse = z.object({
  object: z.string(),
  data: z.array(RunObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
export type ListRunsResponseType = z.infer<typeof ListRunsResponse>;

export const CreateRunRequest = z.object({
  assistant_id: z.string(),
  model: z.string().nullish(),
  instructions: z.string().nullish(),
  additional_instructions: z.string().nullish(),
  tools: z
    .array(z.union([AssistantToolsCode, AssistantToolsRetrieval, AssistantToolsFunction]))
    .max(20)
    .nullish(),
  metadata: Metadata.nullish(),
});
export type CreateRunRequestType = z.infer<typeof CreateRunRequest>;

export const ModifyRunRequest = z.object({ metadata: Metadata.nullish() });
export type ModifyRunRequestType = z.infer<typeof ModifyRunRequest>;

export const ToolOutput = z.object({
  tool_call_id: z.string(),
  output: z.string().nullish(),
});
export type ToolOutputType = z.infer<typeof ToolOutput>;

export const SubmitToolOutputsRunRequest = z.object({
  tool_outputs: z.array(ToolOutput).min(1),
});
export type SubmitToolOutputsRunRequestType = z.infer<typeof SubmitToolOutputsRunRequest>;

export const RunStepDetailsMessageCreationObject = z.object({
  type: z.enum(["message_creation"]),
  message_creation: z.object({ message_id: z.string() }),
});
export type RunStepDetailsMessageCreationObjectType = z.infer<typeof RunStepDetailsMessageCreationObject>;

export const RunStepDetailsToolCallsCodeOutputLogsObject = z.object({ type: z.enum(["logs"]), logs: z.string() });
export type RunStepDetailsToolCallsCodeOutputLogsObjectType = z.infer<
  typeof RunStepDetailsToolCallsCodeOutputLogsObject
>;

export const RunStepDetailsToolCallsCodeOutputImageObject = z.object({
  type: z.enum(["image"]),
  image: z.object({ file_id: z.string() }),
});
export type RunStepDetailsToolCallsCodeOutputImageObjectType = z.infer<
  typeof RunStepDetailsToolCallsCodeOutputImageObject
>;

export const RunStepDetailsToolCallsCodeObject = z.object({
  id: z.string(),
  type: z.enum(["code_interpreter"]),
  code_interpreter: z.object({
    input: z.string(),
    outputs: z.array(
      z.union([RunStepDetailsToolCallsCodeOutputLogsObject, RunStepDetailsToolCallsCodeOutputImageObject])
    ),
  }),
});
export type RunStepDetailsToolCallsCodeObjectType = z.infer<typeof RunStepDetailsToolCallsCodeObject>;

export const RunStepDetailsToolCallsRetrievalObject = z.object({
  id: z.string(),
  type: z.enum(["retrieval"]),
  retrieval: z.object({}).partial(),
});
export type RunStepDetailsToolCallsRetrievalObjectType = z.infer<typeof RunStepDetailsToolCallsRetrievalObject>;

export const RunStepDetailsToolCallsFunctionObject = z.object({
  id: z.string(),
  type: z.enum(["function"]),
  function: z.object({ name: z.string(), arguments: z.string(), output: z.string().nullish() }),
});
export type RunStepDetailsToolCallsFunctionObjectType = z.infer<typeof RunStepDetailsToolCallsFunctionObject>;

export const RunStepDetailsToolCallsObject = z.object({
  type: z.enum(["tool_calls"]),
  tool_calls: z.array(
    z.union([
      RunStepDetailsToolCallsCodeObject,
      RunStepDetailsToolCallsRetrievalObject,
      RunStepDetailsToolCallsFunctionObject,
    ])
  ),
});
export type RunStepDetailsToolCallsObjectType = z.infer<typeof RunStepDetailsToolCallsObject>;

export const RunStepCompletionUsage = z.object({
  completion_tokens: z.number().int(),
  prompt_tokens: z.number().int(),
  total_tokens: z.number().int(),
});
export type RunStepCompletionUsageType = z.infer<typeof RunStepCompletionUsage>;

export const RunStepObject = z.object({
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
  metadata: Metadata.nullish(),
  usage: RunStepCompletionUsage.nullable(),
});
export type RunStepObjectType = z.infer<typeof RunStepObject>;

export const ListRunStepsResponse = z.object({
  object: z.string(),
  data: z.array(RunStepObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
export type ListRunStepsResponseType = z.infer<typeof ListRunStepsResponse>;

export const AssistantFileObject = z.object({
  id: z.string(),
  object: z.enum(["assistant.file"]),
  created_at: z.number().int(),
  assistant_id: z.string(),
});
export type AssistantFileObjectType = z.infer<typeof AssistantFileObject>;

export const ListAssistantFilesResponse = z.object({
  object: z.string(),
  data: z.array(AssistantFileObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
export type ListAssistantFilesResponseType = z.infer<typeof ListAssistantFilesResponse>;

export const CreateAssistantFileRequest = z.object({ file_id: z.string() });
export type CreateAssistantFileRequestType = z.infer<typeof CreateAssistantFileRequest>;

export const DeleteAssistantFileResponse = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["assistant.file.deleted"]),
});
export type DeleteAssistantFileResponseType = z.infer<typeof DeleteAssistantFileResponse>;

export const MessageFileObject = z.object({
  id: z.string(),
  object: z.enum(["thread.message.file"]),
  created_at: z.number().int(),
  message_id: z.string(),
});
export type MessageFileObjectType = z.infer<typeof MessageFileObject>;

export const ListMessageFilesResponse = z.object({
  object: z.string(),
  data: z.array(MessageFileObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
export type ListMessageFilesResponseType = z.infer<typeof ListMessageFilesResponse>;

export const Error = z.object({
  code: z.string().nullable(),
  message: z.string(),
  param: z.string().nullable(),
  type: z.string(),
});
export type ErrorType = z.infer<typeof Error>;

export const ErrorResponse = z.object({ error: Error });
export type ErrorResponseType = z.infer<typeof ErrorResponse>;

export const ChatCompletionMessageToolCallChunk = z.object({
  index: z.number().int(),
  id: z.string().optional(),
  type: z.enum(["function"]).optional(),
  function: z.object({ name: z.string(), arguments: z.string() }).partial().optional(),
});
export type ChatCompletionMessageToolCallChunkType = z.infer<typeof ChatCompletionMessageToolCallChunk>;

export const ChatCompletionRole = z.enum(["system", "user", "assistant", "tool", "function"]);
export type ChatCompletionRoleType = z.infer<typeof ChatCompletionRole>;

export const ChatCompletionStreamResponseDelta = z
  .object({
    content: z.string().nullable(),
    function_call: z.object({ arguments: z.string(), name: z.string() }).partial(),
    tool_calls: z.array(ChatCompletionMessageToolCallChunk),
    role: z.enum(["system", "user", "assistant", "tool"]),
  })
  .partial();
export type ChatCompletionStreamResponseDeltaType = z.infer<typeof ChatCompletionStreamResponseDelta>;

export const CreateChatCompletionFunctionResponse = z.object({
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
export type CreateChatCompletionFunctionResponseType = z.infer<typeof CreateChatCompletionFunctionResponse>;

export const CreateChatCompletionStreamResponse = z.object({
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
export type CreateChatCompletionStreamResponseType = z.infer<typeof CreateChatCompletionStreamResponse>;

export const CreateChatCompletionImageResponse = z.object({}).partial();
export type CreateChatCompletionImageResponseType = z.infer<typeof CreateChatCompletionImageResponse>;

export const ListThreadsResponse = z.object({
  object: z.string(),
  data: z.array(ThreadObject),
  first_id: z.string(),
  last_id: z.string(),
  has_more: z.boolean(),
});
export type ListThreadsResponseType = z.infer<typeof ListThreadsResponse>;

export const DeleteMessageResponse = z.object({
  id: z.string(),
  deleted: z.boolean(),
  object: z.enum(["thread.message.deleted"]),
});
export type DeleteMessageResponseType = z.infer<typeof DeleteMessageResponse>;

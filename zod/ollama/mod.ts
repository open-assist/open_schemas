import { z } from "zod";

export const ChatMessage = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  images: z.array(z.string()).nullish(),
});
export type ChatMessageType = z.infer<typeof ChatMessage>;

/**
 * Reference [modelfile parameters](https://github.com/ollama/ollama/blob/main/docs/modelfile.md#parameter).
 */
export const ChatOptions = z.object({
  mirostat: z.number().int().min(0).max(2).default(0).nullish(),
  mirostat_eta: z.number().default(0.1).nullish(),
  mirostat_tau: z.number().default(5.0).nullish(),
  num_ctx: z.number().int().default(2048).nullish(),
  num_gqa: z.number({ description: "Required for some models, for example it is 8 for llama2:70b." }).int().nullish(),
  num_gpu: z.number().int().nullish(),
  num_thread: z.number().int().nullish(),
  repeat_last_n: z.number().int().default(64).nullish(),
  repeat_penalty: z.number().default(1.1).nullish(),
  temperature: z.number().default(0.8).nullish(),
  seed: z.number().int().default(0).nullish(),
  stop: z.string().nullish(),
  tfs_z: z.number().default(1).nullish(),
  num_predict: z.number().int().default(128).nullish(),
  top_k: z.number().int().default(40).nullish(),
  top_p: z.number().default(0.9).nullish(),
});
export type ChatOptionsType = z.infer<typeof ChatOptions>;

export const ChatRequest = z.object({
  model: z.string(),
  messages: z.array(ChatMessage).min(1),
  format: z.enum(["json"]).nullish(),
  options: ChatOptions.nullish(),
  template: z.string().nullish(),
  stream: z.boolean().nullish(),
  keep_alive: z.string().default("5m").nullish(),
});
export type ChatRequestType = z.infer<typeof ChatRequest>;

export const ChatResponse = z.object({
  model: z.string(),
  created_at: z.string().datetime(),
  message: ChatMessage.optional(),
  done: z.boolean(),
  total_duration: z.number().optional(),
  load_duration: z.number().optional(),
  prompt_eval_count: z.number().optional(),
  prompt_eval_duration: z.number().optional(),
  eval_count: z.number().optional(),
  eval_duration: z.number().optional(),
});
export type ChatResponseType = z.infer<typeof ChatResponse>;

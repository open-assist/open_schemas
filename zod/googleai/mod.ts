import { z } from "zod";

export const Blob = z.object({
  mimeType: z.string(),
  data: z.string(),
});
export type BlobTyp = z.infer<typeof Blob>;

export const FunctionCall = z.object({
  name: z.string(),
  args: z.any(),
});
export type FunctionCallType = z.infer<typeof FunctionCall>;

export const FunctionResponse = z.object({
  name: z.string(),
  response: z.any().nullish(),
});
export type FunctionResponse = z.infer<typeof FunctionResponse>;

export const Part = z.object({
  text: z.string().nullish(),
  inlineData: Blob.nullish(),
  functionCall: FunctionCall.nullish(),
  functionResponse: FunctionResponse.nullish(),
});
export type PartType = z.infer<typeof Part>;

export const Content = z.object({
  parts: z.array(Part).nullish(),
  role: z.string().nullish(),
});
export type ContentType = z.infer<typeof Content>;

export const FinishReason = z.enum([
  "FINISH_REASON_UNSPECIFIED",
  "STOP",
  "MAX_TOKENS",
  "SAFETY",
  "RECITATION",
  "OTHER",
]);
export type FinishReasonType = z.infer<typeof FinishReason>;

export const HarmCategory = z.enum([
  "HARM_CATEGORY_UNSPECIFIED",
  "HARM_CATEGORY_DEROGATORY",
  "HARM_CATEGORY_TOXICITY",
  "HARM_CATEGORY_VIOLENCE",
  "HARM_CATEGORY_SEXUAL",
  "HARM_CATEGORY_MEDICAL",
  "HARM_CATEGORY_DANGEROUS",
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
]);
export type HarmCategoryType = z.infer<typeof HarmCategory>;

export const HarmProbability = z.enum(["HARM_PROBABILITY_UNSPECIFIED", "NEGLIGIBLE", "LOW", "MEDIUM", "HIGH"]);
export type HarmProbabilityType = z.infer<typeof HarmProbability>;

export const SafetyRating = z.object({
  category: HarmCategory.nullish(),
  probability: HarmProbability.nullish(),
  blocked: z.boolean().nullish(),
});
export type SafetyRatingType = z.infer<typeof SafetyRating>;

export const CitationSource = z.object({
  startIndex: z.number().optional(),
  endIndex: z.number().optional(),
  uri: z.string().url().optional(),
  license: z.string().optional(),
});
export type CitationSourceType = z.infer<typeof CitationSource>;

export const CitationMetadata = z.object({
  citationSources: z.array(CitationSource),
});
export type CitationMetadataType = z.infer<typeof CitationMetadata>;

export const Candidate = z.object({
  content: Content,
  finishReason: FinishReason.nullish(),
  safetyRatings: z.array(SafetyRating).nullish(),
  citationMetadata: CitationMetadata.nullish(),
  tokenCount: z.number().nullish(),
  index: z.number().nullish(),
});
export type CandidateType = z.infer<typeof Candidate>;

export const BlockReason = z.enum(["BLOCK_REASON_UNSPECIFIED", "SAFETY", "OTHER"]);
export type BlockReasonType = z.infer<typeof BlockReason>;

export const PromptFeedback = z.object({
  blockReason: BlockReason.nullish(),
  safetyRatings: z.array(SafetyRating).nullish(),
});
export type PromptFeedbackType = z.infer<typeof PromptFeedback>;

export const GenerateContentResponse = z.object({
  candidates: z.array(Candidate),
  promptFeedback: PromptFeedback.nullish(),
});
export type GenerateContentResponseType = z.infer<typeof GenerateContentResponse>;

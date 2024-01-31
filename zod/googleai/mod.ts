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
  response: z.any(),
});
export type FunctionResponse = z.infer<typeof FunctionResponse>;

export const Part = z.object({
  text: z.string().optional(),
  InlineData: Blob.optional(),
  functionCall: FunctionCall.optional(),
  functionResponse: FunctionResponse.optional(),
});
export type PartType = z.infer<typeof Part>;

export const Content = z.object({
  parts: z.array(Part),
  role: z.string().optional(),
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
  category: HarmCategory,
  probability: HarmProbability,
  blocked: z.boolean().optional(),
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
  finishReason: FinishReason.optional(),
  safetyRatings: z.array(SafetyRating).optional(),
  citationMetadata: CitationMetadata,
  tokenCount: z.number().optional(),
  index: z.number(),
});
export type CandidateType = z.infer<typeof Candidate>;

export const BlockReason = z.enum(["BLOCK_REASON_UNSPECIFIED", "SAFETY", "OTHER"]);
export type BlockReasonType = z.infer<typeof BlockReason>;

export const PromptFeedback = z.object({
  blockReason: BlockReason,
});
export type PromptFeedbackType = z.infer<typeof PromptFeedback>;

export const GenerateContentResponse = z.object({
  candidates: z.array(Candidate),
  promptFeedback: PromptFeedback,
});
export type GenerateContentResponseType = z.infer<typeof GenerateContentResponse>;

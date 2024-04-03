import z from "zod";

export type ModelObject = z.infer<typeof ModelObject>;
export const ModelObject = z.object({
  id: z.string(),
  created: z.number().optional(),
  object: z.literal("model").default("model"),
  owned_by: z.string().default("openai"),
});

export type DeleteModelResponse = z.infer<typeof DeleteModelResponse>;
export const DeleteModelResponse = z.object({
  id: z.string(),
  deleted: z.literal(true).default(true),
  object: z.literal("model").default("model"),
});

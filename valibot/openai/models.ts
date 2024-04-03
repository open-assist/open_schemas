import * as v from "valibot";

export type ModelObject = v.Output<typeof ModelObject>;
export const ModelObject = v.object({
  id: v.string(),
  created: v.optional(v.number()),
  object: v.literal("model"),
  own_by: v.string(),
});

export type DeleteModelResponse = v.Output<typeof DeleteModelResponse>;
export const DeleteModelResponse = v.object({
  id: v.string(),
  deleted: v.literal(true),
  object: v.literal("model"),
});

import * as v from "valibot";

export type FileObject = v.Output<typeof FileObject>;
export const FileObject = v.object({
  id: v.string(),
  bytes: v.number(),
  created_at: v.number(),
  filename: v.string(),
  object: v.literal("file"),
  purpose: v.union([
    v.literal("fine-tune"),
    v.literal("fine-tune-results"),
    v.literal("assistants"),
    v.literal("assistants_output"),
  ]),
  status: v.optional(v.union([v.literal("uploaded"), v.literal("processed"), v.literal("error")])),
  status_details: v.optional(v.string()),
});

export type UploadFileRequest = v.Output<typeof UploadFileRequest>;
export const UploadFileRequest = v.object({
  file: v.object({
    name: v.string(),
    size: v.number([v.minValue(1), v.maxValue(512000000)]),
    type: v.string(),
  }),
  purpose: v.union([v.literal("fine-tune"), v.literal("assistants")]),
});

export type DeleteFileResponse = v.Output<typeof DeleteFileResponse>;
export const DeleteFileResponse = v.object({
  id: v.string(),
  object: v.literal("file"),
  deleted: v.literal(true),
});

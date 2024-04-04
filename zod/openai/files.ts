import z from 'zod'

export type FileObject = z.infer<typeof FileObject>
export const FileObject = z.object({
  id: z.string(),
  bytes: z.number(),
  created_at: z.number(),
  filename: z.string(),
  object: z.literal('file').default('file'),
  purpose: z.union([
    z.literal('fine-tune'),
    z.literal('fine-tune-results'),
    z.literal('assistants'),
    z.literal('assistants_output')
  ]),
  status: z
    .union([z.literal('uploaded'), z.literal('processed'), z.literal('error')])
    .optional(),
  status_details: z.string().optional()
})

export type UploadFileRequest = z.infer<typeof UploadFileRequest>
export const UploadFileRequest = z.object({
  file: z.object({
    name: z.string(),
    size: z.number().min(1).max(512000000),
    type: z.string()
  }),
  purpose: z.union([z.literal('fine-tune'), z.literal('assistants')])
})

export type DeleteFileResponse = z.infer<typeof DeleteFileResponse>
export const DeleteFileResponse = z.object({
  id: z.string(),
  object: z.literal('file').default('file'),
  deleted: z.literal(true).default(true)
})

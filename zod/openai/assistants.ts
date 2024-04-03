import z from "zod";

export type Metadata = z.infer<typeof Metadata>;
export const Metadata = z.record(z.string());

export type ObjectMeta = z.infer<typeof ObjectMeta>;
export const ObjectMeta = z.object({
  id: z.string(),
  created_at: z.number(),
});

export type CodeInterpreterTool = z.infer<typeof CodeInterpreterTool>;
export const CodeInterpreterTool = z.object({
  type: z.literal("code_interpreter").default("code_interpreter"),
});

export type RetrievalTool = z.infer<typeof RetrievalTool>;
export const RetrievalTool = z.object({
  type: z.literal("retrieval").default("retrieval"),
});

export type FunctionTool = z.infer<typeof FunctionTool>;
export const FunctionTool = z.object({
  type: z.literal("function").default("function"),
  function: z.object({
    description: z.string(),
    name: z.string().max(64),
    parameters: z.record(z.unknown()),
  }),
});

export type Tool = z.infer<typeof Tool>;
export const Tool = z.union([CodeInterpreterTool, RetrievalTool, FunctionTool]);

export type AssistantObject = z.infer<typeof AssistantObject>;
export const AssistantObject = z.intersection(
  z.object({
    object: z.literal("assistant").default("assistant"),
    name: z.string().max(256).nullish(),
    description: z.string().max(512).nullish(),
    model: z.string(),
    instructions: z.string().nullish(),
    tools: z.array(Tool).nullish(),
    file_ids: z.array(z.string()).max(20).nullish(),
    metadata: Metadata.nullish(),
  }),
  ObjectMeta,
);

export type AssistantFileObject = z.infer<typeof AssistantFileObject>;
export const AssistantFileObject = z.object({
  object: z.literal("assistant.file").default("assistant.file"),
  assistant_id: z.string(),
});

export type ThreadObject = z.infer<typeof ThreadObject>;
export const ThreadObject = z.intersection(
  z.object({
    object: z.literal("thread").default("thread"),
    metadata: Metadata.nullish(),
  }),
  ObjectMeta,
);

export type MessageImageFileContent = z.infer<typeof MessageImageFileContent>;
export const MessageImageFileContent = z.object({
  type: z.literal("image_file"),
  image_file: z.object({
    file_id: z.string(),
  }),
});

export type FileCitationAnnotation = z.infer<typeof FileCitationAnnotation>;
export const FileCitationAnnotation = z.object({
  type: z.literal("file_citation").default("file_citation"),
  text: z.string(),
  file_citation: z.object({
    file_id: z.string(),
    quote: z.string(),
  }),
  start_index: z.number(),
  end_index: z.number(),
});

export type FilePathAnnotation = z.infer<typeof FilePathAnnotation>;
export const FilePathAnnotation = z.object({
  type: z.literal("file_path").default("file_path"),
  text: z.string(),
  file_path: z.object({
    file_id: z.string(),
  }),
  start_index: z.number(),
  end_index: z.number(),
});

export type MessageTextContent = z.infer<typeof MessageTextContent>;
export const MessageTextContent = z.object({
  type: z.literal("text").default("text"),
  text: z.object({
    value: z.string(),
    annotations: z.array(z.union([FileCitationAnnotation, FilePathAnnotation])).nullish(),
  }),
});

export type MessageObject = z.infer<typeof MessageObject>;
export const MessageObject = z.intersection(
  z.object({
    object: z.literal("thread.message").default("thread.message"),
    thread_id: z.string(),
    status: z
      .union([z.literal("in_progress"), z.literal("incomplete"), z.literal("completed")])
      .nullish(),
    incomplete_details: z
      .object({
        reason: z.string(),
      })
      .nullish(),
    completed_at: z.number().nullish(),
    incomplete_at: z.number().nullish(),
    role: z.union([z.literal("user"), z.literal("assistant")]),
    content: z.array(z.union([MessageImageFileContent, MessageTextContent])),
    assistant_id: z.string().nullish(),
    run_id: z.string().nullish(),
    file_ids: z.array(z.string()).max(10).nullish(),
    metadata: Metadata.nullish(),
  }),
  ObjectMeta,
);

export type MessageFileObject = z.infer<typeof MessageFileObject>;
export const MessageFileObject = z.intersection(
  z.object({
    object: z.literal("thread.message.file").default("thread.message.file"),
    message_id: z.string(),
  }),
  ObjectMeta,
);

export type CodeInterpreterLogOutput = z.infer<typeof CodeInterpreterLogOutput>;
export const CodeInterpreterLogOutput = z.object({
  type: z.literal("logs").default("logs"),
  logs: z.string(),
});

export type CodeInterpreterImageOutput = z.infer<typeof CodeInterpreterImageOutput>;
export const CodeInterpreterImageOutput = z.object({
  type: z.literal("image").default("image"),
  image: z.object({
    file_id: z.string(),
  }),
});

export type CodeInterpreterOutput = z.infer<typeof CodeInterpreterOutput>;
export const CodeInterpreterOutput = z.union([
  CodeInterpreterImageOutput,
  CodeInterpreterLogOutput,
]);

export type CodeInterpreterToolCall = z.infer<typeof CodeInterpreterToolCall>;
export const CodeInterpreterToolCall = z.object({
  id: z.string(),
  type: z.literal("code_interpreter"),
  code_interpreter: z.object({
    input: z.string(),
    outputs: z.array(CodeInterpreterOutput),
  }),
});

export type RetrievalToolCall = z.infer<typeof RetrievalToolCall>;
export const RetrievalToolCall = z.object({
  id: z.string(),
  type: z.literal("retrieval").default("retrieval"),
  retrieval: z.record(z.unknown()).nullish(),
});

export type FunctionToolCall = z.infer<typeof FunctionToolCall>;
export const FunctionToolCall = z.object({
  id: z.string(),
  type: z.literal("function"),
  function: z.object({
    name: z.string(),
    arguments: z.string(),
    output: z.string().nullish(),
  }),
});

export type ToolCall = z.infer<typeof ToolCall>;
export const ToolCall = z.union([CodeInterpreterToolCall, RetrievalToolCall, FunctionToolCall]);

export type SubmitToolOutputsAction = z.infer<typeof SubmitToolOutputsAction>;
export const SubmitToolOutputsAction = z.object({
  type: z.literal("submit_tool_outputs"),
  submit_tool_outputs: z.object({
    tool_calls: z.array(FunctionToolCall),
  }),
});

export type Usage = z.infer<typeof Usage>;
export const Usage = z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
  total_tokens: z.number(),
});

export type RunObject = z.infer<typeof RunObject>;
export const RunObject = z.intersection(
  z.object({
    object: z.literal("thread.run").default("thread.run"),
    thread_id: z.string(),
    assistant_id: z.string(),
    status: z.union([
      z.literal("queued"),
      z.literal("in_progress"),
      z.literal("requires_action"),
      z.literal("cancelling"),
      z.literal("cancelled"),
      z.literal("failed"),
      z.literal("completed"),
      z.literal("expired"),
    ]),
    required_action: SubmitToolOutputsAction.nullish(),
    last_error: z
      .object({
        code: z.union([
          z.literal("server_error"),
          z.literal("rate_limit_exceeded"),
          z.literal("invalid_prompt"),
        ]),
        message: z.string(),
      })
      .nullish(),
    expires_at: z.number().nullish(),
    started_at: z.number().nullish(),
    cancelled_at: z.number().nullish(),
    failed_at: z.number().nullish(),
    completed_at: z.number().nullish(),
    model: z.string().nullish(),
    instructions: z.string().nullish(),
    tools: z.array(Tool).nullish(),
    file_ids: z.array(z.string()).nullish(),
    metadata: Metadata.nullish(),
    usage: Usage.nullish(),
    temperature: z.number().min(0).max(1).default(1).nullish(),
  }),
  ObjectMeta,
);

export type MessageCreationDetail = z.infer<typeof MessageCreationDetail>;
export const MessageCreationDetail = z.object({
  type: z.literal("message_creation"),
  message_creation: z.object({
    message_id: z.string(),
  }),
});

export type ToolCallsDetail = z.infer<typeof ToolCallsDetail>;
export const ToolCallsDetail = z.object({
  type: z.literal("tool_calls"),
  tool_calls: z.array(ToolCall),
});

export type StepObject = z.infer<typeof StepObject>;
export const StepObject = z.intersection(
  z.object({
    object: z.literal("thread.run.step").default("thread.run.step"),
    assistant_id: z.string(),
    thread_id: z.string(),
    run_id: z.string(),
    type: z.union([z.literal("message_creation"), z.literal("tool_calls")]),
    status: z.union([
      z.literal("in_progress"),
      z.literal("cancelled"),
      z.literal("failed"),
      z.literal("completed"),
      z.literal("expired"),
    ]),
    step_details: z.union([MessageCreationDetail, ToolCallsDetail]),
    last_error: z
      .object({
        code: z.union([z.literal("server_error"), z.literal("rate_limit_exceeded")]),
        message: z.string(),
      })
      .nullish(),
    expired_at: z.number().nullish(),
    cancelled_at: z.number().nullish(),
    failed_at: z.number().nullish(),
    completed_at: z.number().nullish(),
    metadata: Metadata.nullish(),
    usage: Usage.nullish(),
  }),
  ObjectMeta,
);

export type CreateAssistantRequest = z.infer<typeof CreateAssistantRequest>;
export const CreateAssistantRequest = z.intersection(
  z.object({
    name: z.string().max(256).nullish(),
    description: z.string().max(512).nullish(),
    model: z.string(),
    instructions: z.string().nullish(),
    tools: z.array(Tool).nullish(),
    file_ids: z.array(z.string()).max(20).nullish(),
    metadata: Metadata.nullish(),
  }),
  z.object({}),
);

export type CreateAssistantFileRequest = z.infer<typeof CreateAssistantFileRequest>;
export const CreateAssistantFileRequest = z.object({
  file_id: z.string(),
});

export type ModifyAssistantRequest = z.infer<typeof ModifyAssistantRequest>;
export const ModifyAssistantRequest = z.intersection(
  z.object({
    name: z.string().max(256).nullish(),
    description: z.string().max(512).nullish(),
    model: z.string().optional(),
    instructions: z.string().nullish(),
    tools: z.array(Tool).nullish(),
    file_ids: z.array(z.string()).max(20).nullish(),
    metadata: Metadata.nullish(),
  }),
  z.object({}),
);

export type CreateMessageRequest = z.infer<typeof CreateMessageRequest>;
export const CreateMessageRequest = z.object({
  role: z.union([z.literal("user"), z.literal("assistant")]),
  content: z.string(),
  file_ids: z.array(z.string()).nullish(),
});

export type CreateThreadRequest = z.infer<typeof CreateThreadRequest>;
export const CreateThreadRequest = z.object({
  messages: z.array(CreateMessageRequest).nullish(),
  metadata: Metadata.nullish(),
});

export type ModifyThreadRequest = z.infer<typeof ModifyThreadRequest>;
export const ModifyThreadRequest = z.object({
  metadata: Metadata.nullish(),
});

export type ModifyMessageRequest = z.infer<typeof ModifyMessageRequest>;
export const ModifyMessageRequest = z.object({
  metadata: Metadata.nullish(),
});

export type CreateRunRequest = z.infer<typeof CreateRunRequest>;
export const CreateRunRequest = z.intersection(
  z.object({
    additional_instructions: z.string().nullish(),
    stream: z.boolean().default(false).nullish(),
  }),
  z.intersection(
    z.object({
      assistant_id: z.string(),
      model: z.string().nullish(),
      instructions: z.string().nullish(),
      tools: z.array(Tool).nullish(),
      metadata: Metadata.nullish(),
      temperature: z.number().min(0).max(1).default(1).nullish(),
    }),
    z.object({}),
  ),
);

export type CreateThreadAndRunRequest = z.infer<typeof CreateThreadAndRunRequest>;
export const CreateThreadAndRunRequest = z.intersection(
  z.object({
    thread: CreateThreadRequest.nullish(),
  }),
  CreateRunRequest,
);

export type ModifyRunRequest = z.infer<typeof ModifyRunRequest>;
export const ModifyRunRequest = z.object({
  metadata: Metadata.nullish(),
});

export type ToolOutput = z.infer<typeof ToolOutput>;
export const ToolOutput = z.object({
  tool_call_id: z.string(),
  output: z.string().nullish(),
});

export type SubmitToolOutputsToRunRequest = z.infer<typeof SubmitToolOutputsToRunRequest>;
export const SubmitToolOutputsToRunRequest = z.object({
  tool_outputs: z.array(ToolOutput),
  stream: z.boolean().default(false).nullish(),
});

export type DeleteResponse = z.infer<typeof DeleteResponse>;
export const DeleteResponse = z.object({
  id: z.string(),
  deleted: z.literal(true).default(true),
});

export type DeleteAssistantResponse = z.infer<typeof DeleteAssistantResponse>;
export const DeleteAssistantResponse = z.intersection(
  z.object({
    object: z.literal("assistant.deleted").default("assistant.deleted"),
  }),
  DeleteResponse,
);

export type DeleteAssistantFileResponse = z.infer<typeof DeleteAssistantFileResponse>;
export const DeleteAssistantFileResponse = z.intersection(
  z.object({
    object: z.literal("assistant.file.deleted").default("assistant.file.deleted"),
  }),
  DeleteResponse,
);

export type DeleteThreadResponse = z.infer<typeof DeleteThreadResponse>;
export const DeleteThreadResponse = z.intersection(
  z.object({
    object: z.literal("thread.deleted").default("thread.deleted"),
  }),
  DeleteResponse,
);

export type Pagination = z.infer<typeof Pagination>;
export const Pagination = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  after: z.string().optional(),
  before: z.string().optional(),
});

export type Ordering = z.infer<typeof Ordering>;
export const Ordering = z.object({
  order: z
    .union([z.literal("asc"), z.literal("desc")])
    .default("desc")
    .optional(),
});

import * as v from "valibot";

export type Metadata = v.Output<typeof Metadata>;
export const Metadata = v.record(v.string());

export type ObjectMeta = v.Output<typeof ObjectMeta>;
export const ObjectMeta = v.object({
  id: v.string(),
  created_at: v.number(),
});

export type CodeInterpreterTool = v.Output<typeof CodeInterpreterTool>;
export const CodeInterpreterTool = v.object({
  type: v.literal("code_interpreter"),
});

export type RetrievalTool = v.Output<typeof RetrievalTool>;
export const RetrievalTool = v.object({
  type: v.literal("retrieval"),
});

export type FunctionTool = v.Output<typeof FunctionTool>;
export const FunctionTool = v.object({
  type: v.literal("function"),
  function: v.object({
    description: v.string(),
    name: v.string([v.maxLength(64)]),
    parameters: v.record(v.unknown()),
  }),
});

export type Tool = v.Output<typeof Tool>;
export const Tool = v.union([CodeInterpreterTool, RetrievalTool, FunctionTool]);

export type AssistantObject = v.Output<typeof AssistantObject>;
export const AssistantObject = v.merge([
  v.object({
    object: v.literal("assistant"),
    name: v.optional(v.nullable(v.string([v.maxLength(256)]))),
    description: v.optional(v.nullable(v.string([v.maxLength(512)]))),
    model: v.string(),
    instructions: v.optional(v.nullable(v.string())),
    tools: v.optional(v.nullable(v.array(Tool))),
    file_ids: v.optional(v.nullable(v.array(v.string(), [v.maxLength(20)]))),
    metadata: v.optional(v.nullable(Metadata)),
  }),
  ObjectMeta,
]);

export type AssistantFileObject = v.Output<typeof AssistantFileObject>;
export const AssistantFileObject = v.object({
  object: v.literal("assistant.file"),
  assistant_id: v.string(),
});

export type ThreadObject = v.Output<typeof ThreadObject>;
export const ThreadObject = v.merge([
  v.object({
    object: v.literal("thread"),
    metadata: v.optional(v.nullable(Metadata)),
  }),
  ObjectMeta,
]);

export type MessageImageFileContent = v.Output<typeof MessageImageFileContent>;
export const MessageImageFileContent = v.object({
  type: v.literal("image_file"),
  image_file: v.object({
    file_id: v.string(),
  }),
});

export type FileCitationAnnotation = v.Output<typeof FileCitationAnnotation>;
export const FileCitationAnnotation = v.object({
  type: v.literal("file_citation"),
  text: v.string(),
  file_citation: v.object({
    file_id: v.string(),
    quote: v.string(),
  }),
  start_index: v.number(),
  end_index: v.number(),
});

export type FilePathAnnotation = v.Output<typeof FilePathAnnotation>;
export const FilePathAnnotation = v.object({
  type: v.literal("file_path"),
  text: v.string(),
  file_path: v.object({
    file_id: v.string(),
  }),
  start_index: v.number(),
  end_index: v.number(),
});

export type MessageTextContent = v.Output<typeof MessageTextContent>;
export const MessageTextContent = v.object({
  type: v.literal("text"),
  text: v.object({
    value: v.string(),
    annotations: v.array(v.union([FileCitationAnnotation, FilePathAnnotation])),
  }),
});

export type MessageObject = v.Output<typeof MessageObject>;
export const MessageObject = v.merge([
  v.object({
    object: v.literal("thread.message"),
    thread_id: v.string(),
    status: v.union([v.literal("in_progress"), v.literal("incomplete"), v.literal("completed")]),
    incomplete_details: v.optional(
      v.nullable(
        v.object({
          reason: v.string(),
        }),
      ),
    ),
    completed_at: v.optional(v.nullable(v.number())),
    incomplete_at: v.optional(v.nullable(v.number())),
    role: v.union([v.literal("user"), v.literal("assistant")]),
    content: v.array(v.union([MessageImageFileContent, MessageTextContent])),
    assistant_id: v.optional(v.nullable(v.string())),
    run_id: v.optional(v.nullable(v.string())),
    file_ids: v.optional(v.nullable(v.array(v.string(), [v.maxLength(10)]))),
    metadata: v.optional(v.nullable(Metadata)),
  }),
  ObjectMeta,
]);

export type MessageFileObject = v.Output<typeof MessageFileObject>;
export const MessageFileObject = v.merge([
  v.object({
    object: v.literal("thread.message.file"),
    message_id: v.string(),
  }),
  ObjectMeta,
]);

export type CodeInterpreterLogOutput = v.Output<typeof CodeInterpreterLogOutput>;
export const CodeInterpreterLogOutput = v.object({
  type: v.literal("logs"),
  logs: v.string(),
});

export type CodeInterpreterImageOutput = v.Output<typeof CodeInterpreterImageOutput>;
export const CodeInterpreterImageOutput = v.object({
  type: v.literal("image"),
  image: v.object({
    file_id: v.string(),
  }),
});

export type CodeInterpreterOutput = v.Output<typeof CodeInterpreterOutput>;
export const CodeInterpreterOutput = v.union([
  CodeInterpreterImageOutput,
  CodeInterpreterLogOutput,
]);

export type CodeInterpreterToolCall = v.Output<typeof CodeInterpreterToolCall>;
export const CodeInterpreterToolCall = v.object({
  id: v.string(),
  type: v.literal("code_interpreter"),
  code_interpreter: v.object({
    input: v.string(),
    outputs: v.array(CodeInterpreterOutput),
  }),
});

export type RetrievalToolCall = v.Output<typeof RetrievalToolCall>;
export const RetrievalToolCall = v.object({
  id: v.string(),
  type: v.literal("retrieval"),
  retrieval: v.optional(v.nullable(v.record(v.unknown()))),
});

export type FunctionToolCall = v.Output<typeof FunctionToolCall>;
export const FunctionToolCall = v.object({
  id: v.string(),
  type: v.literal("function"),
  function: v.object({
    name: v.string(),
    arguments: v.string(),
    output: v.optional(v.nullable(v.string())),
  }),
});

export type ToolCall = v.Output<typeof ToolCall>;
export const ToolCall = v.union([CodeInterpreterToolCall, RetrievalToolCall, FunctionToolCall]);

export type SubmitToolOutputsAction = v.Output<typeof SubmitToolOutputsAction>;
export const SubmitToolOutputsAction = v.object({
  type: v.literal("submit_tool_outputs"),
  submit_tool_outputs: v.object({
    tool_calls: v.array(FunctionToolCall),
  }),
});

export type Usage = v.Output<typeof Usage>;
export const Usage = v.object({
  completion_tokens: v.number(),
  prompt_tokens: v.number(),
  total_tokens: v.number(),
});

export type RunObject = v.Output<typeof RunObject>;
export const RunObject = v.merge([
  v.object({
    object: v.literal("thread.run"),
    thread_id: v.string(),
    assistant_id: v.string(),
    status: v.union([
      v.literal("queued"),
      v.literal("in_progress"),
      v.literal("requires_action"),
      v.literal("cancelling"),
      v.literal("cancelled"),
      v.literal("failed"),
      v.literal("completed"),
      v.literal("expired"),
    ]),
    required_action: v.optional(v.nullable(SubmitToolOutputsAction)),
    last_error: v.optional(
      v.nullable(
        v.object({
          code: v.union([
            v.literal("server_error"),
            v.literal("rate_limit_exceeded"),
            v.literal("invalid_prompt"),
          ]),
          message: v.string(),
        }),
      ),
    ),
    expires_at: v.optional(v.nullable(v.number())),
    started_at: v.optional(v.nullable(v.number())),
    cancelled_at: v.optional(v.nullable(v.number())),
    failed_at: v.optional(v.nullable(v.number())),
    completed_at: v.optional(v.nullable(v.number())),
    model: v.optional(v.nullable(v.string())),
    instructions: v.optional(v.nullable(v.string())),
    tools: v.optional(v.nullable(v.array(Tool))),
    file_ids: v.optional(v.nullable(v.array(v.string()))),
    metadata: v.optional(v.nullable(Metadata)),
    usage: v.optional(v.nullable(Usage)),
    temperature: v.optional(v.nullable(v.number([v.minValue(0), v.maxValue(1)]))),
  }),
  ObjectMeta,
]);

export type MessageCreationDetail = v.Output<typeof MessageCreationDetail>;
export const MessageCreationDetail = v.object({
  type: v.literal("message_creation"),
  message_creation: v.object({
    message_id: v.string(),
  }),
});

export type ToolCallsDetail = v.Output<typeof ToolCallsDetail>;
export const ToolCallsDetail = v.object({
  type: v.literal("tool_calls"),
  tool_calls: v.array(ToolCall),
});

export type StepObject = v.Output<typeof StepObject>;
export const StepObject = v.merge([
  v.object({
    object: v.literal("thread.run.step"),
    assistant_id: v.string(),
    thread_id: v.string(),
    run_id: v.string(),
    type: v.union([v.literal("message_creation"), v.literal("tool_calls")]),
    status: v.union([
      v.literal("in_progress"),
      v.literal("cancelled"),
      v.literal("failed"),
      v.literal("completed"),
      v.literal("expired"),
    ]),
    step_details: v.union([MessageCreationDetail, ToolCallsDetail]),
    last_error: v.optional(
      v.nullable(
        v.object({
          code: v.union([v.literal("server_error"), v.literal("rate_limit_exceeded")]),
          message: v.string(),
        }),
      ),
    ),
    expired_at: v.optional(v.nullable(v.number())),
    cancelled_at: v.optional(v.nullable(v.number())),
    failed_at: v.optional(v.nullable(v.number())),
    completed_at: v.optional(v.nullable(v.number())),
    metadata: v.optional(v.nullable(Metadata)),
    usage: v.optional(v.nullable(Usage)),
  }),
  ObjectMeta,
]);

export type CreateAssistantRequest = v.Output<typeof CreateAssistantRequest>;
export const CreateAssistantRequest = v.merge([
  v.object({
    name: v.optional(v.nullable(v.string([v.maxLength(256)]))),
    description: v.optional(v.nullable(v.string([v.maxLength(512)]))),
    model: v.string(),
    instructions: v.optional(v.nullable(v.string())),
    tools: v.optional(v.nullable(v.array(Tool))),
    file_ids: v.optional(v.nullable(v.array(v.string(), [v.maxLength(20)]))),
    metadata: v.optional(v.nullable(Metadata)),
  }),
  v.object({}),
]);

export type CreateAssistantFileRequest = v.Output<typeof CreateAssistantFileRequest>;
export const CreateAssistantFileRequest = v.object({
  file_id: v.string(),
});

export type ModifyAssistantRequest = v.Output<typeof ModifyAssistantRequest>;
export const ModifyAssistantRequest = v.merge([
  v.object({
    name: v.optional(v.nullable(v.string([v.maxLength(256)]))),
    description: v.optional(v.nullable(v.string([v.maxLength(512)]))),
    model: v.optional(v.nullable(v.string())),
    instructions: v.optional(v.nullable(v.string())),
    tools: v.optional(v.nullable(v.array(Tool))),
    file_ids: v.optional(v.nullable(v.array(v.string(), [v.maxLength(20)]))),
    metadata: v.optional(v.nullable(Metadata)),
  }),
  v.object({}),
]);

export type CreateMessageRequest = v.Output<typeof CreateMessageRequest>;
export const CreateMessageRequest = v.object({
  role: v.union([v.literal("user"), v.literal("assistant")]),
  content: v.string(),
  file_ids: v.optional(v.nullable(v.array(v.string()))),
});

export type CreateThreadRequest = v.Output<typeof CreateThreadRequest>;
export const CreateThreadRequest = v.object({
  messages: v.optional(v.nullable(v.array(CreateMessageRequest))),
  metadata: v.optional(v.nullable(Metadata)),
});

export type ModifyThreadRequest = v.Output<typeof ModifyThreadRequest>;
export const ModifyThreadRequest = v.object({
  metadata: v.optional(v.nullable(Metadata)),
});

export type ModifyMessageRequest = v.Output<typeof ModifyMessageRequest>;
export const ModifyMessageRequest = v.object({
  metadata: v.optional(v.nullable(Metadata)),
});

export type CreateRunRequest = v.Output<typeof CreateRunRequest>;
export const CreateRunRequest = v.merge([
  v.object({
    additional_instructions: v.optional(v.nullable(v.string())),
    stream: v.optional(v.nullable(v.boolean())),
  }),
  v.merge([
    v.object({
      assistant_id: v.string(),
      model: v.optional(v.nullable(v.string())),
      instructions: v.optional(v.nullable(v.string())),
      tools: v.optional(v.nullable(v.array(Tool))),
      metadata: v.optional(v.nullable(Metadata)),
      temperature: v.optional(v.nullable(v.number([v.minValue(0), v.maxValue(1)]))),
    }),
    v.object({}),
  ]),
]);

export type CreateThreadAndRunRequest = v.Output<typeof CreateThreadAndRunRequest>;
export const CreateThreadAndRunRequest = v.merge([
  v.object({
    thread: v.optional(v.nullable(CreateThreadRequest)),
  }),
  CreateRunRequest,
]);

export type ModifyRunRequest = v.Output<typeof ModifyRunRequest>;
export const ModifyRunRequest = v.object({
  metadata: v.optional(v.nullable(Metadata)),
});

export type ToolOutpt = v.Output<typeof ToolOutpt>;
export const ToolOutpt = v.object({
  tool_call_id: v.string(),
  output: v.optional(v.nullable(v.string())),
});

export type SubmitToolOutputsToRunRequest = v.Output<typeof SubmitToolOutputsToRunRequest>;
export const SubmitToolOutputsToRunRequest = v.object({
  tool_outputs: v.array(ToolOutpt),
  stream: v.optional(v.nullable(v.boolean())),
});

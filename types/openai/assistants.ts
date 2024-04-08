/* ---------------------------------------------------------------------------- */
/* --------------------------------- Objects ---------------------------------- */
/* ---------------------------------------------------------------------------- */

/**
 * Set of 16 key-value pairs that can be attached to an object. This can be useful for storing
 * additional information about the object in a structured format. Keys can be a maximum of 64
 * characters long and values can be a maxium of 512 characters long.
 */
export type Metadata = Record<string, string>;

export type ObjectMeta = {
  /**
   * The identifier, which can be referenced in API endpoints.
   */
  id: string;
  /**
   * The Unix timestamp (in seconds) for when the object was created.
   */
  created_at: number;
};

/**
 * Code interpreter tool
 */
export type CodeInterpreterTool = {
  /**
   * The type of tool being defined: code_interpreter.
   *
   * @default code_interpreter
   */
  type: "code_interpreter";
};
/**
 * Retrieval tool
 */
export type RetrievalTool = {
  /**
   * The type of tool being defined: retrieval.
   *
   * @default retrieval
   */
  type: "retrieval";
};

/**
 * Function tool
 */
export type FunctionTool = {
  /**
   * The type of tool being defined: function
   *
   * @default function
   */
  type: "function";

  function: {
    /**
     * A description of what the function does, used by the model to choose when and how to call
     * the function.
     */
    description: string;
    /**
     * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and
     * dashes, with a maximum length of 64.
     *
     * @maxLength 64
     */
    name: string;

    /**
     * The parameters the functions accepts, described as a JSON Schema object. See the guide for
     * examples, and the JSON Schema reference for documentation about the format.
     */
    parameters: Record<string, unknown>;
  };
};

export type Tool = CodeInterpreterTool | RetrievalTool | FunctionTool;

/**
 * Represents an assistant that can call the model and use tools.
 */
export type AssistantObject = {
  /**
   * The object type, which is always assistant.
   *
   * @default assistant
   */
  object: "assistant";

  /**
   * The name of the assistant. The maximum length is 256 characters.
   *
   * @maxLength 256
   */
  name?: string;

  /**
   * The description of the assistant. The maximum length is 512 characters.
   *
   * @maxLength 512
   */
  description?: string;

  /**
   * ID of the model to use. You can use the List models API to see all of your available models,
   * or see our Model overview for descriptions of them.
   */
  model: string;

  /**
   * The system instructions that the assistant uses. The maximum length is 32768 characters.
   */
  instructions?: string;

  /**
   * A list of tool enabled on the assistant. There can be a maximum of 128 tools per assistant.
   * Tools can be of types code_interpreter, retrieval, or function.
   */
  tools?: Tool[];

  /**
   * A list of file IDs attached to this assistant. There can be a maximum of 20 files attached to
   * the assistant. Files are ordered by their creation date in ascending order.
   *
   * @maxItems 20
   */
  file_ids?: string[];

  metadata?: Metadata;
} & ObjectMeta;

/**
 * A list of Files attached to an assistant.
 */
export type AssistantFileObject = {
  /**
   * The object type, which is always assistant.file.
   *
   * @default assistant.file
   */
  object: "assistant.file";

  /**
   * The assistant ID that the file is attached to.
   */
  assistant_id: string;
};

/**
 * Represents a thread that contains messages.
 */
export type ThreadObject = {
  /**
   * The object type, which is always thread.
   *
   * @default thread
   */
  object: "thread";

  metadata?: Metadata;
} & ObjectMeta;

/**
 * References an image File in the content of a message.
 */
export type MessageImageFileContent = {
  type: "image_file";
  image_file: {
    /**
     * The File ID of the image in the message content.
     */
    file_id: string;
  };
};

/**
 * A citation within the message that points to a specific quote from a specific File associated with the assistant or the message.
 * Generated when the assistant uses the retrieval tool to search files.
 */
export type FileCitationAnnotation = {
  /**
   * @default file_citation
   */
  type: "file_citation";
  /**
   * The text in the message content that needs to be replaced.
   */
  text: string;
  file_citation: {
    /**
     * The ID of the specific File the citation is from.
     */
    file_id: string;
    /**
     * The specific quote in the file.
     */
    quote: string;
  };
  start_index: number;
  end_index: number;
};

/**
 * A URL for the file that's generated when the assistant used the code_interpreter tool to generate a file.
 */
export type FilePathAnnotation = {
  /**
   * @default file_path
   */
  type: "file_path";
  /**
   * The text in the message content that needs to be replaced.
   */
  text: string;
  file_path: {
    file_id: string;
  };
  start_index: number;
  end_index: number;
};

/**
 * The text content that is part of a message.
 */
export type MessageTextContent = {
  /**
   * Always text.
   *
   * @default text
   */
  type: "text";
  /**
   * Detail of text.
   */
  text: {
    /**
     * The data that makes up the text.
     */
    value: string;
    annotations?: (FileCitationAnnotation | FilePathAnnotation)[];
  };
};

/**
 * Represents a message within a thread.
 */
export type MessageObject = {
  /**
   * The object type, which is always thread.message.
   *
   * @default thread.message
   */
  object: "thread.message";
  /**
   * The thread ID that this message belongs to.
   */
  thread_id: string;
  /**
   * The status of the message, which can be either in_progress, incomplete, or completed.
   */
  status?: "in_progress" | "incomplete" | "completed";
  /**
   * On an incomplete message, details about why the message is incomplete.
   */
  incomplete_details?: {
    /**
     * The reason the message is incomplete.
     */
    reason: string;
  };
  /**
   * The Unix timestamp (in seconds) for when the message was completed.
   */
  completed_at?: number;
  /**
   * The Unix timestamp (in seconds) for when the message was marked as incomplete.
   */
  incomplete_at?: number;
  /**
   * The entity that produced the message. One of user or assistant.
   */
  role: "user" | "assistant";
  /**
   * The content of the message in array of text and/or images.
   */
  content: (MessageImageFileContent | MessageTextContent)[];
  /**
   * If applicable, the ID of the assistant that authored this message.
   */
  assistant_id?: string;
  /**
   * The ID of the run associated with the creation of this message. Value is null when messages
   * are created manually using the create message or create thread endpoints.
   */
  run_id?: string;
  /**
   * A list of file IDs that the assistant should use. Useful for tools like retrieval and
   * code_interpreter that can access files.
   *
   * @maxItems 10
   */
  file_ids?: string[];
  metadata?: Metadata;
} & ObjectMeta;

/**
 * A list of files attached to a message.
 */
export type MessageFileObject = {
  /**
   * The object type, which is always thread.message.file.
   *
   * @default thread.message.file
   */
  object: "thread.message.file";
  /**
   * The ID of the message that the File is attached to.
   */
  message_id: string;
} & ObjectMeta;

/**
 * Text output from the Code Interpreter tool call as part of a run step.
 */
export type CodeInterpreterLogOutput = {
  /**
   * Always logs.
   *
   * @default logs
   */
  type: "logs";

  /**
   * The text output from the Code Interpreter tool call.
   */
  logs: string;
};

/**
 * Image output from the Code Interpreter tool call as part of a run step.
 */
export type CodeInterpreterImageOutput = {
  /**
   * Always image.
   *
   * @default image
   */
  type: "image";

  /**
   * The text output from the Code Interpreter tool call.
   */
  image: {
    /**
     * The file ID of the image.
     */
    file_id: string;
  };
};

/**
 * The output of code interpreter tool
 */
export type CodeInterpreterOutput = CodeInterpreterImageOutput | CodeInterpreterLogOutput;

/**
 * Details of the Code Interpreter tool call the run step was involved in.
 */
export type CodeInterpreterToolCall = {
  /**
   * The ID of the tool call.
   */
  id: string;

  /**
   * The type of tool call. This is always going to be code_interpreter for this type of tool call.
   */
  type: "code_interpreter";

  /**
   * The Code Interpreter tool call definition.
   */
  code_interpreter: {
    /**
     * The input to the Code Interpreter tool call.
     */
    input: string;

    /**
     * The outputs from the Code Interpreter tool call. Code Interpreter can output one or more
     * items, including text (logs) or images (image). Each of these are represented by a different
     * object type.
     */
    outputs: CodeInterpreterOutput[];
  };
};

/**
 * Retrieval tool call
 */
export type RetrievalToolCall = {
  /**
   * The ID of the tool call object.
   */
  id: string;

  /**
   * The type of tool call. This is always going to be retrieval for this type of tool call.
   *
   * @default retrieval
   */
  type: "retrieval";

  /**
   * Detail of retrieval.
   */
  retrieval: {
    /**
     * The name of retrieval tool.
     */
    name: string;
    /**
     * The input to retrieval tool.
     */
    input: string;
    /**
     * The output from retrieval tool.
     */
    output?: string;
  };
};

/**
 * Function tool call
 */
export type FunctionToolCall = {
  /**
   * The ID of the tool call. This ID must be referenced when you submit the tool outputs in using
   * the Submit tool outputs to run endpoint.
   */
  id: string;

  /**
   * The type of tool call the output is required for. For now, this is always function.
   */
  type: "function";

  /**
   * The function definition.
   */
  function: {
    /**
     * The name of the function.
     */
    name: string;

    /**
     * The arguments that the model expects you to pass to the function.
     */
    arguments: string;
    /**
     * The output of the function. This will be null if the outputs have not been submitted yet.
     */
    output?: string;
  };
};

export type ToolCall = CodeInterpreterToolCall | RetrievalToolCall | FunctionToolCall;

/**
 * SubmitToolOutputs action.
 */
export type SubmitToolOutputsAction = {
  /**
   * For now, this is always submit_tool_outputs.
   */
  type: "submit_tool_outputs";
  /**
   * Details on the tool outputs needed for this run to continue.
   */
  submit_tool_outputs: {
    /**
     * A list of the relevant tool calls.
     */
    tool_calls: FunctionToolCall[];
  };
};

/**
 * Usage statistics related to the run or step.
 */
export type Usage = {
  /**
   * Number of completion tokens used over the course of the run or step.
   */
  completion_tokens: number;

  /**
   * Number of prompt tokens used over the course of the run or step.
   */
  prompt_tokens: number;

  /**
   * Total number of tokens used (prompt + completion).
   */
  total_tokens: number;
};

/**
 * Represents an execution run on a thread.
 */
export type RunObject = {
  /**
   * The object type, which is always thread.run.
   *
   * @default thread.run
   */
  object: "thread.run";
  /**
   * The ID of the thread that was executed on as a part of this run.
   */
  thread_id: string;

  /**
   * The ID of the assistant used for execution of this run.
   */
  assistant_id: string;

  /**
   * The status of the run, which can be either .
   */
  status:
    | "queued"
    | "in_progress"
    | "requires_action"
    | "cancelling"
    | "cancelled"
    | "failed"
    | "completed"
    | "expired";

  /**
   * Details on the action required to continue the run. Will be null if no action is required.
   */
  required_action?: SubmitToolOutputsAction;

  /**
   * The last error associated with this run. Will be null if there are no errors.
   */
  last_error?: {
    /**
     * One of server_error, rate_limit_exceeded, or invalid_prompt.
     */
    code: "server_error" | "rate_limit_exceeded" | "invalid_prompt";

    /**
     * A human-readable description of the error.
     */
    message: string;
  };

  /**
   * The Unix timestamp (in seconds) for when the run will expire.
   */
  expires_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run was started.
   */
  started_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run was cancelled.
   */
  cancelled_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run failed.
   */
  failed_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run was completed.
   */
  completed_at?: number;

  /**
   * The model that the assistant used for this run.
   */
  model?: string;

  /**
   * The instructions that the assistant used for this run.
   */
  instructions?: string;

  /**
   * The list of tools that the assistant used for this run.
   */
  tools?: Tool[];

  /**
   * The list of File IDs the assistant used for this run.
   */
  file_ids?: string[];

  metadata?: Metadata;

  /**
   * Usage statistics related to the run. This value will be null if the run is not in a terminal
   * state (i.e. in_progress, queued, etc.).
   */
  usage?: Usage;

  /**
   * The sampling temperature used for this run.
   *
   * @default 1
   * @maximum 1
   * @minimum 0
   */
  temperature?: number;
} & ObjectMeta;

/**
 * Message creation detail
 */
export type MessageCreationDetail = {
  /**
   * Always message_creation.
   */
  type: "message_creation";
  /**
   * Details of the message creation by the run step.
   */
  message_creation: {
    /**
     * The ID of the message that was created by this run step.
     */
    message_id: string;
  };
};

/**
 * Tool calls detail
 */
export type ToolCallsDetail = {
  /**
   * Always tool_calls.
   */
  type: "tool_calls";

  /**
   * An array of tool calls the run step was involved in. These can be associated with one of three
   * types of tools: code_interpreter, retrieval, or function.
   */
  tool_calls: ToolCall[];
};

export type StepObject = {
  /**
   * The object type, which is always thread.run.step.
   *
   * @default thread.run.step
   */
  object: "thread.run.step";
  /**
   * The ID of the assistant associated with the run step.
   */
  assistant_id: string;

  /**
   * The ID of the thread that was run.
   */
  thread_id: string;

  /**
   * The ID of the run that this run step is a part of.
   */
  run_id: string;

  /**
   * The type of run step, which can be either message_creation or tool_calls.
   */
  type: "message_creation" | "tool_calls";

  /**
   * The status of the run step, which can be either in_progress, cancelled, failed, completed, or
   * expired.
   */
  status: "in_progress" | "cancelled" | "failed" | "completed" | "expired";

  /**
   *  The details of the run step.
   */
  step_details: MessageCreationDetail | ToolCallsDetail;

  /**
   * The last error associated with this run step. Will be null if there are no errors.
   */
  last_error?: {
    /**
     * One of server_error or rate_limit_exceeded.
     */
    code: "server_error" | "rate_limit_exceeded";

    /**
     * A human-readable description of the error.
     */
    message: string;
  };
  /**
   * The Unix timestamp (in seconds) for when the run step expired. A step is considered expired if
   * the parent run is expired.
   */
  expired_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run step was cancelled.
   */
  cancelled_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run step failed.
   */
  failed_at?: number;

  /**
   * The Unix timestamp (in seconds) for when the run step completed.
   */
  completed_at?: number;

  metadata?: Metadata;

  /**
   * Usage statistics related to the run step. This value will be null while the run step's status
   * is in_progress.
   */
  usage?: Usage;
} & ObjectMeta;

/* ----------------------------------------------------------------------------- */
/* -------------------------------- Reuqests ----------------------------------- */
/* ----------------------------------------------------------------------------- */

/**
 * Create an assistant with a model and instructions.
 */
export type CreateAssistantRequest = Omit<AssistantObject, "id" | "object" | "created_at">;

/**
 * Create an assistant file by attaching a File to an assistant.
 */
export type CreateAssistantFileRequest = {
  /**
   * A File ID (with purpose="assistants") that the assistant should use. Useful for tools like
   * retrieval and code_interpreter that can access files.
   */
  file_id: string;
};

/**
 * Modifies an assistant.
 */
export type ModifyAssistantRequest = Partial<CreateAssistantRequest>;

export type CreateMessageRequest = {
  /**
   * The role of the entity that is creating the message.
   */
  role: "user" | "assistant";
  /**
   * The content of the message.
   */
  content: string;
  /**
   * A list of File IDs that the message should use. There can be a maximum of 10 files attached to
   * a message. Useful for tools like retrieval and code_interpreter that can access and use files.
   */
  file_ids?: string[];
};

/**
 * Create a thread.
 */
export type CreateThreadRequest = {
  /**
   * A list of messages to start the thread with.
   */
  messages?: CreateMessageRequest[];
  metadata?: Metadata;
};

/**
 * Modifies a thread.
 */
export type ModifyThreadRequest = {
  metadata?: Metadata;
};

/**
 * Modifies a message.
 */
export type ModifyMessageRequest = {
  metadata?: Metadata;
};

/**
 * Create a run
 */
export type CreateRunRequest = {
  /**
   * Appends additional instructions at the end of the instructions for the run. This is useful
   * for modifying the behavior on a per-run basis without overriding other instructions.
   */
  additional_instructions?: string;
  /**
   * If true, returns a stream of events that happen during the Run as server-sent events,
   * terminating when the Run enters a terminal state with a data: [DONE] message.
   *
   * @default false
   */
  stream?: boolean;
} & Pick<
  RunObject,
  "assistant_id" | "model" | "instructions" | "tools" | "metadata" | "temperature"
>;

/**
 * Create a thread and run it in one request.
 */
export type CreateThreadAndRunRequest = {
  thread?: CreateThreadRequest;
} & CreateRunRequest;

/**
 * Modifies a run.
 */
export type ModifyRunRequest = {
  metadata?: Metadata;
};

/**
 * Detial of tool output.
 */
export type ToolOutput = {
  /**
   * The ID of the tool call in the required_action object within the run object the output is
   * being submitted for.
   */
  tool_call_id: string;

  /**
   * The output of the tool call to be submitted to continue the run.
   */
  output?: string;
};

/**
 * Submit tool outputs to run.
 */
export type SubmitToolOutputsToRunRequest = {
  /**
   * A list of tools for which the outputs are being submitted.
   */
  tool_outputs: ToolOutput[];
  /**
   * If true, returns a stream of events that happen during the Run as server-sent events,
   * terminating when the Run enters a terminal state with a data: [DONE] message.
   *
   * @default false
   */
  stream?: boolean;
};

/* ------------------------------------------------------------------------------ */
/* -------------------------------- Responses ----------------------------------- */
/* ------------------------------------------------------------------------------ */

/**
 * Delete response
 */
export type DeleteResponse = {
  /**
   * The id of object deleted.
   */
  id: string;
  /**
   * This always be true.
   *
   * @default true
   */
  deleted: true;
};

/**
 * Delete an assistant.
 */
export type DeleteAssistantResponse = {
  /**
   * The object type, which is always assistant.deleted.
   *
   * @default assistant.deleted
   */
  object: "assistant.deleted";
} & DeleteResponse;

/**
 * Delete an assistant file.
 */
export type DeleteAssistantFileResponse = {
  /**
   * The object type, which is always assistant.file.deleted.
   *
   * @default assistant.file.deleted
   */
  object: "assistant.file.deleted";
} & DeleteResponse;

/**
 * Delete an thread.
 */
export type DeleteThreadResponse = {
  /**
   * The object type, which is always thread.deleted.
   *
   * @default thread.deleted
   */
  object: "thread.deleted";
} & DeleteResponse;

/* ------------------------------------------------------------------------------- */
/* -------------------------------- Parameters ----------------------------------- */
/* ------------------------------------------------------------------------------- */

/**
 * Pagination parameters
 */
export type Pagination = {
  /**
   * A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.
   *
   * @default 20
   * @maximum 100
   * @minimum 1
   */
  limit: number;
  /**
   * A cursor for use in pagination. after is an object ID that defines your place in the list.
   */
  after?: string;
  /**
   * A cursor for use in pagination. before is an object ID that defines your place in the list.
   */
  before?: string;
};

/**
 * Ordering parameters
 */
export type Ordering = {
  /**
   * Sort order by the created_at timestamp of the objects. asc for ascending order and desc for descending order.
   *
   * @default desc
   */
  order?: "asc" | "desc";
};

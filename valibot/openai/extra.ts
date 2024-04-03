import { MessageTextContent, ToolCall, Usage } from "./assistants.ts";
import * as v from "valibot";

/**
 * Unified assistant response for Open Assistant.
 */
export type AssistantResponse = v.Output<typeof AssistantResponse>;
export const AssistantResponse = v.object({
  content: v.optional(MessageTextContent),
  tool_calls: v.optional(v.array(ToolCall)),
  usage: Usage,
});

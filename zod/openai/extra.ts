import { MessageTextContent, ToolCall, Usage } from "./assistants.ts";
import { z } from "zod";

/**
 * Unified assistant response for Open Assistant.
 */
export type AssistantResponse = z.infer<typeof AssistantResponse>;
export const AssistantResponse = z.object({
  content: MessageTextContent.optional(),
  tool_calls: z.array(ToolCall).optional(),
  usage: Usage,
});

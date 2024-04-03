/**
 * Describes an OpenAI model offering that can be used with the API.
 */
export type ModelObject = {
  /**
   * The model identifier, which can be referenced in the API endpoints.
   */
  id: string;
  /**
   * The Unix timestamp (in seconds) when the model was created.
   */
  created?: number;
  /**
   * The object type, which is always "model".
   */
  object: "model";
  /**
   * The organization that owns the model.
   *
   * @default openai
   */
  owned_by: string;
};

export type DeleteModelResponse = {
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
  /**
   * The object type, which is always "model".
   *
   * @default model
   */
  object: "model";
};

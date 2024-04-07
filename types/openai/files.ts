/**
 * The File object represents a document that has been uploaded to OpenAI.
 */
export type FileObject = {
  /**
   * The file identifier, which can be referenced in the API endpoints.
   */
  id: string;

  /**
   * The size of the file, in bytes.
   */
  bytes: number;

  /**
   * The Unix timestamp (in seconds) for when the file was created.
   */
  created_at: number;

  /**
   * The name of file.
   */
  filename: string;

  /**
   * The object type, which is always file.
   *
   * @default file
   */
  object: "file";

  /**
   * The intended purpose of the file. Supported values are fine-tune, fine-tune-results,
   * assistants, and assistants_output.
   */
  purpose: "fine-tune" | "fine-tune-results" | "assistants" | "assistants_output";

  /**
   * The current status of the file, which can be either uploaded, processed, or error.
   *
   * @deprecated
   */
  status?: "uploaded" | "processed" | "error";
  /**
   * For details on why a fine-tuning training file failed validation, see the error field on
   * fine_tuning.job.
   *
   * @deprecated
   */
  status_details?: string;
};

/**
 * Upload a file that can be used across various endpoints.
 */
export type UploadFileRequest = {
  /**
   * The File object (not file name) to be uploaded.
   */
  file: {
    /**
     * The name of file.
     */
    name: string;
    /**
     * The size of individual files can be a maximum of 512 MB for Assistants.
     *
     * @maximum 512000000
     * @minimum 1
     */
    size: number;
    /**
     * The type of file.
     */
    type: string;
  };
  /**
   * The intended purpose of the uploaded file.
   */
  purpose: "fine-tune" | "assistants";
};

/**
 * The respinse of delete a file.
 */
export type DeleteFileResponse = {
  /**
   * The ID of file.
   */
  id: string;
  /**
   * The object of file.
   * @default file
   */
  object: "file";
  /**
   *
   * @default true
   */
  deleted: true;
};

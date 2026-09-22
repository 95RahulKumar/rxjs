/**
 * 'idle'    -> row hasn't started yet, no loader, no result icon
 * 'loading' -> spinner shown on the left
 * 'success' -> spinner hidden, green tick shown on the right
 * 'pending' -> spinner hidden, red cross shown on the right (not resolved / needs attention)
 */
export type StepStatus = 'idle' | 'loading' | 'success' | 'pending';

export interface StepItem {
  /** Unique key so callers can update a step by id */
  id: string;
  /** Main label shown next to the loader, e.g. "Uploading files" */
  label: string;
  status: StepStatus;
}

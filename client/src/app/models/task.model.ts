import { Metadata } from "./metada";


export const icons = ['🧑‍💻', '💬', '☕', '🏋️', '📚', '⏰'] as const;
export const status = ['inprogress', 'completed', 'wontdo', 'todo'] as const;
type Icon = (typeof icons)[number];
type Status = (typeof status)[number];

export interface ITask {
  name: string;
  description?: string;
  icon: Icon;
  status: Status;
}

export type Task = ITask & Metadata;



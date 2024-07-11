import { Metadata } from './metada';
import { ITask, Task } from './task.model';

export interface IBoard<T = ITask> {
  name: string;
  description?: string;
  tasks: T[];
}

export type Board = IBoard<Task> & Metadata;

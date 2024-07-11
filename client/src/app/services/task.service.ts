import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ITask, Task } from '../models/task.model';
import { JsonResponse } from '../models/metada';

type TaskResponse = JsonResponse<{ task: Task }>;

@Injectable({ providedIn: 'root' })
export class TaskService {
 private readonly http = inject(HttpClient);

  create(boardId: string, task: ITask) {
    return this.http.post<TaskResponse>(
      `http://127.0.0.1:3000/api/v1/tasks/${boardId}`,
      task
    );
  }
  update(id: string, task: ITask) {
    return this.http.patch<TaskResponse>(
      `http://127.0.0.1:3000/api/v1/tasks/${id}`,
      task
    );
  }
  delete(boardId: string, id: string) {
    return this.http.delete(
      `http://127.0.0.1:3000/api/v1/tasks/${boardId}/${id}`
    );
  }
}

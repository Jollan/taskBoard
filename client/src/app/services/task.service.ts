import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ITask, Task } from '../models/task.model';
import { JsonResponse } from '../models/metada';
import { environment } from '../../environments/environment';

type TaskResponse = JsonResponse<{ task: Task }>;

@Injectable({ providedIn: 'root' })
export class TaskService {
 private readonly http = inject(HttpClient);

  create(boardId: string, task: ITask) {
    return this.http.post<TaskResponse>(
      `${environment.api}/tasks/${boardId}`,
      task
    );
  }
  update(id: string, task: ITask) {
    return this.http.patch<TaskResponse>(
      `${environment.api}/tasks/${id}`,
      task
    );
  }
  delete(boardId: string, id: string) {
    return this.http.delete(
      `${environment.api}/tasks/${boardId}/${id}`
    );
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Board } from '../models/board.model';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class ActionService {
  readonly action = new Subject<Board | Task | string>();
}

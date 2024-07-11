import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { JsonResponse } from '../models/metada';
import { Board, IBoard } from '../models/board.model';
import { Observable, map, merge, scan, shareReplay } from 'rxjs';
import { ActionService } from './action.service';

type BoardResponse = JsonResponse<{
  board: Board;
}>;

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly http = inject(HttpClient);
  private readonly actionService = inject(ActionService);

  get$(id: string): Observable<Board> {
    return merge(
      this.get(id).pipe(
        map((response) => {
          const board = response.data.board;
          return board.tasks.reverse() && board;
        })
      ),
      this.actionService.action
    ).pipe(scan(accumulator), shareReplay(1));
  }

  get(id: string) {
    return this.http.get<BoardResponse>(
      `http://127.0.0.1:3000/api/v1/boards/${id}`
    );
  }

  create(board: IBoard) {
    return this.http.post<BoardResponse>(
      `http://127.0.0.1:3000/api/v1/boards`,
      board
    );
  }

  update(id: string, body: { name?: string; description?: string }) {
    return this.http.patch<BoardResponse>(
      `http://127.0.0.1:3000/api/v1/boards/${id}`,
      body
    );
  }
}

function accumulator(board: Board, value: any) {
  if (value.tasks?.reverse()) {
    return value as Board;
  }
  if (typeof value === 'string') {
    board.tasks = board.tasks.filter((task) => task._id !== value);
    return board;
  }
  const index = board.tasks.findIndex((task) => task._id === value._id);
  if (index !== -1) {
    board.tasks[index] = value;
    return board;
  } else {
    board.tasks.unshift(value);
    return board;
  }
}

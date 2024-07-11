import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { IBoard } from '../models/board.model';
import { CommonModule } from '@angular/common';
import { DimmerComponent } from '../utils/dimmer/dimmer.component';
import { ITask } from '../models/task.model';
import { BoardService } from '../services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from '../models/metada';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LetDirective } from '../utils/directives/custom.directive';
import { ActionService } from '../services/action.service';
import { LoaderComponent } from '../utils/loader/loader.component';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';
import { SnackbarComponent } from '../utils/snackbar/snackbar.component';

type PartialMetadata = Partial<Metadata>;

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    TaskEditComponent,
    DimmerComponent,
    FormsModule,
    LetDirective,
    LoaderComponent,
    SnackbarComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly boardService = inject(BoardService);
  private readonly actionService = inject(ActionService);

  readonly loaderService = inject(LoaderService);
  readonly alertService = inject(AlertService);

  board: IBoard<ITask & PartialMetadata> & PartialMetadata = {
    name: 'My Task Board',
    description: 'Tasks to keep organised',
    tasks: [
      {
        name: 'Task in Progress',
        status: 'inprogress',
        icon: '⏰',
        description: '',
      },
      {
        name: 'Task Completed',
        status: 'completed',
        icon: '🏋️',
        description: '',
      },
      { name: "Task Won't Do", status: 'wontdo', icon: '☕', description: '' },
      {
        name: 'Task To Do',
        description: `Work on a Challenge on devChallenges.io, learn TypeScript.`,
        status: 'todo',
        icon: '📚',
      },
    ],
  };

  private readonly errMsg = 'Something went wrong !';
  private taskIndex: number;
  private subscription = new Subscription();
  private boardCopy = { ...this.board };
  id: string | null;
  editMode = false;
  task: ITask | undefined;

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.boardService.get$(this.id).subscribe({
        next: (board) => {
          this.board = board;
          this.boardCopy = { ...board };
        },
        error: (error: any) => {
          this.alertService.message.set({
            content: error.error.message ?? this.errMsg,
            type: 'error',
          });
        },
      });
    }
  }

  onEditMode(taskIndex: number) {
    this.taskIndex = taskIndex;
    this.task = this.board.tasks[taskIndex] ?? null;
  }

  onFirstChange(task: ITask) {
    if (this.taskIndex !== -1) {
      this.board.tasks[this.taskIndex] = task;
    } else {
      this.board.tasks.push(task);
    }
    this.createBoard();
  }

  onBoardEdited(field: 'name' | 'description') {
    const value = this.board[field]?.trim();
    if (value && value !== this.boardCopy[field]) {
      if (this.id) {
        this.subscription.add(
          this.boardService.update(this.id, { [field]: value }).subscribe({
            next: (response) => {
              this.actionService.action.next(response.data.board);
            },
            error: (error: any) => {
              this.board[field] = this.boardCopy[field]!;
              this.alertService.message.set({
                content: error.error.message ?? this.errMsg,
                type: 'error',
              });
            },
            complete: () => {
              this.alertService.message.set({
                content: 'Updated !',
                type: 'success',
              });
            },
          })
        );
      } else this.createBoard();
    } else this.board[field] = this.boardCopy[field]!;
  }

  hideSnackbar() {
    return setTimeout(() => this.alertService.message.set(null), 3000);
  }

  private createBoard() {
    this.subscription.add(
      this.boardService.create(this.board).subscribe({
        next: (response) => {
          this.router.navigateByUrl(`/${response.data.board._id}`);
        },
        error: (error: any) => {
          this.alertService.message.set({
            content: error.error.message ?? this.errMsg,
            type: 'error',
          });
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

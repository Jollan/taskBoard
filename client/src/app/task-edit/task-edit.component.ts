import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { ITask, icons, status } from '../models/task.model';
import { LetDirective } from '../utils/directives/custom.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Metadata } from '../models/metada';
import { ActionService } from '../services/action.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { ModalComponent } from '../utils/modal/modal.component';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [LetDirective, CommonModule, FormsModule, ModalComponent],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnDestroy, OnChanges {
  readonly alertService = inject(AlertService);
  private readonly taskService = inject(TaskService);
  private readonly actionService = inject(ActionService);

  private readonly subscription = new Subscription();
  private readonly errMsg = 'Something went wrong !';

  readonly status = status;
  readonly icons = icons;
  readonly default = {
    name: '',
    description: '',
    icon: '🧑‍💻',
    status: 'wontdo',
  };

  @Output() readonly editMode = new EventEmitter<false>();
  @Output() readonly newTask = new EventEmitter<ITask>();
  @Input() task: (ITask & Partial<Metadata>) | undefined;
  @Input() boardId: string | null;
  @ViewChild('form') form: NgForm;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.form?.form.patchValue(this.task ?? this.default);
    }
  }

  onFormSubmitted() {
    const value: ITask = this.form.value;
    if (this.boardId) {
      if (!this.task) {
        this.subscription.add(
          this.taskService.create(this.boardId, value).subscribe({
            next: (response) => {
              this.actionService.action.next(response.data.task);
            },
            error: (error: any) => {
              this.alertService.message.set({
                content: error.error.message ?? this.errMsg,
                type: 'error',
              });
            },
            complete: () => {
              this.alertService.message.set({
                content: 'Added !',
                type: 'success',
              });
            },
          })
        );
      } else {
        this.subscription.add(
          this.taskService.update(this.task._id!, value).subscribe({
            next: (response) => {
              this.actionService.action.next(response.data.task);
            },
            error: (error: any) => {
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
      }
    } else this.newTask.emit(value);
    this.form.reset(this.task ?? this.default);
  }

  onDelete() {
    this.subscription.add(
      this.taskService.delete(this.boardId!, this.task?._id!).subscribe({
        error: (error: any) => {
          this.alertService.message.set({
            content: error.error.message ?? this.errMsg,
            type: 'error',
          });
        },
        complete: () => {
          this.actionService.action.next(this.task?._id!);
          this.alertService.message.set({
            content: 'Deleted !',
            type: 'success',
          });
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

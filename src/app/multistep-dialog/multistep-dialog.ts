import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { StepItem } from './step.model';

export interface MultiStepDialogData {
  title: string;
  subtitle?: string;
  /**
   * Emits the full, up-to-date steps array whenever any row's status changes.
   * The dialog just renders whatever this last emitted. For now this is fed
   * by a mocked setTimeout sequence (see example-usage.component.ts); later,
   * swap the source to your real socket stream without touching the dialog.
   */
  steps$: Observable<StepItem[]>;
}

@Component({
  selector: 'app-multi-step-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multistep-dialog.html',
  styleUrl: './multistep-dialog.scss',
})
export class MultiStepDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MultiStepDialogData) {}
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

export interface CoachDialogData {
  coachNumber: string | number;
  passengers: number;
  vacantSeats: number;
}

@Component({
  selector: 'app-coach-dialog',
  imports: [MatButtonModule, MatIconModule, MatDialogTitle, MatDialogContent],
  template: `
    <div class="dialog">
      <div class="dialog-header flex space-between">
        <p class="dialog-header-text">Coach {{ data.coachNumber }}</p>
        <button class="close-btn" aria-label="Close" (click)="dialog.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <!-- <mat-dialog-content> -->
      <div class="dialog-content">
        <p class="row">
          <span class="label">Total Passengers:</span
          ><span class="value">{{ data.passengers }}</span>
        </p>
        <p class="row">
          <span class="label">Vacant Seats:</span><span class="value">{{ data.vacantSeats }}</span>
        </p>
      </div>
    </div>
    <!-- </mat-dialog-content> -->
  `,
  styles: [
    `
      :host {
        font-family: 'Inter', sans-serif;
      }

      .dialog {
        padding: 12px;
      }
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
      }
      .dialog-header-text {
        margin: 0;
      }
      .close-btn {
        color: #ffffff !important;
        background-color: transparent;
        outline: none;
        border: none;
        position: absolute;
        right: 0;
        top: 10px;
        cursor: pointer;
      }

      h2[mat-dialog-title] {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin: 0;
      }
      .dialog-content {
        padding: 24px 0;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        font-family: 'Inter', sans-serif;
      }

      .label {
        font-weight: 400;
        opacity: 0.85;
      }

      .value {
        font-weight: 600;
      }
    `,
  ],
})
export class CoachDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CoachDialogData,
    public dialog: DialogRef<CoachDialogComponent>,
  ) {}
}

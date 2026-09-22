import { AfterViewInit, Component, ElementRef, OnInit, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  shareReplay,
  Subscriber,
  switchMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { RenderSvg } from './render-svg/render-svg';
import { MultiStepDialog, MultiStepDialogData } from './multistep-dialog/multistep-dialog';
import { StepItem, StepStatus } from './multistep-dialog/step.model';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RenderSvg, MultiStepDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  myInput = viewChild<ElementRef<HTMLInputElement>>('input');
  ngAfterViewInit(): void {
    // const inputObs$ = fromEvent(this.myInput()?.nativeElement!, 'input');
    // inputObs$
    //   .pipe(
    //     map((e: any) => e.target.value),
    //     filter((value: any) => value !== ''),
    //     debounceTime(1000),
    //     distinctUntilChanged(),
    //     switchMap((value: any) => {
    //       return ajax({
    //         url: `https://api.github.com/search/users?q=${encodeURIComponent(value)}`,
    //         method: 'GET',
    //         headers: {
    //           Accept: 'application/vnd.github+json',
    //         },
    //       });
    //     }),
    //   )
    //   .subscribe((input: any) => {
    //     console.log('input', input);
    //   });
  }

  ngOnInit(): void {
    //   console.log('myInput', this.myInput());
    //   const digitStreams$ = new Observable((subscriber) => {
    //     console.log('inside obs');
    //     subscriber.next('hello');
    //   }).pipe(shareReplay());
    //   digitStreams$.subscribe((res) => {
    //     console.log('res inside cons#1', res);
    //   });
    //   digitStreams$.subscribe((res) => {
    //     console.log('res inside cons#2', res);
    //   });
  }

  constructor(private readonly dialog: MatDialog) {}

  startProcess(): void {
    const initialSteps: StepItem[] = [
      { id: 'build', label: 'Building project', status: 'idle' },
      { id: 'tests', label: 'Running tests', status: 'idle' },
      { id: 'upload', label: 'Uploading assets', status: 'idle' },
      { id: 'deploy', label: 'Publishing', status: 'idle' },
    ];

    const steps$ = new BehaviorSubject<StepItem[]>(initialSteps);

    this.dialog.open<MultiStepDialog, MultiStepDialogData>(MultiStepDialog, {
      width: '420px',
      autoFocus: false,
      data: {
        title: 'Deploying your project',
        subtitle: 'This usually takes under a minute.',
        steps$: steps$.asObservable(),
      },
    });

    // --- MOCK ONLY: replace this whole block with your real socket later ---
    this.mockStatusUpdates(steps$, initialSteps);
  }

  /**
   * Fakes a backend pushing status updates over time using setTimeout.
   * Swap this out for `steps-socket.service.ts` (or any other real source)
   * once the backend is ready - the dialog doesn't care where steps$ comes
   * from, only that it emits the full steps array on each change.
   */
  private mockStatusUpdates(steps$: BehaviorSubject<StepItem[]>, steps: StepItem[]): void {
    const setStatus = (id: string, status: StepStatus) => {
      const next = steps.map((s) => (s.id === id ? { ...s, status } : s));
      steps = next;
      steps$.next(next);
    };

    let delay = 0;
    const plan: Array<[string, StepStatus]> = [
      ['build', 'loading'],
      ['build', 'success'],
      ['tests', 'loading'],
      ['tests', 'success'],
      ['upload', 'loading'],
      ['upload', 'pending'], // simulated failure
      ['deploy', 'loading'],
      ['deploy', 'success'],
    ];

    for (const [id, status] of plan) {
      delay += 900;
      setTimeout(() => setStatus(id, status), delay);
    }
  }
}

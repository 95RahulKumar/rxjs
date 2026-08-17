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
import { KpiDashboard } from './kpi-dashboard/kpi-dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KpiDashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  myInput = viewChild<ElementRef<HTMLInputElement>>('input');
  ngAfterViewInit(): void {
    const inputObs$ = fromEvent(this.myInput()?.nativeElement!, 'input');
    inputObs$
      .pipe(
        map((e: any) => e.target.value),
        filter((value: any) => value !== ''),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((value: any) => {
          return ajax({
            url: `https://api.github.com/search/users?q=${encodeURIComponent(value)}`,
            method: 'GET',
            headers: {
              Accept: 'application/vnd.github+json',
            },
          });
        }),
      )
      .subscribe((input: any) => {
        console.log('input', input);
      });
  }
  ngOnInit(): void {
    console.log('myInput', this.myInput());
    const digitStreams$ = new Observable((subscriber) => {
      console.log('inside obs');

      subscriber.next('hello');
    }).pipe(shareReplay());
    digitStreams$.subscribe((res) => {
      console.log('res inside cons#1', res);
    });
    digitStreams$.subscribe((res) => {
      console.log('res inside cons#2', res);
    });
  }
}

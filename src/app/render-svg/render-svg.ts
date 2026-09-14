import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material/dialog';
import { coachSVG, engineSVG, lampSVG, trackSvg } from './svgassets';
import { CoachDialogComponent } from '../coach-dialog/coach-dialog';

@Component({
  selector: 'app-render-svg',
  imports: [],
  templateUrl: './render-svg.html',
  styleUrl: './render-svg.scss',
})
export class RenderSvg implements AfterViewInit {
  @ViewChild('trainContainer')
  private svgRef!: ElementRef<SVGSVGElement>;
  private lastX = 0;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawSvg();
    }, 300);
  }

  drawSvg() {
    // Native element
    const svgEl = this.svgRef.nativeElement;

    // Bounding box dimensions
    const svgWidth = svgEl.getBoundingClientRect().width;
    const svgHeight = svgEl.getBoundingClientRect().height;

    // D3 selection
    const svg = d3.select(svgEl);

    svg.selectAll('.train').remove();
    const trainGroup = svg.append('g').attr('class', 'train');

    // Engine + coaches
    const engine = trainGroup
      .append('g')
      .attr('class', 'engine')
      .attr('style', 'cursor:pointer')
      .html(engineSVG);

    engine.on('click', () => {
      this.dialog.open(CoachDialogComponent, {
        data: { coachNumber: 'Engine', passengers: 2, vacantSeats: 0 },
      });
    });

    const engineWidth = 230;
    const coachWidth = 140;
    const numberOfCoaches = 10;
    const gap = 15;

    let currentOffset = engineWidth;
    for (let i = 0; i < numberOfCoaches; i++) {
      const coach = trainGroup
        .append('g')
        .attr('class', 'coach')
        .attr('transform', `translate(${currentOffset - 225},0)`)
        .attr('style', 'cursor:pointer')
        .html(coachSVG);

      coach.on('click', () => {
        this.dialog.open(CoachDialogComponent, {
          data: {
            coachNumber: i + 1,
            passengers: Math.floor(Math.random() * 80),
            vacantSeats: Math.floor(Math.random() * 20),
          },
        });
      });

      currentOffset += coachWidth + gap;
    }

    // 🚄 Total train width
    const trainWidth = engineWidth + numberOfCoaches * (coachWidth + gap);

    // Start: outside right edge
    const startX = svgWidth;
    // End: left margin 20% → covers 80%
    const endX = svgWidth * 0.01;

    // Initial placement
    trainGroup.attr('transform', `translate(${startX},0)`);

    // Animate
    trainGroup
      .transition()
      .duration(8000)
      .ease(d3.easeLinear)
      .attr('transform', `translate(${endX},0)`);
    trainGroup.call(
      d3.drag<SVGGElement, unknown>().on('drag', (event) => {
        this.lastX += event.dx;
        trainGroup.attr('transform', `translate(${this.lastX},0)`);
      }),
    );
    // Track + lamp
    svg.insert('g', ':first-child').html(lampSVG);
    svg.append('g').attr('transform', `translate(-300,0)`).html(trackSvg);
  }
}
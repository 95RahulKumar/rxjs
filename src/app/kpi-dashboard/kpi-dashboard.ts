import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as d3 from 'd3';

interface ProgressItem {
  label: string;
  value: number;
  color: string;
}

interface KpiCard {
  title: string;
  total: number;
  unit: string;
  items: ProgressItem[];
}

@Component({
  selector: 'app-kpi-dashboard',
  imports: [CommonModule],
  templateUrl: './kpi-dashboard.html',
  styleUrl: './kpi-dashboard.scss',
})
export class KpiDashboard implements AfterViewInit, OnDestroy {
  @ViewChild('dashboard', { static: true })
  dashboard!: ElementRef<HTMLDivElement>;

  private resizeObserver?: ResizeObserver;

  kpis: KpiCard[] = [
    {
      title: 'G',
      total: 2540,
      unit: 'D',
      items: [
        {
          label: 'X',
          value: 660,
          color: '#16c7b7',
        },
        {
          label: 'Y',
          value: 780,
          color: '#7770e8',
        },
        {
          label: 'Z',
          value: 1100,
          color: '#8da334',
        },
      ],
    },

    {
      title: 'R',
      total: 2540,
      unit: 'N',
      items: [
        {
          label: 'Loaded',
          value: 1651,
          color: '#16c7b7',
        },
        {
          label: 'Empty',
          value: 889,
          color: '#7770e8',
        },
      ],
    },

    {
      title: 'V',
      total: 2540,
      unit: 'A',
      items: [
        {
          label: 'C',
          value: 1180,
          color: '#16c7b7',
        },
        {
          label: 'A',
          value: 889,
          color: '#7770e8',
        },
        {
          label: 'B',
          value: 471,
          color: '#8da334',
        },
      ],
    },
  ];

  ngAfterViewInit(): void {
    this.createCharts();

    this.resizeObserver = new ResizeObserver(() => {
      this.createCharts();
    });

    this.resizeObserver.observe(this.dashboard.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private createCharts(): void {
    const container = this.dashboard.nativeElement;

    d3.select(container).selectAll('.kpi-progress-svg').remove();

    this.kpis.forEach((kpi, index) => {
      const element = container.querySelector(`#progress-${index}`) as HTMLElement;

      if (element) {
        this.createProgressBar(element, kpi.items);
      }
    });
  }

  private createProgressBar(element: HTMLElement, data: ProgressItem[]): void {
    const width = element.clientWidth || 300;
    const height = 10;

    const total = d3.sum(data, (d) => d.value);

    const svg = d3
      .select(element)
      .append('svg')
      .attr('class', 'kpi-progress-svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'none');

    /*
     * Background
     */
    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', '#333333');

    /*
     * Clip path so the complete progress bar
     * has rounded outer corners.
     */
    const clipId = `progress-clip-${Math.random().toString(36).substring(2, 10)}`;

    svg
      .append('defs')
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 5)
      .attr('ry', 5);

    const group = svg.append('g').attr('clip-path', `url(#${clipId})`);

    /*
     * Scale:
     *
     * value -> pixel width
     */
    const scale = d3.scaleLinear().domain([0, total]).range([0, width]);

    /*
     * Create stacked segments.
     */
    let currentX = 0;

    const segments = data.map((item) => {
      const segment = {
        ...item,
        x: currentX,
        width: scale(item.value),
      };

      currentX += segment.width;

      return segment;
    });

    /*
     * Draw segments.
     */
    group
      .selectAll<SVGRectElement, (typeof segments)[number]>('.segment')
      .data(segments)
      .join('rect')
      .attr('class', 'segment')
      .attr('x', (d) => d.x)
      .attr('y', 0)
      .attr('height', height)
      .attr('width', 0)
      .attr('fill', (d) => d.color)
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => d.width);

    /*
     * Tooltip.
     */
    const tooltip = d3
      .select('body')
      .selectAll<HTMLDivElement, unknown>('.d3-kpi-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'd3-kpi-tooltip')
      .style('position', 'fixed')
      .style('display', 'none')
      .style('pointer-events', 'none');

    group
      .selectAll<SVGRectElement, (typeof segments)[number]>('.segment')
      .on('mouseenter', function (event, d) {
        const percentage = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0';

        tooltip.style('display', 'block').html(`
            <div class="tooltip-title">
              ${d.label}
            </div>

            <div class="tooltip-value">
              ${d.value.toLocaleString()}
            </div>

            <div class="tooltip-percentage">
              ${percentage}%
            </div>
          `);

        d3.select(this).transition().duration(150).attr('opacity', 0.8);
      })
      .on('mousemove', function (event) {
        tooltip.style('left', `${event.clientX + 12}px`).style('top', `${event.clientY - 45}px`);
      })
      .on('mouseleave', function () {
        tooltip.style('display', 'none');

        d3.select(this).transition().duration(150).attr('opacity', 1);
      });
  }

  /*
   * Example of dynamically changing data.
   */
  updateMovementData(): void {
    this.kpis[0].items = [
      {
        label: 'Export',
        value: Math.floor(Math.random() * 1000),
        color: '#16c7b7',
      },
      {
        label: 'Import',
        value: Math.floor(Math.random() * 1000),
        color: '#7770e8',
      },
      {
        label: 'Other',
        value: Math.floor(Math.random() * 1000),
        color: '#8da334',
      },
    ];

    this.kpis[0].total = d3.sum(this.kpis[0].items, (d) => d.value);

    this.createCharts();
  }
}

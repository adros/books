import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { ReadingsService } from '../../services/readings.service';
import { shareReplay, map, filter, distinctUntilChanged, debounce, expand, delay, take, debounceTime, switchMap } from 'rxjs/operators';
import { Observable, ReplaySubject, interval, of, empty } from 'rxjs';
import { groupBy, sumBy, orderBy } from 'lodash-es';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotation from 'chartjs-plugin-annotation';

const defaultBarColor = 'rgba(23, 162, 184, 0.7)';
const currentYearBarColor = 'rgba(0, 118, 138, 0.7)';
const currentYear = new Date().getFullYear();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isLoading = true;
  public barChartLabels1$: Observable<Label[]>;
  public barChartLabels2$: Observable<Label[]>;

  public barChartData1$: Observable<ChartDataSets[]>;
  public barChartData2$: Observable<ChartDataSets[]>;

  public plugins = [pluginDataLabels, pluginAnnotation];
  public size$: Observable<number>;

  public isLeapYear = new Date(new Date().getFullYear(), 1, 29).getDate() === 29;
  public dayOfYear = dayOfYear();

  public chartOpts1: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: { anchor: 'end', color: 'white', offset: 0, align: 'left' },
    },
    scales: { xAxes: [{ ticks: { beginAtZero: true, suggestedMax: 50 } }] },
  }

  public chartOpts2: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: { anchor: 'end', color: 'white', offset: 0, align: 'left' },
    },
    scales: { xAxes: [{ ticks: { beginAtZero: true } }] },
  }

  @ViewChild('gauge1', { static: false }) gauge1: ElementRef;

  ngAfterViewInit() { }

  constructor(private readingService: ReadingsService) { }

  ngOnInit() {
    const data$ = this.readingService.getStats().pipe(shareReplay());

    const barChartData1All$ = data$.pipe(map((data) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [year, (readings as any).length]), '1').reverse();
    }));
    this.barChartLabels1$ = barChartData1All$.pipe(map((data) => data.map(([year, pages]) => year)));
    this.barChartData1$ = barChartData1All$.pipe(map(buildDataSets));

    const barChartData2All$ = data$.pipe(map((data) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [year, sumBy(readings, 'pages')]), '1').reverse();
    }));
    this.barChartLabels2$ = barChartData2All$.pipe(map((data) => data.map(([year, pages]) => year)));
    this.barChartData2$ = barChartData2All$.pipe(map(buildDataSets));

    data$.subscribe({ next: () => this.isLoading = false });

    this.size$ = interval(100).pipe(
      filter(() => !!this.gauge1),
      map(() => Math.floor(this.gauge1.nativeElement.getBoundingClientRect().width - 30)),
      distinctUntilChanged(),
      debounceTime(50),
      switchMap((val) => {
        const arr = [0, val];
        return interval(10).pipe(map(() => arr.shift()), take(2));
      })
    );

    this.size$.subscribe({ next: (val) => console.log('size', val) });

    function buildDataSets(data: any[]): ChartDataSets[] {
      return [{
        data: data.map(([year, pages]) => pages),
        backgroundColor: data.map(([year]) => year == currentYear ? currentYearBarColor : defaultBarColor),
        hoverBackgroundColor: data.map(([year]) => (year == currentYear ? currentYearBarColor : defaultBarColor).replace('0.7', '0.8')),
        hoverBorderColor: 'transparent'
      }];
    }
  }


}


function dayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now as any) - (start as any);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
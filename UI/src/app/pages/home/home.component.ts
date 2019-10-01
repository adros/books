import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReadingsService, IStats } from '../../services/readings.service';
import { shareReplay, map, filter, distinctUntilChanged, take, switchMap } from 'rxjs/operators';
import { Observable, interval, combineLatest, BehaviorSubject } from 'rxjs';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotation from 'chartjs-plugin-annotation';
import { maxBy, meanBy, findIndex } from 'lodash-es';

const DEFAULT_BAR_COLOR = 'rgba(23, 162, 184, 0.7)';
const CURRENT_YEAR_BAR_COLOR = 'rgba(0, 118, 138, 0.7)';
const PLANNED_PAGES_PER_DAY = 30;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isLoading = true;
  public booksByYearLabels$: Observable<Label[]>;
  public pagesByYearLabels$: Observable<Label[]>;

  public booksByYearData$: Observable<ChartDataSets[]>;
  public pagesByYearData$: Observable<ChartDataSets[]>;

  public booksByYearOpts: ChartOptions;
  public pagesByYearOpts: ChartOptions;

  public plugins = [pluginDataLabels, pluginAnnotation];

  public isStatsHistory$ = new BehaviorSubject(false);

  public gauges$: Observable<Array<{ name: string, label: string, opts: any; size: number }>>
  public readStats$: Observable<any>;
  public statsData$: Observable<IStats>;

  @ViewChild('gauge', { static: false })
  private gauge: ElementRef;


  constructor(public readingService: ReadingsService) {
    this.booksByYearOpts = this.getChartOptions(50);
    this.pagesByYearOpts = this.getChartOptions();
  }

  public ngOnInit() {
    const stats$ = this.statsData$ = this.isStatsHistory$.pipe(
      switchMap((isStatsHistory) => this.readingService.getStats().pipe(
        map<IStats, IStats>((stats) => {
          if (!isStatsHistory) {
            return stats;
          }
          return {
            ...stats,
            booksCurrentYear: stats.booksCurrentYear - 1,
            pagesCurrentYear: stats.pagesCurrentYear - stats.lastBookPages,
            booksByYear: stats.booksByYear.map(([year, val]) => [year, year == stats.currentYear ? val - 1 : val]),
            pagesByYear: stats.pagesByYear.map(([year, val]) => [year, year == stats.currentYear ? val - stats.lastBookPages : val])
          }
        }),
        shareReplay()
      ))
    );



    this.booksByYearLabels$ = stats$.pipe(map(({ booksByYear }) => booksByYear.map(([year], i) => `[${i + 1}.]   ${year}`)));
    this.booksByYearData$ = stats$.pipe(map(({ booksByYear, currentYear }) => this.buildChartDataSet(booksByYear, currentYear)));

    this.pagesByYearLabels$ = stats$.pipe(map(({ pagesByYear }) => pagesByYear.map(([year], i) => `[${i + 1}.]   ${year}`)));
    this.pagesByYearData$ = stats$.pipe(map(({ pagesByYear, currentYear }) => this.buildChartDataSet(pagesByYear, currentYear)));

    stats$.subscribe({ next: () => this.isLoading = false });

    this.initGauges(stats$);
    this.initReadStats(stats$);

  }

  public toggleStatsHistory() {
    this.isStatsHistory$.next(!this.isStatsHistory$.value);
  }

  private initGauges(stats$: Observable<IStats>) {
    const size$ = this.getGaugeSize();

    this.gauges$ = combineLatest(stats$, size$, ({ pagesCurrentYear, isLeapYear, dayOfYear }, size) => {

      const perDayToToday = pagesCurrentYear / dayOfYear;
      const perDayToTodayPerc = perDayToToday / 30;

      const perDayToEndOfYear = pagesCurrentYear / (isLeapYear ? 366 : 365);
      const perDayToEndOfYearPerc = perDayToEndOfYear / 30;

      const planToToday = dayOfYear * PLANNED_PAGES_PER_DAY;
      const planToTodayPerc = pagesCurrentYear / planToToday;

      const planToEndOfYear = (isLeapYear ? 366 : 365) * PLANNED_PAGES_PER_DAY;
      const planToEndOfYearPerc = pagesCurrentYear / planToEndOfYear;

      return [
        {
          name: 'Strán / deň (dnes)',
          label: decimal(perDayToToday),
          size,
          opts: {
            arcColors: perDayToTodayPerc == 0 ? ['lightgray'] : [DEFAULT_BAR_COLOR, 'lightgray'],
            arcDelimiters: perDayToTodayPerc >= 1 || perDayToTodayPerc == 0 ? [] : [perDayToTodayPerc * 100],
            arcLabels: [perc(perDayToTodayPerc)],
            arcLabelFontSize: 12,
            rangeLabel: ['0', '30']
          }
        },
        {
          name: 'Strán / deň (rok)',
          label: decimal(perDayToEndOfYear),
          size,
          opts: {
            arcColors: perDayToEndOfYearPerc == 0 ? ['lightgray'] : [DEFAULT_BAR_COLOR, 'lightgray'],
            arcDelimiters: perDayToEndOfYearPerc >= 1 || perDayToEndOfYearPerc == 0 ? [] : [perDayToEndOfYearPerc * 100],
            arcLabels: [perc(perDayToEndOfYearPerc)],
            arcLabelFontSize: 12,
            rangeLabel: ['0', '30']
          }
        },
        {
          name: 'Strán (dnes)',
          label: pagesCurrentYear.toLocaleString('sk'),
          size,
          opts: {
            arcColors: planToTodayPerc == 0 ? ['lightgray'] : [DEFAULT_BAR_COLOR, 'lightgray'],
            arcDelimiters: planToTodayPerc >= 1 || planToTodayPerc == 0 ? [] : [planToTodayPerc * 100],
            arcLabels: [perc(planToTodayPerc)],
            arcLabelFontSize: 12,
            rangeLabel: ['0', planToToday.toLocaleString('sk')]
          }
        },
        {
          name: 'Strán (rok)',
          label: pagesCurrentYear.toLocaleString('sk'),
          size,
          opts: {
            arcColors: planToEndOfYearPerc == 0 ? ['lightgray'] : [DEFAULT_BAR_COLOR, 'lightgray'],
            arcDelimiters: planToEndOfYearPerc >= 1 || planToEndOfYearPerc == 0 ? [] : [planToEndOfYearPerc * 100],
            arcLabels: [perc(planToEndOfYearPerc)],
            arcLabelFontSize: 12,
            rangeLabel: ['0', planToEndOfYear.toLocaleString('sk')]
          }
        }/*,
        {
          name: 'Deň v roku',
          label: `${dayOfYear}`,
          size,
          opts: {
            arcColors: [gaugeDefaultColor, 'lightgray'],
            arcLabels: [perc(dayOfYear / (isLeapYear ? 366 : 365))],
            arcLabelFontSize: 12,
            arcDelimiters: [Math.round(dayOfYear / (isLeapYear ? 366 : 365) * 100)],
            rangeLabel: ['1', isLeapYemaxByar ? '366' : '365']
          }
        }*/
      ];

      function perc(val) {
        return val.toLocaleString('sk', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
      }

      function decimal(val) {
        return val.toLocaleString('sk', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      }
    });
  }

  private initReadStats(stats$: Observable<IStats>) {
    this.readStats$ = stats$.pipe(map(({ pagesCurrentYear, booksCurrentYear, booksByYear, pagesByYear, currentYear, dayOfYear }) => {

      const booksByYearExceptThis = booksByYear.filter(([itemYear]) => currentYear != itemYear);
      const pagesByYearExceptThis = pagesByYear.filter(([itemYear]) => currentYear != itemYear);

      const avgPages = Math.round(meanBy(pagesByYearExceptThis, 1));
      const avgBooks = Math.round(meanBy(booksByYearExceptThis, 1));
      const maxPages = maxBy(pagesByYearExceptThis, 1)[1];
      const maxBooks = maxBy(booksByYearExceptThis, 1)[1];

      const planPagesDiff = pagesCurrentYear - PLANNED_PAGES_PER_DAY * dayOfYear
      const avgPagesDiff = pagesCurrentYear - avgPages;
      const avgBooksDiff = booksCurrentYear - avgBooks;
      const maxPagesDiff = pagesCurrentYear - maxPages;
      const maxBooksDiff = booksCurrentYear - maxBooks;
      const currentPagesOrder = findIndex(pagesByYear, ['0', currentYear]) + 1;
      const currentBooksOrder = findIndex(booksByYear, ['0', currentYear]) + 1;

      return {
        planPagesDiff,
        planDayDiff: Math.floor(planPagesDiff / PLANNED_PAGES_PER_DAY),
        avgPagesDiff, avgBooksDiff, maxPagesDiff, maxBooksDiff,
        currentPagesOrder, currentBooksOrder, pagesCurrentYear, booksCurrentYear,
        avgPages, avgBooks, maxPages, maxBooks
      };
    }));
  }

  private getGaugeSize(): Observable<number> {
    return interval(100).pipe(
      filter(() => !!this.gauge),
      map(() => Math.floor(this.gauge.nativeElement.getBoundingClientRect().width - 30)),
      distinctUntilChanged(),
      switchMap((val) => {
        const arr = [0, val];
        return interval(0).pipe(map(() => arr.shift()), take(2));
      })
    );
  }

  private buildChartDataSet(data: [number, number][], currentYear: number): ChartDataSets[] {
    return [{
      data: data.map(([year, value]) => value),
      backgroundColor: data.map(([year]) => year == currentYear ? CURRENT_YEAR_BAR_COLOR : DEFAULT_BAR_COLOR),
      hoverBackgroundColor: data.map(([year]) => (year == currentYear ? CURRENT_YEAR_BAR_COLOR : DEFAULT_BAR_COLOR).replace('0.7', '0.8')),
      hoverBorderColor: 'transparent'
    }];
  }

  private getChartOptions(suggestedMax?: number): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: { anchor: 'end', color: 'white', offset: 0, align: 'left' },
      },
      scales: { xAxes: [{ ticks: { beginAtZero: true, suggestedMax } }] },
    }
  }


}

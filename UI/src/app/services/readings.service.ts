import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { shareReplay, map, switchMapTo } from 'rxjs/operators';
import { groupBy, sumBy, orderBy, maxBy } from 'lodash-es';

export interface IStats {
  booksByYear: Array<[number, number]>;
  pagesByYear: Array<[number, number]>;
  booksCurrentYear: number;
  pagesCurrentYear: number;
  lastBookPages: number;
  currentYear: number;
  isLeapYear: boolean;
  dayOfYear: number;
};

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {

  // TODO: reset stats on new reading

  private stats$: Observable<any>;
  private loadStats$: Subject<any>;

  constructor(private http: HttpClient) { }

  public listReadings() {
    return this.http.get(`${environment.baseUrl}/svc/reading/list/`);
  }

  private getStatsData() {
    if (!this.stats$) {
      this.loadStats$ = new BehaviorSubject(true);
      this.stats$ = this.loadStats$.pipe(
        switchMapTo(this.http.get(`${environment.baseUrl}/svc/reading/stats/`)),
        shareReplay()
        // simulation of new year
        // map((data: any[]) => data.filter(({ year }) => year != 2019))
      );
    }
    return this.stats$;
  }

  public resetStats() {
    this.loadStats$.next(true);
  }

  public getStats(): Observable<IStats> {
    const statsData$ = this.getStatsData();
    const booksByYear$ = statsData$.pipe(map((data) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [+year, (readings as any).length]), '1').reverse();
    }));
    const pagesByYear$ = statsData$.pipe(map((data) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [+year, sumBy(readings, 'pages')]), '1').reverse();
    }));

    return combineLatest<IStats>(booksByYear$, pagesByYear$, statsData$, (booksByYear, pagesByYear, statsData) => {
      const currentYear = maxBy(booksByYear, 0)[0];
      const isLeapYear = new Date(currentYear, 1, 29).getDate() === 29;
      const dayOfYear = currentYear == new Date().getFullYear() ? getDayOfCurrentYear() : (isLeapYear ? 366 : 365);

      return {
        booksByYear,
        pagesByYear,
        booksCurrentYear: (booksByYear.find(([year]) => year == currentYear) || [0, 0])[1],
        pagesCurrentYear: (pagesByYear.find(([year]) => year == currentYear) || [0, 0])[1],
        pagesYearTarget: 30 * (isLeapYear ? 366 : 366),
        lastBookPages: statsData.slice(0).pop().pages,
        currentYear,
        isLeapYear,
        dayOfYear
      };
    });
  }
}

function getDayOfCurrentYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now as any) - (start as any);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
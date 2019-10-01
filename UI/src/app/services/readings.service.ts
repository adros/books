import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, combineLatest, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { shareReplay, map, publish, switchMapTo } from 'rxjs/operators';
import { groupBy, sumBy, orderBy } from 'lodash-es';

export interface IStats {
  booksByYear: Array<[number, number]>;
  pagesByYear: Array<[number, number]>;
  booksCurrentYear: number;
  pagesCurrentYear: number;
};

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {

  // TODO: reset stats on new reading

  private stats$: Observable<any>;
  private loadStats$: Subject<any>;
  public isLeapYear: boolean;
  public dayOfYear: number;
  public year: number;

  constructor(private http: HttpClient) {
    this.isLeapYear = new Date(new Date().getFullYear(), 1, 29).getDate() === 29;
    this.dayOfYear = dayOfYear();
    this.year = new Date().getFullYear();
  }

  public listReadings() {
    return this.http.get(`${environment.baseUrl}/svc/reading/list/`);
  }

  private getStatsData() {
    if (!this.stats$) {
      this.loadStats$ = new BehaviorSubject(true);
      this.stats$ = this.loadStats$.pipe(
        switchMapTo(this.http.get(`${environment.baseUrl}/svc/reading/stats/`)),
        shareReplay()
      );
    }
    return this.stats$;
  }

  public resetStats() {
    this.loadStats$.next(true);
  }

  public getStats(): Observable<IStats> {
    const booksByYear$ = this.getStatsData().pipe(map((data) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [+year, (readings as any).length]), '1').reverse();
    }));
    const pagesByYear$ = this.getStatsData().pipe(map((data) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [+year, sumBy(readings, 'pages')]), '1').reverse();
    }));

    return combineLatest<IStats>(booksByYear$, pagesByYear$, (booksByYear, pagesByYear) => ({
      booksByYear,
      pagesByYear,
      booksCurrentYear: (booksByYear.find(([year]) => year == this.year) || [0, 0])[1],
      pagesCurrentYear: (pagesByYear.find(([year]) => year == this.year) || [0, 0])[1],
      pagesYearTarget: 30 * (this.isLeapYear ? 366 : 366)
    }));
  }
}

function dayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now as any) - (start as any);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
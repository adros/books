import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReadingsService } from '../../services/readings.service';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { groupBy, sumBy, orderBy } from 'lodash-es';

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

  constructor(private readingService: ReadingsService) { }

  ngOnInit() {
    const data$ = this.readingService.getStats().pipe(shareReplay());

    const barChartData1All$ = data$.pipe(map((data: any[]) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [year, sumBy(readings, 'pages')]), '1').reverse();
    }));
    this.barChartLabels1$ = barChartData1All$.pipe(map((data: any[]) => data.map(([year, pages]) => year)));
    this.barChartData1$ = barChartData1All$.pipe(map((data: any[]) => data.map(([year, pages]) => pages)));

    const barChartData2All$ = data$.pipe(map((data: any[]) => {
      return orderBy(Object.entries(groupBy(data, 'year')).map(([year, readings]) => [year, (readings as any).length]), '1').reverse();
    }));
    this.barChartLabels2$ = barChartData2All$.pipe(map((data: any[]) => data.map(([year, pages]) => year)));
    this.barChartData2$ = barChartData2All$.pipe(map((data: any[]) => data.map(([year, pages]) => pages)));

    data$.subscribe({ next: () => this.isLoading = false });
  }


}

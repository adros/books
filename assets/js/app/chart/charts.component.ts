import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandler } from '../_common/error-handler';

import { HeroService } from '../hero.service';

@Component({
  moduleId: module.id,
  templateUrl: 'charts.component.html',
  styleUrls: ['charts.component.css'],
  selector: 'charts'
})
export class ChartsComponent {

  data: any[] = [];

  constructor(private router: Router, private heroService: HeroService, private errorHandler: ErrorHandler) {
    this.options = {
      chart: {
        type: 'bar'
      },
      title: { text: 'simple chart' },
      xAxis: {
        type: 'category',
        labels: {
          //rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      series: [{
        data: [],
      }]
    };
  }

  options: HighchartsOptions;
  chart: HighchartsChartObject;

  saveInstance(chartInstance) {
    var isFirstLoad = !this.chart;
    this.chart = chartInstance;
    if (isFirstLoad) {
      this.loadData("authorsBooksCount");
    }
  }

  sort = "value"
  desc = true

  loadData(type): void {
    this.chart.showLoading();

    this.heroService.getChartData(type)
      .then(data => {
        this.options = {
          series: [{
            name: 'Books count',
            data: this.sortFn(data.map(d => [d.name, d.value]))
          }]
        };
        this.chart.hideLoading();
      })
      .catch(err => this.errorHandler.displayDialog(err));
  }

  sortData() {
    this.options.series[0].data = this.sortFn(this.options.series[0].data);
    this.options = Object.assign({}, this.options);
  }

  sortFn(data) {
    var p = this.sort == "value" ? 1 : 0;
    return data.slice(0).sort((a, b) => {
      a = a[p];
      b = b[p];
      if (typeof a == "string") {
        return a.localeCompare(b) * (this.desc ? -1 : 1);
      }
      return this.desc ? b - a : a - b;
    });
  }

}

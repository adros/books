import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandler } from '../_common/error-handler';

import { HeroService } from '../hero.service';

@Component({
  moduleId: module.id,
  templateUrl: 'charts.component.html',
  styleUrls: ['charts.component.css'],
  selector: 'charts'
})
export class ChartsComponent implements OnInit {

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
      this.loadData();
    }
  }

  loadData(): void {
    this.chart.showLoading();

    this.heroService.authorsBooksCount()
      .then(data => {
        this.options = {
          series: [{
            name: 'Books count',
            data: data.map(d => [d.name, d.value])
          }]
        };
        this.chart.hideLoading();
      })
      .catch(err => this.errorHandler.displayDialog(err));
  }

  ngOnInit(): void {
    return;
  }
}

import { Component } from '@angular/core';
import { Reading } from './reading';
import { ReadingService } from '../service/reading.service';
import { ErrorHandler } from '../_common/error-handler';
import { OnInit } from '@angular/core';
import * as _ from 'lodash';

interface Group {
  groupLabel: String,
  readings: Reading[]
}

@Component({
  moduleId: module.id,
  selector: 'reading-list',
  templateUrl: 'reading-list.component.html',
  styleUrls: ['reading-list.component.css']
})
export class ReadingListComponent implements OnInit {
  readings: Reading[];
  selectedReading: Reading;

  data: Group[]

  desc = true
  group = true

  constructor(private readingService: ReadingService, private errorHandler: ErrorHandler) { }

  onSelect(reading: Reading): void {
    this.selectedReading = (reading == this.selectedReading ? null : reading);
  }

  ngOnInit(): void {
    this.readingService.list()
      .then(readings => {
        this.readings = readings;
        this.data = this.organizeData(readings)
      });
  }

  sortData(): void {
    this.data = this.organizeData(this.readings);
  }

  organizeData(readings: Reading[]): Group[] {
    if (!this.group) {
      return [{
        groupLabel: "All years",
        readings: readings.slice(0).sort((a, b) => this.desc ? b.totalOrder - a.totalOrder : a.totalOrder - b.totalOrder)
      }];
    }

    let res = readings.reduce((_res, r: Reading) => {
      if (!_res[r.year]) {
        _res[r.year] = [];
      }
      _res[r.year].push(r); //items are already orderes in readings correctly
      return _res;
    }, {});

    res = _.reduce(res, (_res: any[], readings, year) => {
      _res.push({
        groupLabel: year,
        readings: readings
      });
      return _res;
    });
    return res.sort((a, b) => this.desc ? b.groupLabel - a.groupLabel : a.groupLabel - b.groupLabel);
  }

}

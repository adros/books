import { Component, OnInit } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReadingsService } from '../../services/readings.service';

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.css']
})
export class ReadingsComponent implements OnInit {

  public data$: Observable<any>;

  constructor(private readingsService: ReadingsService) { }

  ngOnInit() {
    this.data$ = this.readingsService.listReadings().pipe(shareReplay());
  }

}

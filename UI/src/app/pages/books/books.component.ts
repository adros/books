import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { map, shareReplay, startWith, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit {

  public data: Observable<any>;
  public displayedData: Observable<any>;
  public isLoading = true;

  public sort = 'title_desc';

  @ViewChild('form', { static: true })
  public form: NgForm;

  constructor(private booksService: BooksService) { }

  ngOnInit() {
    this.data = this.booksService.listBooks().pipe(shareReplay());
    this.data.subscribe({
      next: () => this.isLoading = false
    });

    const sort$ = this.form.form.valueChanges.pipe(
      map(({ sort }) => sort),
      filter(Boolean),
      startWith(this.sort)
    );


    this.displayedData = combineLatest(this.data, sort$, (data, sort: string) => {
      let sortFn;
      switch (sort) {
        case 'order_asc':
        case 'order_desc':
          sortFn = (a, b) => a.order - b.order;
          break;
        case 'title_asc':
        case 'title_desc':
          sortFn = (a, b) => a.title.localeCompare(b.title);
          break;
        case 'firstReading_asc':
        case 'firstReading_desc':
          sortFn = (a, b) => {
            const orderA = a.readings && a.readings.length && a.readings[0].totalOrder || 0;
            const orderB = b.readings && b.readings.length && b.readings[0].totalOrder || 0;
            return orderA - orderB;
          };
          break;
        case 'lastReading_asc':
        case 'lastReading_desc':
          sortFn = (a, b) => {
            const orderA = a.readings && a.readings.length && a.readings[a.readings.length - 1].totalOrder || 0;
            const orderB = b.readings && b.readings.length && b.readings[b.readings.length - 1].totalOrder || 0;
            return orderA - orderB;
          };
          break;
      }
      let displayedData = data.slice(0);
      displayedData.sort(/_asc$/.test(sort) ? sortFn : (a, b) => sortFn(b, a));
      if (/^lastReading/.test(sort)) {
        displayedData = displayedData.map(({ readings, ...obj }) => ({ ...obj, readings: readings.slice(0).reverse() }));
      }
      return displayedData;
    });
  }

  ngAfterViewInit() { }


}

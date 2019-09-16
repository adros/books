import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Config, Columns, DefaultConfig, Event, API, APIDefinition } from 'ngx-easy-table';
import { BooksService } from '../../services/books.service';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit {

  // TODO: readings does not have correct order

  public configuration: Config;
  public columns: Columns[];
  public data: Observable<any>;

  @ViewChild('table', { static: false }) table: APIDefinition;

  constructor(private booksService: BooksService) { }

  ngOnInit() {
    this.configuration = { ...DefaultConfig, rows: 5000, isLoading: true };

    this.columns = [
      { key: 'title', title: 'Názov' },
      { key: 'original', title: 'Pôvodný názov' },
      { key: 'published', title: 'Rok vydania' },
      { key: 'pages', title: 'Počet strán' },
      { key: 'authors', title: 'Autor', orderEventOnly: true },
      { key: 'series', title: 'Séria', orderEventOnly: true },
      { key: 'readings', title: 'Čítanie', orderEventOnly: true },
      { key: 'pictureUrl', title: 'Obrazok' }
    ];

    this.data = this.booksService.listBooks().pipe(shareReplay());
    this.data.subscribe({
      next: () => this.configuration = { ...this.configuration, isLoading: false }
    });

  }

  ngAfterViewInit() {
    this.table.apiEvent({
      type: API.setPaginationRange,
      value: [10, 20, 50, 100, 500, 1000, 5000],
    });
  }

  sortByAuthor(a, b, asc: boolean) {
    const nameA = a.authors && a.authors[0] && a.authors[0].lastName || '';
    const nameB = b.authors && b.authors[0] && b.authors[0].lastName || '';
    return asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }

  sortBySerie(a, b, asc: boolean) {
    const titleA = a.series && a.series[0] && a.series[0].title || '';
    const titleB = b.series && b.series[0] && b.series[0].title || '';
    return asc ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
  }

  sortByReading(a, b, asc: boolean) {
    const orderA = a.readings && a.readings[0] && a.readings[0].totalOrder || 0;
    const orderB = b.readings && b.readings[0] && b.readings[0].totalOrder || 0;
    return asc ? orderA - orderB : orderB - orderA;
  }

  eventEmitted($event) {
    if ($event.event !== Event.onOrder) { return; }

    const asc = $event.value.order === 'asc';
    let sortFn;
    switch ($event.value.key) {
      case 'authors':
        sortFn = (a, b) => this.sortByAuthor(a, b, asc);
        break;
      case 'series':
        sortFn = (a, b) => this.sortBySerie(a, b, asc);
        break;
      case 'readings':
        sortFn = (a, b) => this.sortByReading(a, b, asc);
        break;
    }
    if (sortFn) {
      this.data = this.data.pipe(map((data: any[]) => [...data.sort(sortFn)]));
    }
  }

}

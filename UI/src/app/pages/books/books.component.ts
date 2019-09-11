import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Config, Columns, DefaultConfig, Event, API, APIDefinition } from 'ngx-easy-table';
import { BooksService } from '../books.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit {

  public configuration: Config;
  public columns: Columns[];
  public data;

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
      { key: 'series', title: 'Séria' },
      { key: 'pictureUrl', title: 'Obrazok' }
    ];

    this.data = this.booksService.listBooks('limit=10000');
    this.data.subscribe(() => this.configuration = { ...this.configuration, isLoading: false });


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

  eventEmitted($event) {
    if ($event.event === Event.onOrder && $event.value.key === 'authors') {
      const asc = $event.value.order === 'asc';
      this.data = this.data.pipe(map((data: any[]) => [...data.sort((a, b) => this.sortByAuthor(a, b, asc))]));
    }
  }

}

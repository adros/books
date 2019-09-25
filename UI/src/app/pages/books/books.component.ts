import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  public data$: Observable<any>;

  constructor(public booksService: BooksService) { }

  ngOnInit() {
    this.data$ = this.booksService.listBooks().pipe(shareReplay());
  }
}

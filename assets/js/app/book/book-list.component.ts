import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from './book';
import { BookService } from '../service/book.service';
import { ErrorHandler } from '../_common/error-handler';
import { OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  moduleId: module.id,
  selector: 'book-list',
  templateUrl: 'book-list.component.html',
  styleUrls: ['book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[];

  constructor(private router: Router, private bookService: BookService, private errorHandler: ErrorHandler) { }

  ngOnInit(): void {
    this.bookService.list("limit=20")
      .then(books => {
        this.books = books;
      });
  }

  goToDetail(reading): void {
    let link = ['/readings', reading.id];
    this.router.navigate(link);
  }
}

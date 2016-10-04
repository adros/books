import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Book } from './book';
import { BookService } from '../service/book.service';

@Component({
  moduleId: module.id,
  selector: 'book-detail',
  templateUrl: 'book-detail.component.html',
  styleUrls: ['book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.bookService.get(id)
        .then(book => this.book = book);
    });
  }

  /*save(): void {
    this.heroService.update(this.hero)
      .then(() => this.goBack());
  }*/
}

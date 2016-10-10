import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
export class BookListComponent {
  books: Book[];

  constructor(private router: Router, private bookService: BookService, private errorHandler: ErrorHandler) { }

  items = [];
  itemCount = 0;

  @ViewChild('dataTableParent')
  set dataTable(dataTableParent: ElementRef) {
    if (!dataTableParent) { return; }
    dataTableParent.nativeElement.querySelector(".table-bordered").classList.remove('table-bordered');
  }


  reloadItems(params) {
    if (!params.sortBy) {
      Object.assign(params, { sortBy: "id", sortAsc: true });
    }
    var query = `limit=${params.limit}&skip=${params.offset}&sort=${params.sortBy} ${params.sortAsc ? 'ASC' : 'DESC'}`;
    this.bookService.listPaged(query)
      .then(result => {
        this.items = result.data;
        this.itemCount = result.total;
      })
      .catch(err => this.errorHandler.displayDialog(err))
  }

}

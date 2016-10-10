import { Injectable } from '@angular/core';
import { RestService } from './_rest-service';
import { Http } from '@angular/http';

import { Book } from '../book/book';

@Injectable()
export class BookService extends RestService<Book> {
  protected url = '/svc/books';

  constructor(http: Http) {
    super(http);
  }
}

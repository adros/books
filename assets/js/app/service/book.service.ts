import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Book } from '../book/Book';

@Injectable()
export class BookService {

  private url = '/svc/books';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  list(): Promise<Book[]> {
    return this.http.get(`${this.url}`)
      .toPromise()
      .then(response => response.json() as Book[])
      .catch(this.handleError);
  }

  get(id: number): Promise<Book> {
    const url = `${this.url}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //TODO extract to parent
  private handleError(error: any): Promise<any> {
    try {
      Object.assign(error, JSON.parse(error._body));
    } catch (e) { }
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error);
  }
}

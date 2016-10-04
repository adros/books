import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Reading } from '../reading/Reading';

@Injectable()
export class ReadingService {

  private url = '/svc/readings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  list(): Promise<Reading[]> {
    return this.http.get(`${this.url}?sort=totalOrder`)
      .toPromise()
      .then(response => response.json() as Reading[])
      .catch(this.handleError);
  }

  get(id: number): Promise<Reading> {
    const url = `${this.url}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    try {
      Object.assign(error, JSON.parse(error._body));
    } catch (e) { }
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error);
  }
}

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { ServiceBase } from './_service-base';


export abstract class RestService<T> extends ServiceBase {

  protected url: String  // URL to web api

  constructor(http: Http) {
    super(http);
  }

  list(query?: String): Promise<T[]> {
    return this.http.get(`${this.url}?${query || ""}`)
      .toPromise()
      .then(response => response.json() as T[])
      .catch(this.handleError);
  }

  listPaged(query?: String): Promise<{ data: T[], total: number }> {
    return this.http.get(`${this.url}?${query || ""}`)
      .toPromise()
      .then(response => ({
        data: response.json() as T[],
        total: +response.headers.get("x-total")
      }))
      .catch(this.handleError);
  }

  get(id: number): Promise<T> {
    const url = `${this.url}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }
}

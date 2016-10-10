import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';


export abstract class ServiceBase {

  protected headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(protected http: Http) { }

  protected handleError(error: any): Promise<any> {
    try {
      Object.assign(error, JSON.parse(error._body));
    } catch (e) { }
    if (!error.message) {
      error.message = error.toString();
    }
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error);
  }
}

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class ChartService {

  private heroesUrl = '/svc/readings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getChartData(type: String): Promise<any> {
    return this.http.get(`/svc/charts/${type}`)
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

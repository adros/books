import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Hero } from './hero';

@Injectable()
export class HeroService {

  private heroesUrl = '/serie';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getHeroes(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
      .toPromise()
      .then(response => response.json() as Hero[])
      .catch(this.handleError);
  }

  getHero(id: number): Promise<Hero> {
    const url = `${this.heroesUrl}/${id}` ;
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(hero: Hero): Promise<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  create(name: string): Promise<Hero> {
    return this.http
      .post(this.heroesUrl, JSON.stringify({ name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  search(query: Object): Observable<Hero[]> {
    return this.http
      .get(`${this.heroesUrl}/?where=${JSON.stringify(query)}`)
      .map((r: Response) => r.json() as Hero[]);
  }

  getSeries(): Promise<any> {
    return this.http.get(`/serie`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getChartData(type:String): Promise<any> {
    return this.http.get(`/chart/${type}`)
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

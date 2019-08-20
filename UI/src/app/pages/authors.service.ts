import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  constructor(private http: HttpClient) { }

  public listAuthors(query?) {
    return this.http.get(`/svc/author/${query ? `?${query}` : ''}`).pipe(map((r) => { debugger; return r; }));
  }
}

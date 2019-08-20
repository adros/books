import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  constructor(private http: HttpClient) { }

  public listAuthors(query?) {
    return this.http.get(`/svc/author/${query ? `?${query}` : ''}`);
  }
}

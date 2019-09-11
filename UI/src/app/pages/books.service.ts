import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  public listBooks(query?) {
    return this.http.get(`${environment.baseUrl}/svc/book/${query ? `?${query}` : ''}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  public getBook(id): Observable<any> {
    return this.http.get(`${environment.baseUrl}/svc/book/${id}`);
  }

  public listBooks(query?) {
    return this.http.get(`${environment.baseUrl}/svc/book/list/${query ? `?${query}` : ''}`);
  }

  public getImgUrl(id) {
    return `${environment.baseUrl}/svc/book/image/${id}`;
  }

}

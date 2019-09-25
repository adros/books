import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  constructor(private http: HttpClient) { }

  public getAuthor(id): Observable<any> {
    return this.http.get(`${environment.baseUrl}/svc/author/${id}?populate=false`);
  }
  public getAuthorBooks(id): Observable<any> {
    return this.http.get(`${environment.baseUrl}/svc/author/${id}/books/`);
  }

  public listAuthors(query?) {
    return this.http.get(`${environment.baseUrl}/svc/author/${query ? `?${query}` : ''}`);
  }


}

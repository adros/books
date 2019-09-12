import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  constructor(private http: HttpClient) { }

  public listAuthors(query?) {
    return this.http.get(`${environment.baseUrl}/svc/author/${query ? `?${query}` : ''}`);
  }
}

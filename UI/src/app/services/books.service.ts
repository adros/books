import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  public listBooks(query?) {
    return this.http.get(`${environment.baseUrl}/svc/book/list/${query ? `?${query}` : ''}`);
  }

  public listBooksPaged(pageSize: number, query?: string): Observable<any> {
    const result = new BehaviorSubject([]);
    this.loadPagesRecursive(result, pageSize, query);
    return result;
  }

  private getPage(skip: number, limit: number, query?: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/svc/book/?skip=${skip}&limit=${limit}${query ? `&${query}` : ''}`);
  }

  private loadPagesRecursive(result: BehaviorSubject<any>, pageSize: number, query?: string) {
    const skip = result.value.length;
    this.getPage(skip, pageSize, query).subscribe({
      next: (data) => {
        result.next(result.value.concat(data));
        if (data.length) {
          this.loadPagesRecursive(result, pageSize, query);
        } else {
          result.complete();
        }
      },
      error: (err) => result.error(err)
    });
  }
}

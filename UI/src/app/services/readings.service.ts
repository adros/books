import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {

  constructor(private http: HttpClient) { }

  public listReadings() {
    return this.http.get(`${environment.baseUrl}/svc/reading/list/`);
  }

  public getStats() {
    return this.http.get(`${environment.baseUrl}/svc/reading/stats/`);
  }

}

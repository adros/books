import { Injectable } from '@angular/core';
import { RestService } from './_rest-service';
import { Reading } from '../reading/reading';
import { Http } from '@angular/http';

@Injectable()
export class ReadingService extends RestService<Reading> {
  protected url = '/svc/readings';

  constructor(http: Http) {
    super(http);
  }
}

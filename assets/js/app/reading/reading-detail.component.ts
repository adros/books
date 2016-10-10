import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Reading } from './reading';
import { ReadingService } from '../service/reading.service';

@Component({
  moduleId: module.id,
  selector: 'reading-detail',
  templateUrl: 'reading-detail.component.html',
  styleUrls: ['reading-detail.component.css']
})
export class ReadingDetailComponent implements OnInit {
  reading: Reading
  readingJson: String

  constructor(
    private readingService: ReadingService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  public booksUrl: string = "/svc/books?limit=10&sort=name&where=" + JSON.stringify({ name: { contains: ":keyword" } });
  public countriesUrl: string = "/svc/countries?limit=20&name=:keyword";

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.readingService.get(id)
        .then(reading => this.reading = reading);
    });
  }

  public listFormatter(data: any): string {
    return `<span>${data.name}</span>`;
  }

  public countryFormatter(data: any): string {
    return `<img src="images/flags/${data.file}"><span>${data.name}</span>`;
  }

  /*save(): void {
    this.heroService.update(this.hero)
      .then(() => this.goBack());
  }*/
}

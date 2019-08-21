import { Component, OnInit } from '@angular/core';
import { Config, Columns, DefaultConfig } from 'ngx-easy-table';
import { AuthorsService } from '../authors.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  public configuration: Config;
  public columns: Columns[];
  public data;

  constructor(private authorsService: AuthorsService) { }

  ngOnInit() {
    this.configuration = DefaultConfig;

    this.columns = [
      { key: 'lastName', title: 'Meno' },
      { key: 'nationality', title: 'Národnosť' },
      { key: 'dateOfBirth', title: 'Dátum narodenia' },
      { key: 'pictureUrl', title: 'pictureUrl' }
    ];

    this.data = this.authorsService.listAuthors('limit=10000');
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthorsService } from '../../services/authors.service';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  public data$: Observable<any>;

  constructor(private authorsService: AuthorsService) { }

  ngOnInit() {
    this.data$ = this.authorsService.listAuthors('limit=5000').pipe(shareReplay());
  }

}

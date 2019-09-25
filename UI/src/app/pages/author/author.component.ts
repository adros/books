import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthorsService } from '../../services/authors.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit, AfterViewInit {

  public author$: Observable<any>;
  public books$: Observable<any>;


  constructor(private authorsService: AuthorsService, private route: ActivatedRoute, private router: Router, ) { }

  ngOnInit() {
    this.author$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.authorsService.getAuthor(params.get('id')))
    );

    this.books$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.authorsService.getAuthorBooks(params.get('id'))),
      shareReplay()
    );
  }

  ngAfterViewInit() {
  }

}

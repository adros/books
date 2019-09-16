import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, AfterViewInit {

  public book$: Observable<any>;


  constructor(private booksService: BooksService, private route: ActivatedRoute, private router: Router, ) { }

  ngOnInit() {
    this.book$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.booksService.getBook(params.get('id')))
    );
  }

  ngAfterViewInit() {
  }

}

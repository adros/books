import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { map, startWith, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BooksService } from '../../services/books.service';

// tslint:disable:no-unused-expression
// todo tslint conf

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit, AfterViewInit {

  public displayedData$: Observable<any>;
  public isLoading: boolean;
  public collapsed = {};

  @Input()
  public sortYear = 'group_asc';

  @Input()
  public sort = 'order_asc';

  @Input()
  public layout: any = 'table';

  @Input()
  public grupped = true;

  @Input()
  public storageKey: string;

  @Input()
  public data$: Observable<any>;

  @ViewChild('form', { static: true })
  public form: NgForm;

  constructor(private sanitizer: DomSanitizer, private booksService: BooksService) { }

  ngOnInit() {
    if (this.storageKey) {
      this.form.form.valueChanges
        .subscribe({
          next: ({ layout, sort, sortYear, grupped }) => {
            sort && localStorage.setItem(`${this.storageKey}_sort`, sort);
            layout && localStorage.setItem(`${this.storageKey}_layout`, layout);
            sortYear && localStorage.setItem(`${this.storageKey}_sortYear`, sortYear);
            grupped != null && localStorage.setItem(`${this.storageKey}_grupped`, grupped);
          }
        });

      const storedSort = localStorage.getItem(`${this.storageKey}_sort`);
      const storedSortYear = localStorage.getItem(`${this.storageKey}_sortYear`);
      const storedLayout = localStorage.getItem(`${this.storageKey}_layout`);
      const storedGrupped = localStorage.getItem(`${this.storageKey}_grupped`);
      storedSort && (this.sort = storedSort);
      storedSortYear && (this.sortYear = storedSortYear);
      storedLayout && (this.layout = storedLayout);
      storedGrupped != null && (this.grupped = storedGrupped == 'true');
    }


    const sort$ = this.form.form.valueChanges.pipe(
      map(({ sort }) => sort),
      filter(Boolean),
      startWith(this.sort)
    );
    const sortYear$ = this.form.form.valueChanges.pipe(
      map(({ sortYear }) => sortYear),
      filter(Boolean),
      startWith(this.sortYear)
    );
    const grupped$ = this.form.form.valueChanges.pipe(
      map(({ grupped }) => grupped),
      filter((val) => val != null),
      startWith(this.grupped)
    );

    this.isLoading = true;

    this.data$.subscribe({ next: () => this.isLoading = false });

    this.displayedData$ = combineLatest(this.data$, sort$, sortYear$, grupped$, (data, sort: string, sortYear: string, grupped: boolean) => {
      let displayedData = this.groupData(data, grupped);
      displayedData.sort(byNumProp('year', 'group_asc' === sortYear));
      displayedData.forEach(({ books }) => (books as any[]).sort(byNumProp('totalOrder', 'order_asc' === sort)))
      return displayedData;

      function byNumProp(prop, asc) {
        return (a, b) => {
          if (!a[prop]) { return 1; }
          if (!b[prop]) { return -1; }
          if (!asc) { [a, b] = [b, a]; }
          return a[prop] - b[prop];
        };
      }
    });
  }

  private groupData(data, grupped) {
    if (!grupped) {
      return [{ year: `1998 - ${new Date().getFullYear()}`, books: data }];
    }
    var grouped = data.reduce((obj, item) => (obj[item.year] = obj[item.year] ? [...obj[item.year], item] : [item], obj), {});
    return Object.entries(grouped).map(([year, books]) => ({ year, books }));
  }

  ngAfterViewInit() { }

  public getImageBackground(book) {
    if (!book.pictureName) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('/assets/anonymous.jpg')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('${this.booksService.getImgUrl(book.bookid)}')`);
  }

}

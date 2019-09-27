import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { map, shareReplay, startWith, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BooksService } from '../../services/books.service';

// tslint:disable:no-unused-expression
// todo tslint conf

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewInit {

  public displayedData$: Observable<any>;
  public isLoading: boolean;

  private sort$: Observable<any>;

  @Input()
  public sort = 'order_asc';

  @Input()
  public layout: any = 'cards';

  @Input()
  public storageKey: string;

  @Input()
  public data$: Observable<any>;

  @ViewChild('form', { static: true })
  public form: NgForm;

  constructor(private sanitizer: DomSanitizer, private booksService: BooksService, ) { }

  ngOnInit() {
    if (this.storageKey) {
      this.form.form.valueChanges
        .subscribe({
          next: ({ layout, sort }) => {
            layout && localStorage.setItem(`${this.storageKey}_layout`, layout);
            sort && localStorage.setItem(`${this.storageKey}_sort`, sort);
          }
        });

      const storedSort = localStorage.getItem(`${this.storageKey}_sort`);
      const storedLayout = localStorage.getItem(`${this.storageKey}_layout`);
      storedSort && (this.sort = storedSort);
      storedLayout && (this.layout = storedLayout);
    }


    const sort$ = this.form.form.valueChanges.pipe(
      map(({ sort }) => sort),
      filter(Boolean),
      startWith(this.sort)
    );


    this.isLoading = true;

    this.data$.subscribe({ next: () => this.isLoading = false });

    this.displayedData$ = combineLatest(this.data$, sort$, (data, sort: string) => {
      const sortFn = this.getSortFn(sort);
      let displayedData = data.slice(0);
      sortFn && displayedData.sort(sortFn);
      if (/^lastReading/.test(sort)) {
        displayedData = displayedData.map(({ readings, ...obj }) => ({ ...obj, readings: readings.slice(0).reverse() }));
      }
      return displayedData;
    });
  }

  private getSortFn(sort) {
    let sortFn;
    switch (sort) {
      case 'order_asc':
      case 'order_desc':
      case 'published_asc':
      case 'published_desc':
      case 'pages_asc':
      case 'pages_desc':
        sortFn = byNumProp(sort.split('_')[0], /_asc$/.test(sort));
        break;
      case 'title_asc':
      case 'title_desc':
      case 'original_asc':
      case 'original_desc':
        sortFn = byStringProp(sort.split('_')[0], /_asc$/.test(sort));
        break;
      case 'hasImage_asc':
      case 'hasImage_desc':
      case 'home_asc':
      case 'home_desc':
      case 'hasDescription_asc':
      case 'hasDescription_desc':
        sortFn = byBooleanProp(sort.split('_')[0], /_asc$/.test(sort));
        break;
      case 'firstReading_asc':
      case 'firstReading_desc':
        sortFn = (a, b) => {
          let orderA = a.readings && a.readings.length && a.readings[0].totalOrder || 0;
          let orderB = b.readings && b.readings.length && b.readings[0].totalOrder || 0;
          if (/_desc$/.test(sort)) { [orderA, orderB] = [orderB, orderA]; }
          return orderA - orderB;
        };
        break;
      case 'lastReading_asc':
      case 'lastReading_desc':
        sortFn = (a, b) => {
          let orderA = a.readings && a.readings.length && a.readings[a.readings.length - 1].totalOrder || 0;
          let orderB = b.readings && b.readings.length && b.readings[b.readings.length - 1].totalOrder || 0;
          if (/_desc$/.test(sort)) { [orderA, orderB] = [orderB, orderA]; }
          return orderA - orderB;
        };
        break;
      case 'author_asc':
      case 'author_desc':
        sortFn = (a, b) => {
          let nameA = a.authors && a.authors.length && a.authors[0].lastName || '';
          let nameB = b.authors && b.authors.length && b.authors[0].lastName || '';
          if (/_desc$/.test(sort)) { [nameA, nameB] = [nameB, nameA]; }
          return nameA.localeCompare(nameB);
        };
        break;
      case 'serie_asc':
      case 'serie_desc':
        sortFn = (a, b) => {
          let nameA = a.series && a.series.length && a.series[0].title || '';
          let nameB = b.series && b.series.length && b.series[0].title || '';
          if (!nameA) { return 1; }
          if (!nameB) { return -1; }
          if (/_desc$/.test(sort)) { [nameA, nameB] = [nameB, nameA]; }
          return nameA.localeCompare(nameB);
        };
        break;
    }
    return sortFn;

    function byStringProp(prop, asc) {
      return (a, b) => {
        if (!a[prop]) { return 1; }
        if (!b[prop]) { return -1; }
        if (!asc) { [a, b] = [b, a]; }
        return a[prop].localeCompare(b[prop]);
      };
    }

    function byNumProp(prop, asc) {
      return (a, b) => {
        if (!a[prop]) { return 1; }
        if (!b[prop]) { return -1; }
        if (!asc) { [a, b] = [b, a]; }
        return a[prop] - b[prop];
      };
    }

    function byBooleanProp(prop, asc) {
      return (a, b) => {
        if (!asc) { [a, b] = [b, a]; }
        return b[prop] - a[prop];
      };
    }
  }

  ngAfterViewInit() { }

  public hSortClick(prop) {
    let sort;
    if (prop === 'reading') {
      const sorts = ['firstReading_asc', 'firstReading_desc', 'lastReading_asc', 'lastReading_desc'];
      const idx = sorts.indexOf(this.sort) + 1;
      sort = sorts[idx === 4 ? 0 : idx];
    } else if (prop === 'info') {
      const sorts = ['home_asc', 'home_desc', 'hasDescription_asc', 'hasDescription_desc', 'hasImage_asc', 'hasImage_desc'];
      const idx = sorts.indexOf(this.sort) + 1;
      sort = sorts[idx === 6 ? 0 : idx];
    } else {
      sort = `${prop}_asc` === this.sort ? `${prop}_desc` : `${prop}_asc`;
    }
    this.form.form.setValue({ sort, layout: this.layout });
  }

  public thClass(prop) {
    if (this.sort === `${prop}_asc`) { return 'asc'; }
    if (this.sort === `${prop}_desc`) { return 'desc'; }
    if (prop === 'reading') {
      return this.thClass('firstReading') || this.thClass('lastReading') || '';
    }
    if (prop === 'info') {
      return this.thClass('hasImage') || this.thClass('home') || this.thClass('hasDescription') || '';
    }
    return '';
  }

  public getImageBackground(book) {
    if (!book.pictureName) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('/assets/anonymous.jpg')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('${this.booksService.getImgUrl(book.id)}')`);
  }

}

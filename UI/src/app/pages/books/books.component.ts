import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { map, shareReplay, startWith, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, AfterViewInit {

  public data: Observable<any>;
  public displayedData: Observable<any>;
  public isLoading = true;

  public sort = 'order_asc';
  public layout: any = 'cards';

  @ViewChild('form', { static: true })
  public form: NgForm;

  constructor(public booksService: BooksService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.data = this.booksService.listBooks().pipe(shareReplay());
    this.data.subscribe({
      next: () => this.isLoading = false
    });

    const sort$ = this.form.form.valueChanges.pipe(
      map(({ sort }) => sort),
      filter(Boolean),
      startWith(this.sort)
    );


    this.displayedData = combineLatest(this.data, sort$, (data, sort: string) => {
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
        case 'pictureName_asc':
        case 'pictureName_desc':
        case 'title_asc':
        case 'title_desc':
          sortFn = byStringProp(sort.split('_')[0], /_asc$/.test(sort));
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
            if (/_desc$/.test(sort)) { [nameA, nameB] = [nameB, nameA]; }
            return nameA.localeCompare(nameB);
          };
          break;
      }
      let displayedData = data.slice(0);
      displayedData.sort(sortFn);
      if (/^lastReading/.test(sort)) {
        displayedData = displayedData.map(({ readings, ...obj }) => ({ ...obj, readings: readings.slice(0).reverse() }));
      }
      return displayedData;

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
    });
  }

  ngAfterViewInit() { }

  public hSortClick(prop) {
    let sort;
    if (prop === 'reading') {
      const sorts = ['firstReading_asc', 'firstReading_desc', 'lastReading_asc', 'lastReading_desc'];
      const idx = sorts.indexOf(this.sort) + 1;
      sort = sorts[idx === 4 ? 0 : idx];
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
    return '';
  }

  public getImageBackground(id) {
    return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('${this.booksService.getImgUrl(id)}')`);
  }

}

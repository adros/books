import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { map, startWith, filter } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthorsService } from '../../services/authors.service';

// tslint:disable:no-unused-expression
// todo tslint conf

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent implements OnInit, AfterViewInit {

  public displayedData$: Observable<any>;
  public isLoading: boolean;

  @Input()
  public sort = 'lastName_asc';

  @Input()
  public layout: any = 'table';

  @Input()
  public storageKey: string;

  @Input()
  public data$: Observable<any>;

  @ViewChild('form', { static: true })
  public form: NgForm;

  constructor(private sanitizer: DomSanitizer, private authorsService: AuthorsService) { }

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
      return displayedData;
    });
  }

  private getSortFn(sort) {
    let sortFn;
    switch (sort) {
      case 'booksInDb_asc':
      case 'booksInDb_desc':
      case 'readBooks_asc':
      case 'readBooks_desc':
        sortFn = byNumProp(sort.split('_')[0], /_asc$/.test(sort));
        break;
      case 'lastName_asc':
      case 'lastName_desc':
      case 'nationality_asc':
      case 'nationality_desc':
      case 'dateOfBirth_asc':
      case 'dateOfBirth_desc':
      case 'dateOfDeath_asc':
      case 'dateOfDeath_desc':
        sortFn = byStringProp(sort.split('_')[0], /_asc$/.test(sort));
        break;
      case 'hasImage_asc':
      case 'hasImage_desc':
      case 'link_asc':
      case 'link_desc':
        sortFn = byBooleanProp(sort.split('_')[0], /_asc$/.test(sort));
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
        return (!!b[prop] as any) - (!!a[prop] as any);
      };
    }
  }

  ngAfterViewInit() { }

  public hSortClick(prop) {
    let sort;
    if (prop === 'info') {
      const sorts = ['link_asc', 'link_desc', 'hasImage_asc', 'hasImage_desc'];
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
    if (prop === 'info') {
      return this.thClass('hasImage') || this.thClass('link') || '';
    }
    return '';
  }

  public getImageBackground(author) {
    if (!author.pictureName) {
      return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('/assets/anonymous.jpg')`);
    }
    return this.sanitizer.bypassSecurityTrustStyle(`background-image: url('${this.authorsService.getImgUrl(author.id)}')`);
  }

}

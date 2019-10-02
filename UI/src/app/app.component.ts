import { Component, EventEmitter, Renderer2, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, startWith, debounce } from 'rxjs/operators';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  version = environment.releaseVersion;
  versionTitle = `${environment.releaseVersion} ${environment.releaseCreatedAt} ${environment.slugCommit}`;

  public navbarOpen = false;

  public searchInputChange$ = new EventEmitter<Event>();
  public searchResult$: Observable<any>;

  @ViewChild('searchInput', { static: true })
  private searchInput: ElementRef;

  @ViewChild('dropdown', { static: false })
  private dropdown: ElementRef;

  private documentClickListener: () => void;

  constructor(private router: Router, private searchService: SearchService, private renderer: Renderer2) {
    router.events.subscribe(() => {
      this.navbarOpen = false;
      this.hideSearchResult();
    });

    this.searchResult$ = this.searchInputChange$.pipe(
      map(({ target }) => (target as any).value),
      debounce((val) => val ? timer(200) : of(0)),
      switchMap((value) => value ? this.searchService.search(value).pipe(startWith('LOADING')) : of(null))
    );

    this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
      if (event.button !== 2
        && !this.searchInput.nativeElement.contains(event.target)
        && (!this.dropdown || !this.dropdown.nativeElement.contains(event.target))
      ) {
        this.hideSearchResult()
      }
    });
  }

  ngOnDestroy(): void {
    this.documentClickListener();
  }

  public toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  private hideSearchResult() {
    this.searchInputChange$.next({ target: { value: null } } as any);
  }
}

import { Component, EventEmitter } from '@angular/core';
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
export class AppComponent {
  version = environment.releaseVersion;
  versionTitle = `${environment.releaseVersion} ${environment.releaseCreatedAt} ${environment.slugCommit}`;

  public navbarOpen = false;

  public searchInputChange$ = new EventEmitter<Event>();
  public searchResult$: Observable<any>;

  constructor(private router: Router, private searchService: SearchService) {
    router.events.subscribe(() => {
      this.navbarOpen = false;
      this.searchInputChange$.next({ target: { value: null } } as any);
    });

    this.searchResult$ = this.searchInputChange$.pipe(
      map(({ target }) => (target as any).value),
      debounce((val) => val ? timer(200) : of(0)),
      switchMap((value) => value ? this.searchService.search(value).pipe(startWith('LOADING')) : of(null))
    );
  }

  public toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

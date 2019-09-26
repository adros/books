import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  version = environment.releaseVersion;
  versionTitle = `${environment.releaseVersion} ${environment.releaseCreatedAt} ${environment.slugCommit}`;

  navbarOpen = false;

  constructor(private router: Router) {
    router.events.subscribe(() => this.navbarOpen = false);
  }

  public toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}

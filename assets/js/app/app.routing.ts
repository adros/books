import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeroDetailComponent }      from './hero-detail.component';
import { HeroesComponent }      from './heroes.component';
import { DashboardComponent }      from './dashboard.component';

const appRoutes: Routes = [{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
},
  {
    path: 'heroes',
    component: HeroesComponent
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'heroes/:id',
    component: HeroDetailComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

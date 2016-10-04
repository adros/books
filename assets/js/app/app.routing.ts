import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadingListComponent }      from './reading/reading-list.component';
import { BookDetailComponent }      from './book/book-detail.component';
import { HomeComponent }      from './home/home.component';
import { ChartsComponent }      from './chart/charts.component';

const appRoutes: Routes = [
  {
    path: 'readings',
    component: ReadingListComponent
  }, {
    path: '',
    component: HomeComponent
  }, {
    path: 'book/:id',
    component: BookDetailComponent
  }, {
    path: 'charts',
    component: ChartsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

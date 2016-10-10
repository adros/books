import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookDetailComponent } from './book/book-detail.component';
import { BookListComponent } from './book/book-list.component';
import { ReadingListComponent } from './reading/reading-list.component';
import { ReadingDetailComponent } from './reading/reading-detail.component';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './chart/charts.component';

const appRoutes: Routes = [
  {
    path: 'readings',
    component: ReadingListComponent
  },
  {
    path: 'readings/:id',
    component: ReadingDetailComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'books',
    component: BookListComponent
  },
  {
    path: 'books/:id',
    component: BookDetailComponent
  },
  {
    path: 'charts',
    component: ChartsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

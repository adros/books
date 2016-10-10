import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import './_common/rxjs-extensions';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { BookDetailComponent } from './book/book-detail.component';
import { BookListComponent } from './book/book-list.component';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './chart/charts.component';
import { ReadingListComponent } from './reading/reading-list.component';
import { ReadingDetailComponent } from './reading/reading-detail.component';



import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ChartModule } from 'angular2-highcharts';
import { DataTableModule } from 'angular-2-data-table';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { ErrorHandler } from './_common/error-handler';
import { BookService } from './service/book.service';
import { ChartService } from './service/chart.service';
import { ReadingService } from './service/reading.service';


@NgModule({
  imports: [
  BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ModalModule.forRoot(),
    BootstrapModalModule,
    ChartModule,
    DataTableModule,
    Ng2AutoCompleteModule
  ],
  declarations: [
    AppComponent,
    BookDetailComponent,
    BookListComponent,
    ChartsComponent,
    HomeComponent,
    ReadingListComponent,
    ReadingDetailComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    ErrorHandler,
    BookService,
    ChartService,
    ReadingService
  ]
  })
export class AppModule {
  }

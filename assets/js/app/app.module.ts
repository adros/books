import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import './rxjs-extensions';

import { routing } from './app.routing';


import { AppComponent }   from './app.component';
import { DashboardComponent } from './dashboard.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroesComponent }     from './heroes.component';
import { HeroSearchComponent }     from './hero-search.component';
import { ChartsComponent }     from './chart/charts.component';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ChartModule } from 'angular2-highcharts';

import { HeroService } from './hero.service';
import { ErrorHandler } from './error-handler';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ModalModule.forRoot(),
    BootstrapModalModule,
    ChartModule
  ],
  declarations: [AppComponent, ChartsComponent, HeroDetailComponent, HeroesComponent, DashboardComponent, HeroSearchComponent],
  bootstrap: [AppComponent],
  providers: [HeroService, ErrorHandler]
})
export class AppModule { }

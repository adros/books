import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthorsComponent } from './pages/authors/authors.component';
import { BooksComponent } from './pages/books/books.component';
import { BookComponent } from './pages/book/book.component';
import { HomeComponent } from './pages/home/home.component';

import { TableModule } from 'ngx-easy-table';
import { BookListComponent } from './pages/books/book-list.component';
import { AuthorComponent } from './pages/author/author.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorsComponent,
    AuthorComponent,
    BooksComponent,
    BookComponent,
    HomeComponent,
    BookListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

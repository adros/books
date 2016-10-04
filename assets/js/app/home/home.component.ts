import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  selector: 'home'
})
export class HomeComponent implements OnInit {


  constructor(private router: Router/*, private heroService: HeroService*/) { }

  ngOnInit(): void {

  }

}

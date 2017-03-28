import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { AppState } from './app.service';


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    // console.log('Initial App State', this.appState.state);
  }

}

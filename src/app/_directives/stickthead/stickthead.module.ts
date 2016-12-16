import { NgModule }      from '@angular/core';
import { StickThead } from './stickthead.directive';

@NgModule({
  declarations: [
    StickThead
  ],
  exports: [
    StickThead
  ]
})
export class StickTheadModule {
}

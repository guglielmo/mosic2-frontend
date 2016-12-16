import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Signup } from './signup.component';

export const routes = [
  { path: '', component: Signup, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    Signup
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export default class SignupModule {
  static routes = routes;
}

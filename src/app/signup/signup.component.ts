import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../_services/index';


@Component({
  selector: 'signup',
  styleUrls: [ 'signup.style.scss' ],
  templateUrl: 'signup.template.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'signup-page app'
  }
})
export class Signup {
  model: any = {};
  error: string = '';
  loading = false;

  constructor(
      private router: Router,
      private userService: UserService
  ) { }

  register() {
    this.loading = true;
    this.userService.create(this.model)
        .subscribe(
            data => {
              console.log(data);
              //this.alertService.success('Registrazione avvenuta con successo', true);
              this.router.navigate(['/login']);
            },
            error => {
              console.log(error);
              this.error = error;
              this.loading = false;
            });
  }
}

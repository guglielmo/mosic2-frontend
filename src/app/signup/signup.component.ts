import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APICommonService } from '../_services/index';


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
  error = '';
  loading = false;

  constructor(
      private router: Router,
      public apiService: APICommonService
  ) { }

  register() {
    this.loading = true;
    this.apiService.create('users',this.model)
        .subscribe(
            data => {
              console.log(data);
              //this.alertService.success('Registrazione avvenuta con successo', true);
              this.router.navigate(['/login']);
            },
            error => {
              let response = error.json();
              this.error = response.error.message;
              this.loading = false;
            });
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}

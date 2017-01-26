import { Component } from '@angular/core';
import { APICommonService } from '../_services/index';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.template.html'
})
export class Dashboard {

    constructor(private apiService: APICommonService) {


    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }


}

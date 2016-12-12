import { Component, OnInit }            from '@angular/core';
import { User }                         from '../_models/index';

import { AuthenticationService }        from '../_services/authentication.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
    currentUser: User;
    constructor( private authenticationService: AuthenticationService ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    public disabled:boolean = false;
    public status:{isopen:boolean} = {isopen: false};

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);

    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {}
}

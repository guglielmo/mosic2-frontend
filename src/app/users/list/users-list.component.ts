import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { APICommonService } from '../../_services/index';
import { AppConfig } from "../../app.config";

import { Groups } from '../../_models/groups';
import { Uffici } from '../../_models/uffici';
import { RuoliCipe } from '../../_models/ruoli_cipe';
import { User } from '../../_models/user'

@Component({
    templateUrl: 'users-list.component.html'
})
export class UsersListComponent {

    public filter = {
        denominazione: '',
        id_groups: '',
        id_uffici: '',
        id_ruoli_cipe: '',
        cessatoServizio: ''
    };

    currentUser: User;
    deletingUser: User = new User;

    public users$: Observable<User[]>;
    public groups$: Observable<Groups[]>;
    public uffici$: Observable<Uffici[]>;
    public ruoli_cipe$: Observable<RuoliCipe[]>;

    filteredCount = { count: 0 };

    public select2Options: Select2Options;

    public canDelete: boolean = false;

    constructor(config: AppConfig,
                public apiService: APICommonService,
                private router: Router
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.users$ = this.apiService.subscribeToDataService('users');
        this.groups$ = this.apiService.subscribeToDataService('groups');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.ruoli_cipe$ = this.apiService.subscribeToDataService('ruoli_cipe');

        this.select2Options = config.select2Options;
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        this.canDelete = this.apiService.userCan('DELETE_USERS');
    }

    editId(id: number) {
        this.router.navigate(['/app/users/edit/' + id]);
    }

    askDeleteUser( event: any, modal:any, user:User ) {
        event.stopPropagation();
        this.deletingUser = user;
        modal.open();
    }

    confirmDeleteUser(modal:any) {
        modal.close();
        this.deleteUser(this.deletingUser.id);
        this.deletingUser = new User;
    }

    deleteUser(id: number) {
        this.apiService.delete('users',id).subscribe(() => {
            this.apiService.refreshCommonCache();
            //this.loadAllUsers()
        });
    }

    public select2Changed(e: any, name: string): void {
        this.filter[name] = e.value;
    }

    public resetFilters(event): void {
        event.stopPropagation();
        this.filter = {
            denominazione: '',
            id_groups: '',
            id_uffici: '',
            id_ruoli_cipe: '',
            cessatoServizio: ''
        };
    }

}

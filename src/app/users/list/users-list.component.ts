import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User, Uffici, RuoliCipe } from '../../_models/index';
import { APICommonService } from '../../_services/index';

import {AppConfig} from "../../app.config";


@Component({
    templateUrl: 'users-list.component.html'
})
export class UsersListComponent {

    public filter = {
        denominazione: '',
        id_uffici: '',
        id_ruoli_cipe: ''
    };

    currentUser: User;
    deletingUser: User = new User;
    users$: Observable<User[]>;
    uffici$: Observable<Uffici[]>;
    ruoli_cipe$: Observable<RuoliCipe[]>;
    filteredCount = { count: 0 };

    private select2Options: Select2Options;

    constructor(config: AppConfig,
                public apiService: APICommonService,
                private router: Router
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.users$ = this.apiService.subscribeToDataService('users');
        this.uffici$ = this.apiService.subscribeToDataService('uffici');
        this.ruoli_cipe$ = this.apiService.subscribeToDataService('ruoli_cipe');

        this.select2Options = config.select2Options;
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
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

    public resetFilters(): void {
        this.filter = {
            denominazione: '',
            id_uffici: '',
            id_ruoli_cipe: ''
        };
    }

}

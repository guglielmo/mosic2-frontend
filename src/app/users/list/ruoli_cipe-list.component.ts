import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RuoliCipe } from '../../_models/ruoli_cipe';
import { APICommonService } from '../../_services/index';


@Component({
    templateUrl: 'ruoli_cipe-list.component.html'
})
export class RuoliCipeListComponent implements OnInit {

    currentRole: RuoliCipe;
    deletingRole: RuoliCipe = new RuoliCipe;
    public ruoli_cipe$: Observable<RuoliCipe[]>;

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.currentRole = JSON.parse(localStorage.getItem('currentRole'));
        this.ruoli_cipe$ = this.apiService.subscribeToDataService('ruoli_cipe');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.canEdit = this.apiService.userCan('CREATE_RUOLI_CIPE');
        this.canDelete = this.apiService.userCan('DELETE_RUOLI_CIPE');
    }

    editId(id: number) {
        this.router.navigate(['/app/users/ruoli_cipe/edit/' + id]);
    }

    askDeleteRole( event: any, modal: any, role: RuoliCipe ) {
        event.stopPropagation();
        this.deletingRole = role;
        modal.open();
    }

    confirmDeleteRole(modal: any) {
        modal.close();
        this.deleteRole(this.deletingRole.id);
        this.deletingRole = new RuoliCipe;
    }

    deleteRole(id: number) {
        this.apiService.delete('ruoli_cipe', id).subscribe(() => {
            this.apiService.refreshCommonCache();
        });
    }
}

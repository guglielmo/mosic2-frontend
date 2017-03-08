import {Component}        from '@angular/core';
import {Router} from '@angular/router';

import { RuoliCipe } from '../../_models/index';
import { APICommonService } from '../../_services/index';


@Component({
    templateUrl: 'ruoli_cipe-list.component.html'
})
export class RuoliCipeListComponent {

    currentRole: RuoliCipe;
    deletingRole: RuoliCipe = new RuoliCipe;
    roles: RuoliCipe[] = [];


    constructor(private apiService: APICommonService,
                private router: Router
    ) {
        this.currentRole = JSON.parse(localStorage.getItem('currentRole'));
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        //this.loadAllRoles();
    }

    editId(id: number) {
        this.router.navigate(['/app/users/ruoli_cipe/edit/' + id]);
    }

    askDeleteRole( event: any, modal:any, role:RuoliCipe ) {
        event.stopPropagation();
        this.deletingRole = role;
        modal.open();
    }

    confirmDeleteRole(modal:any) {
        modal.close();
        this.deleteRole(this.deletingRole.id);
        this.deletingRole = new RuoliCipe;
    }

    deleteRole(id: number) {
        this.apiService.delete('roles',id).subscribe(() => {
            this.apiService.refreshCommonCache();
        });
    }

    private loadAllRoles() {
        this.apiService.getAll('roles').subscribe(response => {
            this.roles = Object.assign([],response.data);
        });
    }
}

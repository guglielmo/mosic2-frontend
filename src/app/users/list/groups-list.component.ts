import {Component}        from '@angular/core';
import {Router} from '@angular/router';

import { Groups } from '../../_models/index';
import { APICommonService } from '../../_services/index';


@Component({
    templateUrl: 'groups-list.component.html'
})
export class GroupsListComponent {

    currentGroup: Groups;
    deletingGroup: Groups = new Groups;
    groups: Groups[] = [];
    supportedClasses: string[] = ["REGISTRI", "FASCICOLI","TITOLARI", "AMMINISTRAZIONI", "MITTENTI", "UTENTI"];


    constructor(private apiService: APICommonService,
                private router: Router
    ) {
        this.currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        //this.loadAllGroups();
    }

    editId(id: number) {
        this.router.navigate(['/app/users/groups/edit/' + id]);
    }

    askDeleteGroup( event: any, modal:any, group:Groups ) {
        event.stopPropagation();
        this.deletingGroup = group;
        modal.open();
    }

    confirmDeleteGroup(modal:any) {
        modal.close();
        this.deleteGroup(this.deletingGroup.id);
        this.deletingGroup = new Groups;
    }

    deleteGroup(id: number) {
        this.apiService.delete('groups',id).subscribe(() => {
            this.apiService.refreshCommonCache();
        });
    }

    private loadAllGroups() {
        this.apiService.getAll('groups').subscribe(response => {
            this.groups = Object.assign([],response.data);
        });
    }
}

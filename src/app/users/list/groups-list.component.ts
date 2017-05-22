import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { APICommonService } from '../../_services/index';
import { Groups } from '../../_models/groups';

@Component({
    templateUrl: 'groups-list.component.html'
})
export class GroupsListComponent implements OnInit {

    currentGroup: Groups;
    deletingGroup: Groups = new Groups;
    public groups$: Observable<Groups[]>;

    public canDelete: boolean = false;

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.groups$ = this.apiService.subscribeToDataService('groups');
        this.currentGroup = JSON.parse(localStorage.getItem('currentGroup'));
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.canDelete = this.apiService.userCan('DELETE_GROUPS');
    }

    editId(id: number) {
        this.router.navigate(['/app/users/groups/edit/' + id]);
    }

    askDeleteGroup( event: any, modal: any, group: Groups ) {
        event.stopPropagation();
        this.deletingGroup = group;
        modal.open();
    }

    confirmDeleteGroup(modal: any) {
        modal.close();
        this.deleteGroup(this.deletingGroup.id);
        this.deletingGroup = new Groups;
    }

    deleteGroup(id: number) {
        this.apiService.delete('groups', id).subscribe(() => {
            this.apiService.refreshCommonCache();
        });
    }
}

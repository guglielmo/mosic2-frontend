import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Groups } from '../../_models'
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'groups-edit.component.html'
})

export class GroupsEditComponent implements OnInit {
    model: Groups = new Groups;
    error = '';
    mode: string;
    loading= false;
    id: number;

    supportedClasses: string[] = [
        'AMMINISTRAZIONI',
        'MITTENTI',
        'TITOLARI',
        'FASCICOLI',
        'REGISTRI',
        'GROUPS',
        'UFFICI',
        'RUOLI_CIPE',
        'TAGS',
        'PRECIPE',
        'AREARISERVATA_PRECIPE',
        'AREARISERVATA_PRECIPE_CHECK',
        'FIRMATARI',
        'CIPE',
        'AREARISERVATA_CIPE',
        'AREARISERVATA_CIPE_CHECK',
        'FIRMATARITIPO',
        'CIPEESITI',
        'CIPEESITITIPO',
        'CIPEARGOMENTITIPO',
        'USERS',
        'DELIBERE',
        'ADEMPIMENTI',
        'MONITOR'
    ];
    supportedPermissions: string[] = ['READ', 'CREATE', 'EDIT', 'DELETE'];

    roles: string[] = [];

    public canEdit: boolean = false;
    public canDelete: boolean = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public apiService: APICommonService
    ) {

    }



    ngOnInit() {
        //console.log(this.model);
        this.apiService.refreshCommonCache();

        this.id = +this.route.snapshot.params['id'];
        this.mode = isNaN(this.id) ? 'create' : 'update';
        this.canEdit = isNaN(this.id) ? this.apiService.userCan('CREATE_GROUPS') : this.apiService.userCan('EDIT_GROUPS');
        this.canDelete = this.apiService.userCan('DELETE_GROUPS');

        switch( this.mode ) {
            case 'create':
                this.model.roles = [];
                this.loading = false;
                break;

            case 'update':
                this.apiService.getById('groups', this.id)
                    .subscribe(
                        response => {
                            this.model = response.data;
                            this.loading = false;

                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }

    updateCheckedOptions(supportedclass: string, event) {
        if(event.target.checked) {
            this.model.roles.push(supportedclass);
        } else {
            for (var i=this.model.roles.length-1; i>=0; i--) {
                if (this.model.roles[i] === supportedclass) {
                    this.model.roles.splice(i, 1);
                }
            }
        }
        //console.log(supportedclass,this.model.roles);
    }

    cancel( event ) {
        this.router.navigate(['/app/users/groups/list']);
    }

    submit() {
        this.loading = true;

        switch( this.mode ) {
            case 'create':
                this.apiService.create('groups', this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/users/groups/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;

            case 'update':
                this.apiService.update('groups',this.model)
                    .subscribe(
                        data => {
                            this.router.navigate(['/app/users/groups/list']);
                        },
                        error => {
                            this.error = error; console.log(error);
                            this.loading = false;
                        });
                break;
        }
    }
}

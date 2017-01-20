import {Component}        from '@angular/core';
import {Router} from '@angular/router';

import { User } from '../../_models/index';
import { APICommonService } from '../../_services/index';


@Component({
    templateUrl: 'users-list.component.html'
})
export class UsersListComponent {

    currentUser: User;
    deletingUser: User = new User;
    users: User[] = [];

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
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
            this.loadAllUsers()
        });
    }

    private loadAllUsers() {
        this.apiService.getAll('users').subscribe(response => {
            this.users = Object.assign([],response.data);
        });
    }
}

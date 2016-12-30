import { Component }        from '@angular/core';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';


@Component({
    templateUrl: 'users-list.component.html'
})
export class UsersListComponent {

    currentUser: User;
    deletingUser: User = new User;
    users: User[] = [];



    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    askDeleteUser( modal:any, user:User ) {
        this.deletingUser = user;
        modal.open();
    }

    confirmDeleteUser(modal:any) {
        modal.close();
        this.deleteUser(this.deletingUser.id);
        this.deletingUser = new User;
    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}
import {Component}        from '@angular/core';
import {Router} from '@angular/router';


import {Registri} from '../../_models/index';
import {RegistriService} from '../../_services/index';

//declare var moment: any;


@Component({
    templateUrl: 'registri-list.component.html'
})
export class RegistriListComponent {

    deletingRegistri: Registri = new Registri;
    registri: Registri[] = [];

    //registriJSON: string;


    constructor(private registriService: RegistriService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.loadAllRegistri();
    }

    askDeleteRegistri(modal: any, registri: Registri) {
        this.deletingRegistri = registri;
        modal.open();
    }

    editId(id: number) {
        this.router.navigate(['/app/registri/edit/' + id]);
    }

    confirmDeleteRegistri(modal: any) {
        modal.close();
        this.deleteRegistri(this.deletingRegistri.id);
        this.deletingRegistri = new Registri;
    }

    deleteRegistri(id: number) {
        this.registriService.delete(id).subscribe(() => {
            this.loadAllRegistri()
        });
    }

    private loadAllRegistri() {
        this.registriService.getAll().subscribe(registri => {
            this.registri = registri;

/*            this.registri.forEach((entry) => {
             entry['data_arrivo'] = moment(entry['data_arrivo'], "DD/MM/YYYY").format("YYYY-MM-DD");
             entry['data_mittente'] = moment(entry['data_mittente'], "DD/MM/YYYY").format("YYYY-MM-DD");
             });

             this.registriJSON = JSON.stringify(this.registri);*/

        });
    }
}

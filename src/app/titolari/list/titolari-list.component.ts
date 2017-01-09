import {Component}        from '@angular/core';
import {Router} from '@angular/router';

import {Titolari} from '../../_models/index';
import {APICommonService} from '../../_services/index';

@Component({
    templateUrl: 'titolari-list.component.html'
})
export class TitolariListComponent {

    deletingTitolari: Titolari = new Titolari;
    titolari: Titolari[] = [];

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.loadAllTitolari();
    }

    editId(id: number) {
        this.router.navigate(['/app/titolari/edit/' + id]);
    }

    askDeleteTitolari(modal: any, titolari: Titolari) {
        this.deletingTitolari = titolari;
        modal.open();
    }

    confirmDeleteTitolari(modal: any) {
        modal.close();
        this.deleteTitolari(this.deletingTitolari.id);
        this.deletingTitolari = new Titolari;
    }

    deleteTitolari(id: number) {
        this.apiService.delete('titolari', id).subscribe(() => {
            this.loadAllTitolari()
        });
    }

    private
    loadAllTitolari() {
        this.apiService.getAll('titolari').subscribe(titolari => {
            this.titolari = titolari;
        });
    }
}

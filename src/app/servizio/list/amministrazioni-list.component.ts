import {Component}        from '@angular/core';
import {Router} from '@angular/router';
import { URLSearchParams } from '@angular/http';


import {Amministrazioni} from '../../_models/index';
import {APICommonService} from '../../_services/index';

@Component({
    templateUrl: 'amministrazioni-list.component.html'
})
export class AmministrazioniListComponent {

    public filter = {
        denominazione: ''
    };

    deletingAmministrazioni: Amministrazioni = new Amministrazioni;
    amministrazioni: Amministrazioni[] = [];
    filteredCount = {count: 0};

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/amministrazioni/edit/' + id]);
    }

    askDeleteAmministrazioni(event:any, modal: any, amministrazioni: Amministrazioni) {
        event.stopPropagation();
        this.deletingAmministrazioni = amministrazioni;
        modal.open();
    }

    confirmDeleteAmministrazioni(modal: any) {
        modal.close();
        this.deleteAmministrazioni(this.deletingAmministrazioni.id);
        this.deletingAmministrazioni = new Amministrazioni;
    }

    deleteAmministrazioni(id: number) {
        this.apiService.delete('amministrazioni', id).subscribe(
            response => {
                this.apiService.refreshCommonCache();

            },
            error => {
                console.log(error);
            });
    }

    public resetFilters(): void {
        this.filter = {
            denominazione: ''
        };
    }
}

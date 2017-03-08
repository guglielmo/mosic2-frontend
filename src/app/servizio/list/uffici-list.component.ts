import {Component}        from '@angular/core';
import {Router} from '@angular/router';
import { URLSearchParams } from '@angular/http';


import {Uffici} from '../../_models/index';
import {APICommonService} from '../../_services/index';


@Component({
    templateUrl: 'uffici-list.component.html'
})
export class UfficiListComponent {

    public filter = {
        denominazione: ''
    };

    deletingUffici: Uffici = new Uffici;
    uffici: Uffici[] = [];
    filteredCount = {count: 0};

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/uffici/edit/' + id]);
    }

    askDeleteUffici(event:any, modal: any, uffici: Uffici) {
        event.stopPropagation();
        this.deletingUffici = uffici;
        modal.open();
    }

    confirmDeleteUffici(modal: any) {
        modal.close();
        this.deleteUffici(this.deletingUffici.id);
        this.deletingUffici = new Uffici;
    }

    deleteUffici(id: number) {
        this.apiService.delete('uffici', id).subscribe(
            response => {
                this.apiService.refreshCommonCache();

            },
            error => { }
        );
    }

    public resetFilters(): void {
        this.filter = {
            denominazione: ''
        };
    }
}

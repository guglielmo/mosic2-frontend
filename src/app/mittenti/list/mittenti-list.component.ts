import {Component}        from '@angular/core';
import {Router} from '@angular/router';
import { URLSearchParams } from '@angular/http';


import {Mittenti} from '../../_models/index';
import {APICommonService} from '../../_services/index';


@Component({
    templateUrl: 'mittenti-list.component.html'
})
export class MittentiListComponent {

    public filter = {
        denominazione: ''
    };

    deletingMittenti: Mittenti = new Mittenti;
    mittenti: Mittenti[] = [];
    filteredCount = {count: 0};

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/mittenti/edit/' + id]);
    }

    askDeleteMittenti(event:any, modal: any, mittenti: Mittenti) {
        event.stopPropagation();
        this.deletingMittenti = mittenti;
        modal.open();
    }

    confirmDeleteMittenti(modal: any) {
        modal.close();
        this.deleteMittenti(this.deletingMittenti.id);
        this.deletingMittenti = new Mittenti;
    }

    deleteMittenti(id: number) {
        this.apiService.delete('mittenti', id).subscribe(
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

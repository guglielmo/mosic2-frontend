import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';



import { Cipe } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'cipe-list.component.html'
})
export class CipeListComponent {

    public cipe: Observable<Cipe[]>;

    deletingCipe: Cipe = new Cipe;

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.cipe = this.apiService.subscribeToDataService('cipe');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        // this.loadAllCipe();
    }

    editId(id: number) {
        this.router.navigate(['/app/cipe/edit/' + id]);
    }

    askDeleteCipe(event:any, modal: any, cipe: Cipe) {
        event.stopPropagation();
        this.deletingCipe = cipe;
        modal.open();
    }

    confirmDeleteCipe(modal: any) {
        modal.close();
        this.deleteCipe(this.deletingCipe.id);
        this.deletingCipe = new Cipe;
    }

    deleteCipe(id: number) {
        this.apiService.delete('cipe', id).subscribe(() => {
            this.apiService.refreshCommonCache();
            // this.loadAllCipe()
        });
    }

    private loadAllCipe() {
        let params = new URLSearchParams();
        params.append('sort_by', 'data');
        params.append('sort_order', 'desc');

        this.apiService.getAll('cipe', params).subscribe(response => {
            this.cipe = response.data;
        });
    }
}

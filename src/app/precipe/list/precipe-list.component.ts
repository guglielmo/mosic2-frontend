import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';



import { Precipe } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'precipe-list.component.html'
})
export class PreCipeListComponent {

    public precipe: Observable<Precipe[]>;

    deletingPrecipe: Precipe = new Precipe;

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.precipe = this.apiService.subscribeToDataService('precipe');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        // this.loadAllPrecipe();
    }

    editId(id: number) {
        this.router.navigate(['/app/precipe/edit/' + id]);
    }

    askDeletePrecipe(event:any, modal: any, precipe: Precipe) {
        event.stopPropagation();
        this.deletingPrecipe = precipe;
        modal.open();
    }

    confirmDeletePrecipe(modal: any) {
        modal.close();
        this.deletePrecipe(this.deletingPrecipe.id);
        this.deletingPrecipe = new Precipe;
    }

    deletePrecipe(id: number) {
        this.apiService.delete('precipe', id).subscribe(() => {
            this.apiService.refreshCommonCache();
            // this.loadAllPrecipe()
        });
    }

    private loadAllPrecipe() {
        let params = new URLSearchParams();
        params.append('sort_by', 'data');
        params.append('sort_order', 'desc');

        this.apiService.getAll('precipe', params).subscribe(response => {
            this.precipe = response.data;
        });
    }
}

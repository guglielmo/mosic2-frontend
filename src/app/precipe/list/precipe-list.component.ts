import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';



import { PreCipe } from '../../_models/index';
import { APICommonService } from '../../_services/index';

@Component({
    templateUrl: 'precipe-list.component.html'
})
export class PreCipeListComponent {

    public precipe: Observable<PreCipe[]>;

    deletingPreCipe: PreCipe = new PreCipe;

    constructor(public apiService: APICommonService,
                private router: Router
    ) {
        this.precipe = this.apiService.subscribeToDataService('precipe');
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        // this.loadAllPreCipe();
    }

    editId(id: number) {
        this.router.navigate(['/app/precipe/edit/' + id]);
    }

    askDeletePreCipe(event:any, modal: any, precipe: PreCipe) {
        event.stopPropagation();
        this.deletingPreCipe = precipe;
        modal.open();
    }

    confirmDeletePreCipe(modal: any) {
        modal.close();
        this.deletePreCipe(this.deletingPreCipe.id);
        this.deletingPreCipe = new PreCipe;
    }

    deletePreCipe(id: number) {
        this.apiService.delete('precipe', id).subscribe(() => {
            this.apiService.refreshCommonCache();
            // this.loadAllPreCipe()
        });
    }

    private loadAllPreCipe() {
        let params = new URLSearchParams();
        params.append('sort_by', 'data');
        params.append('sort_order', 'desc');

        this.apiService.getAll('precipe', params).subscribe(response => {
            this.precipe = response.data;
        });
    }
}

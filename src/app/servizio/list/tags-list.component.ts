import {Component}        from '@angular/core';
import {Router} from '@angular/router';
import { URLSearchParams } from '@angular/http';


import {Tags} from '../../_models/index';
import {APICommonService} from '../../_services/index';


@Component({
    templateUrl: 'tags-list.component.html'
})
export class TagsListComponent {

    public filter = {
        denominazione: ''
    };

    deletingTags: Tags = new Tags;
    tags: Tags[] = [];
    filteredCount = {count: 0};

    constructor(private apiService: APICommonService,
                private router: Router
    ) {
    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
    }

    editId(id: number) {
        this.router.navigate(['/app/tags/edit/' + id]);
    }

    askDeleteTags(event:any, modal: any, tags: Tags) {
        event.stopPropagation();
        this.deletingTags = tags;
        modal.open();
    }

    confirmDeleteTags(modal: any) {
        modal.close();
        this.deleteTags(this.deletingTags.id);
        this.deletingTags = new Tags;
    }

    deleteTags(id: number) {
        this.apiService.delete('tags', id).subscribe(
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

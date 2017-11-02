import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'lodashDataFilter'
})
export class LodashDataFilterPipe implements PipeTransform {

    transform(array: any[], lodash_filter: any, filteredCount = {count: 0}, refresh? ): any {

        let results = [];

        // console.log('lodash_filter', lodash_filter);
        if (lodash_filter === 'only_referenti') {
           results = _.filter(array, (users) => { return users.groups === 2 || users.groups ===3 });
           return results;
        }

        const lodash_filter_apply = {};
        for (let key in lodash_filter) {
            if (lodash_filter[key]) { lodash_filter_apply[key] = lodash_filter[key] }
        }

        if (lodash_filter) {
            results = _.filter(array, lodash_filter_apply);
        } else {
            results = array;
        }

        filteredCount.count = results.length;
        // console.log(results);
        return results;
    }
}

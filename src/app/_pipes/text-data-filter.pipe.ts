import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'textDataFilter'
})
export class TextDataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, filteredCount: any): any {

        const keys = query.toUpperCase().split(' ');
        const keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        const qL = query.length > 2;

        const results = _.filter(array, row => {

            if (qL) {
                for (i = 0; i < keysLen; i++) {
                    if (!row.text || (row.text.toUpperCase()).indexOf((keys[i])) === -1) {
                        return false;
                    }
                }
            }

            return true;
        });
        filteredCount.count = results.length;
        return results;

    }
}

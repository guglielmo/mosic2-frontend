import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "denominazioneDataFilter"
})
export class DenominazioneDataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, filteredCount: any): any {

        let keys = query.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = query.length > 2;

        let results = _.filter(array, row => {

            if (qL) {
                for (i = 0; i < keysLen; i++) {
                    if ((row.denominazione.toUpperCase()).indexOf((keys[i])) == -1) {
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
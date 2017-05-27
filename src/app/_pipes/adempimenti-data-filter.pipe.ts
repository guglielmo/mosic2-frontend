import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "adempimentiDataFilter"
})
export class AdempimentiDataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, numero: string, id_situazione: number, filteredCount: any): any {

        let keys = query.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = query.length > 2;
        let fL = numero !== null && numero.length > 0;

        let iS = id_situazione !== null && id_situazione > 0;

        let results = _.filter(array, row => {

            if (fL && row.numero != numero) return false;
            if (iS && row.situazione != id_situazione) return false;
            if (qL) {
                for (i = 0; i < keysLen; i++) {
                    if ((row.descrizione.toUpperCase()).indexOf((keys[i])) == -1) {
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
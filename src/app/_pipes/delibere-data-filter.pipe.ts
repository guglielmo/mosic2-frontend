import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "delibereDataFilter"
})
export class DelibereDataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, numero: string, data_da: number, data_a: number, id_situazione: number, filteredCount: any): any {

        let keys = query.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = query.length > 2;
        let fL = numero !== null && numero.length > 0;

        let dD = data_da !== null ? new Date(data_da).getTime() : null;
        let dA = data_a !== null ? new Date(data_a).getTime() : null;

        let iS = id_situazione !== null && id_situazione > 0;

        let results = _.filter(array, row => {

            if (dD && row.data < dD ) return false;
            if (dA && row.data > dA ) return false;
            if (fL && row.numero != numero) return false;
            if (iS && row.situazione != id_situazione) return false;
            if (qL) {
                for (i = 0; i < keysLen; i++) {
                    if ((row.argomento.toUpperCase()).indexOf((keys[i])) == -1) {
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
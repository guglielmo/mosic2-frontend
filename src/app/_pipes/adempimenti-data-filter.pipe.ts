import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "adempimentiDataFilter"
})
export class AdempimentiDataFilterPipe implements PipeTransform {

    transform(array: any[], data_da: string, data_a: string, numero_delibera: string, query: string, codice_esito: number, filteredCount: any): any {

        let keys = query.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = query.length > 2;
        let fL = numero_delibera !== null && numero_delibera.length > 0;

        let iS = codice_esito !== null && codice_esito > 0;

        let dD = data_da !== null ? new Date(data_da).getTime() : null;
        let dA = data_a !== null ? new Date(data_a).getTime() : null;

        let results = _.filter(array, row => {

            if (dD && row.data_delibera < dD ) return false;
            if (dA && row.data_delibera > dA ) return false;

            if (fL && row.numero_delibera != numero_delibera) return false;
            if (iS && row.codice_esito != codice_esito) return false;
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
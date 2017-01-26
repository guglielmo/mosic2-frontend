import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "fascicoliDataFilter"
})
export class FascicoliDataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, id_titolari: number, id_amministrazioni: number, numero_fascicolo: string, filteredCount: any): any {

        let keys = query.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = query.length > 2;
        let tL = id_titolari != -1;
        let aL = id_amministrazioni != -1;
        let fL = numero_fascicolo.length > 0;

        let results = _.filter(array, row => {

            if (tL && row.id_titolari != id_titolari) return false;
            if (aL && row.id_amministrazioni.split(',').indexOf(id_amministrazioni) == -1) return false;
            if (fL && row.numero_fascicolo != numero_fascicolo) return false;
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
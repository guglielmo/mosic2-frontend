import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "usersDataFilter"
})
export class UsersDataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, id_uffici: any, id_ruoli_cipe: any, id_groups: any, filteredCount: any): any {

        let keys = query.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = query.length > 2;
        let tL = id_uffici != '';
        let aL = id_ruoli_cipe != '';
        let aG = id_groups != '';

        let results = _.filter(array, row => {

            if (tL && row.id_uffici != id_uffici) return false;
            if (aL && row.id_ruoli_cipe != id_ruoli_cipe) return false;
            if (aG && row.id_groups != id_groups) return false;
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
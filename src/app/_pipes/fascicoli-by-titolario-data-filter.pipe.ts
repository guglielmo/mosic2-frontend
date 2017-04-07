import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "fascicoliByTitolarioDataFilter"
})
export class FascicoliByTitolarioDataFilterPipe implements PipeTransform {

    transform(array: any[], id_titolari: number): any {

        // no id_titolari, skip filtering
        if (id_titolari == null) {
            return array;
        }

        return _.filter(array, row => {
            // todo: change back to strict equality operator when titolari getAll returns a numeric id
            if (row.id_titolari != id_titolari) return false;

            return true;
        });

    }
}
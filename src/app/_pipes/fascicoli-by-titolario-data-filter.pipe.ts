import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "fascicoliByTitolarioDataFilter"
})
export class FascicoliByTitolarioDataFilterPipe implements PipeTransform {

    transform(array: any[], id_titolari: number): any {

        // pre-compute some conditions to execute checks outside the loop
        let tL = id_titolari != null;
        return _.filter(array, row => {
            if (tL && row.id_titolari != id_titolari) return false;

            return true;
        });

    }
}
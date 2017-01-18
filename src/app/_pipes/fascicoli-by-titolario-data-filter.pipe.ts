import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "fascicoliByTitolarioDataFilter"
})
export class FascicoliByTitolarioDataFilterPipe implements PipeTransform {

    transform(array: any[], titolari: number): any {

        // pre-compute some conditions to execute checks outside the loop
        let tL = titolari != -1;
        return _.filter(array, row => {

            if (tL && row.codice_titolario != titolari) return false;

            return true;
        });

    }
}
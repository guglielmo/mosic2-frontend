import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "delibereByCipeDataFilter"
})
export class DelibereByCipeDataFilterPipe implements PipeTransform {

    transform(array: any[], id_cipe: number): any {

        // no id_titolari, skip filtering
        if (id_cipe == null) {
            return array;
        }

        return _.filter(array, row => {
            if (row.id_cipe != id_cipe) return false;

            return true;
        });

    }
}
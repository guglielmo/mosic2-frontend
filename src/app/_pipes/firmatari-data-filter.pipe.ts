import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "firmatariDataFilter"
})
export class FirmatariDataFilterPipe implements PipeTransform {

    transform(array: any[], tipo: number, disattivato: number): any {

        let results = _.filter(array, row => {

            if (row.tipo != tipo) return false;
            if (row.disattivato != disattivato) return false;

            return true;
        });
        return results;

    }
}
import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "delibereByDateDataFilter"
})
export class DelibereByDateDataFilterPipe implements PipeTransform {

    transform(array: any[], data: number): any {

        // pre-compute some conditions to execute checks outside the loop

        let dD = data !== null ? new Date(data).getTime() : null;

        let results = _.filter(array, row => {
            if (dD && row.data !== dD ) return false;
            return true;
        });
        return results;

    }
}
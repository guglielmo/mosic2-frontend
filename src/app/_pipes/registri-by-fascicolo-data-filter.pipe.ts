import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'registriByFascicoloDataFilter'
})
export class RegistriByFascicoloDataFilterPipe implements PipeTransform {

    transform(array: any[], id_fascicoli: number): any {

        // no id_fascicoli, skip filtering
        if (id_fascicoli == null) {
            return array;
        }

        return _.filter(array, row => {
            // todo: change back to strict equality operator when fascicoli getAll returns a numeric id
            if (row.id_fascicoli != id_fascicoli) {
                return false;
            }

            return true;
        });

    }
}

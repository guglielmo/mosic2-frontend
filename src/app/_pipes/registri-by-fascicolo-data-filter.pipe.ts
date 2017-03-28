import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'registriByFascicoloDataFilter'
})
export class RegistriByFascicoloDataFilterPipe implements PipeTransform {

    transform(array: any[], id_fascicoli: number): any {

        // pre-compute some conditions to execute checks outside the loop
        const tL = id_fascicoli != null;
        return _.filter(array, row => {
            if (tL && row.id_fascicoli !== id_fascicoli) {
                return false;
            }

            return true;
        });

    }
}

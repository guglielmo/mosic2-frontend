import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';


@Pipe({name: 'dataEnum'})
export class DataEnumPipe implements PipeTransform {

    transform( id: any, dataseries: any, apipath: string, prop: string, separator: string = ', ' ): string {

        if (-1 !== String(id).indexOf(',') ) {
            const ret = [];
            String(id).split(',').forEach( item => {
                let retVal = _.get( dataseries, apipath + '["' + item + '"]' + prop, '');
                if(retVal) {
                    ret.push(retVal);
                }

            });
            return ret.join(separator);
        }

        let retVal = _.get( dataseries, apipath + '["' + id + '"]' + prop, '');
        return retVal;
    }
}

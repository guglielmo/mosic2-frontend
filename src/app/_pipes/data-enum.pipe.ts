import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";


@Pipe({name: 'dataEnum'})
export class DataEnumPipe implements PipeTransform {

    transform( id: any, dataseries: any, apipath: string, prop: string ) : string {

        if (-1 != String(id).indexOf(',') ) {
            let ret = [];
            String(id).split(',').forEach( item => {
                ret.push(_.get( dataseries, apipath+'["'+item+'"]'+prop, ''));
            });
            return ret.join(', ');
        }

        return _.get( dataseries, apipath+'["'+id+'"]'+prop, '');

    }
}
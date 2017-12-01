import { Pipe, PipeTransform } from '@angular/core';
import { APICommonService } from '../_services/index';
import * as _ from 'lodash';


@Pipe({name: 'dataEnum'})
export class DataEnumPipe implements PipeTransform {

    constructor(public apiService: APICommonService) {

    }

    transform( id: any, apipath: string, prop: string, separator: string = ', ' ): string {

        if (-1 !== String(id).indexOf(',') ) {
            const ret = [];
            String(id).split(',').forEach( item => {
                let retVal = _.get( this.apiService.dataEnum, apipath + '["' + item + '"]' + prop, '');
                if(retVal) {
                    ret.push(retVal);
                }

            });
            return ret.join(separator);
        }

        let retVal = _.get( this.apiService.dataEnum, apipath + '["' + id + '"]' + prop, '');
        return retVal;
    }
}

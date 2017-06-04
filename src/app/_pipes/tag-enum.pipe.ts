import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';


@Pipe({name: 'tagEnum'})
export class TagEnumPipe implements PipeTransform {

    private openTag: string = '<span class="ml-1 mb-1 badge badge-default text-left line-height-lg badge-lg-limit badge-tag">';
    private closeTag: string = '</span>';

    transform( id: any, dataseries: any, apipath: string, prop: string, separator: string = ', ' ): string {

        if (-1 !== String(id).indexOf(',') ) {
            const ret = [];
            String(id).split(',').forEach( item => {
                let retVal = _.get( dataseries, apipath + '["' + item + '"]' + prop, '');
                if(retVal) {
                    ret.push(this.openTag + retVal + this.closeTag);
                }

            });
            return ret.join(separator);
        }

        let retVal = _.get( dataseries, apipath + '["' + id + '"]' + prop, '');
        return this.openTag + retVal + this.closeTag;
    }
}

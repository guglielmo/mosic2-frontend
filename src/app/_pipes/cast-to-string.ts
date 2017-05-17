import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cast2string'})
export class Cast2String implements PipeTransform {

    transform( input: any[] ): any {

        if (Array.isArray(input)) {
            return input.join(',');
        }

        return input;
    }
}
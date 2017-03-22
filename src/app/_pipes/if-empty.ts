import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ifEmpty'})
export class IfEmptyPipe implements PipeTransform {

    transform( input: any, defaultValue: string ) : string {

        if (input === undefined || input === null) {
            return defaultValue;
        }

        return input;
    }
}
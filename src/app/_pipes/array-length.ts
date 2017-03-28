import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'arrayLength'})
export class ArrayLengthPipe implements PipeTransform {

    transform( input: any[] ): any {

        if (Array.isArray(input)) {
            return input.length;
        }

        return '';
    }
}
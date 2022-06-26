import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'additionalResult'
})
export class AdditionalResultPipe implements PipeTransform {

    transform(value: number): unknown {
        if (!value && value !== 0) {
            return '-';
        } else {
            return value * 10;
        }
    }

}

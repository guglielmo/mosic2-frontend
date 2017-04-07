import { NgModule }      from '@angular/core';
import { DisableFormControlDirective } from './disable-formcontrol.directive';

@NgModule({
    declarations: [
        DisableFormControlDirective
    ],
    exports: [
        DisableFormControlDirective
    ]
})
export class DisableFormControlModule {
}

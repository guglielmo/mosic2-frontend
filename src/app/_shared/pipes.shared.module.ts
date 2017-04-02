import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {
    FileSizePipe,
    DataMarkPipe,
    RegistriDataFilterPipe,
    FascicoliDataFilterPipe,
    FascicoliByTitolarioDataFilterPipe,
    RegistriByFascicoloDataFilterPipe,
    DataEnumPipe,
    ArrayLengthPipe

} from '../_pipes/index';

import { MomentModule } from 'angular2-moment';
import 'moment/locale/it';



@NgModule({
    imports: [
        CommonModule,
        MomentModule
    ],
    declarations: [
        FileSizePipe,
        DataMarkPipe,
        RegistriDataFilterPipe,
        FascicoliDataFilterPipe,
        FascicoliByTitolarioDataFilterPipe,
        RegistriByFascicoloDataFilterPipe,
        DataEnumPipe,
        ArrayLengthPipe
    ],
    providers: [
    ],
    exports: [
        FileSizePipe,
        DataMarkPipe,
        RegistriDataFilterPipe,
        FascicoliDataFilterPipe,
        FascicoliByTitolarioDataFilterPipe,
        RegistriByFascicoloDataFilterPipe,
        DataEnumPipe,
        ArrayLengthPipe,
        MomentModule
    ]
})
export class PipesSharedModule {}


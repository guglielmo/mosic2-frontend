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

@NgModule({
    imports: [
        CommonModule
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
        ArrayLengthPipe
    ]
})
export class PipesSharedModule {}


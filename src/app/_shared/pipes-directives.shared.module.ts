import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StickThead, StickToolbar, Scroll2Bottom, Widget, DisableFormControlDirective, Autosize, MatchHeightDirective } from '../_directives/index';


import {
    FileSizePipe,
    DataMarkPipe,
    RegistriDataFilterPipe,
    FascicoliDataFilterPipe,
    FascicoliByTitolarioDataFilterPipe,
    RegistriByFascicoloDataFilterPipe,
    DelibereByDateDataFilterPipe,
    FirmatariDataFilterPipe,
    DenominazioneDataFilterPipe,
    UsersDataFilterPipe,
    DataEnumPipe,
    TagEnumPipe,
    ArrayLengthPipe,
    DelibereDataFilterPipe,
    AdempimentiDataFilterPipe,
    Cast2String,
    LodashDataFilterPipe

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
        DelibereByDateDataFilterPipe,
        FirmatariDataFilterPipe,
        DenominazioneDataFilterPipe,
        UsersDataFilterPipe,
        DataEnumPipe,
        TagEnumPipe,
        ArrayLengthPipe,
        DelibereDataFilterPipe,
        AdempimentiDataFilterPipe,
        Cast2String,
        Autosize,
        MatchHeightDirective,
        StickThead,
        StickToolbar,
        Scroll2Bottom,
        Widget,
        DisableFormControlDirective,
        LodashDataFilterPipe
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
        DelibereByDateDataFilterPipe,
        FirmatariDataFilterPipe,
        DenominazioneDataFilterPipe,
        UsersDataFilterPipe,
        DataEnumPipe,
        TagEnumPipe,
        ArrayLengthPipe,
        DelibereDataFilterPipe,
        AdempimentiDataFilterPipe,
        Cast2String,
        MomentModule,
        Autosize,
        MatchHeightDirective,
        StickThead,
        StickToolbar,
        Scroll2Bottom,
        Widget,
        DisableFormControlDirective,
        LodashDataFilterPipe
    ]
})
export class PipesDirectivesSharedModule {}


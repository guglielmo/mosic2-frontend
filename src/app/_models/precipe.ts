import { Allegati } from './allegati';
import { PrecipeOdg } from './precipe_odg';

export class Precipe {
    id: number;             // INT(10)
    data: string;
    ufficiale_riunione: string;
    precipe_odg: PrecipeOdg[];
    allegati_TLX: Allegati[];
    allegati_APG: Allegati[];
    allegati_OSS: Allegati[];

    constructor() {
        this.id = null;
        this.data = null;
        this.ufficiale_riunione = '0';
        this.precipe_odg = [];
        this.allegati_TLX = [];
        this.allegati_APG = [];
        this.allegati_OSS = [];
    }
}




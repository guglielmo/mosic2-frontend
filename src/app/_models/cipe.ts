import { Allegati } from './allegati';
import { CipeOdg } from './cipe_odg';

export class Cipe {
    id: number;             // INT(10)
    data: string;
    ufficiale_riunione: string;
    cipe_odg: CipeOdg[];
    allegati_TLX: Allegati[];
    allegati_APG: Allegati[];
    allegati_OSS: Allegati[];
    allegati_ESI: Allegati[];

    constructor() {
        this.id = null;
        this.data = null;
        this.ufficiale_riunione = '0';
        this.cipe_odg = [];
        this.allegati_TLX = [];
        this.allegati_APG = [];
        this.allegati_OSS = [];
        this.allegati_ESI = [];
    }
}




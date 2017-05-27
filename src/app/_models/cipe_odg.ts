import { Allegati } from './allegati';

export class CipeOdg {
    id: number;
    id_cipe: number;
    progressivo: number;
    id_titolari: number;
    id_fascicoli: number;
    id_registri: number[];
    id_argomenti: number;
    id_uffici: string;
    ordine: string;
    denominazione: string;
    risultanza: number;
    numero_delibera: number;
    annotazioni: string;
    stato: number;
    allegati: any;
    allegati_esclusi: number[];
    allegati_esclusi_approvati: number[];
    edit: boolean;
    
    constructor() {
        this.id = null;
        this.id_cipe = null;
        this.progressivo = null;
        this.id_titolari = null;
        this.id_fascicoli = null;
        this.id_registri = [];
        this.id_argomenti = null;
        this.id_uffici = null;
        this.ordine = null;
        this.denominazione = null;
        this.risultanza = null;
        this.numero_delibera = null;
        this.annotazioni = null;
        this.stato = null;
        this.allegati = {};
        this.allegati_esclusi = [];
        this.allegati_esclusi_approvati = [];
        this.edit = true;
    }
}

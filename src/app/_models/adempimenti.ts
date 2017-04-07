export class Adempimenti {
    id: number;
    id_delibera: number;
    descrizione_codificata: number;
    descrizione_estesa: string;
    fonti: number;
    data_scadenza: string;
    vincolante: number;
    esito: number;
    note: string;

    constructor() {
        this.id = null;
        this.id_delibera = null;
        this.descrizione_codificata = null;
        this.descrizione_estesa = null;
        this.fonti = null;
        this.data_scadenza = null;
        this.vincolante = null;
        this.esito = null;
        this.note = null;
    }
}




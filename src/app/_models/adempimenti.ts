export class Adempimenti {
    id: number;
    id_delibere: number;
    descrizione: string;
    codice_descrizione: number;
    codice_fonte: number;
    codice_esito: number;
    fonti: number;
    data_scadenza: number;
    vincolo: number;
    note: string;

    constructor() {
        this.id = null;
        this.id_delibere = null;
        this.descrizione = null;
        this.codice_descrizione = null;
        this.codice_fonte = null;
        this.codice_esito = null;
        this.fonti = null;
        this.data_scadenza = null;
        this.vincolo = null;
        this.note = null;
    }
}

/*{
    "codice": 1,
    "progressivo": 1,
    "codice_scheda": 616,
    "data_scadenza": "",
    "giorni_scadenza": 0,
    "mesi_scadenza": 0,
    "anni_scadenza": 0,
    "utente": 0,
    "data_modifica": 1412632800000
},*/




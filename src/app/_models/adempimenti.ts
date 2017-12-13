export class Adempimenti {
    id: number;
    id_delibere: number;
    descrizione: string;
    data_scadenza: number;
    periodicita: number;
    pluriennalita: number;
    note: string;
    tipologia: number;
    azione: number;
    ambito: number;
    localizzazione: string;
    struttura: string;
    seduta: number;
    materia: string;
    argomento: string;
    cup: number;
    id_soggetti: number[];
    scadenze: any[];
    codice_esito: number;
    superato: number;

    scaduti: number;
    ottemperati: number;
    totale_scadenze: number;
    time_diff: number;

    data_delibera: number;
    numero_delibera: number;
    argomento_delibera: string;

    constructor() {
        this.id = null;
        this.id_delibere = null;
        this.descrizione = '';
        this.data_scadenza = null;
        this.periodicita = null;
        this.pluriennalita = null;
        this.note = '';
        this.tipologia = null;
        this.azione = null;
        this.ambito = null;
        this.localizzazione = '';
        this.struttura = '';
        this.seduta = null;
        this.materia = '';
        this.argomento = '';
        this.cup = null;
        this.id_soggetti = [];
        this.scadenze = [];
        this.codice_esito = null;
        this.superato = 0;
    }
}


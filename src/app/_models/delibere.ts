import { Allegati } from './allegati';

export class Delibere {
    id: number;
    data: string;
    numero: number;
    stato: number;
    tipologia: number;
    argomento: string;
    uffici: number[];
    allegati: Allegati[];
    finanziamento: number;
    annotazioni: string;
    appunti_di_servizio: string;

    constructor() {
        this.id = null;
        this.data = null;
        this.numero = null;
        this.stato = null;
        this.tipologia = null;
        this.argomento = null;
        this.uffici = [];
        this.allegati = [];
        this.finanziamento = null;
        this.annotazioni = null;
        this.appunti_di_servizio = null;
    }
}




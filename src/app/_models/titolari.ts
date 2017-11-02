export class Titolari {
    id: number;
    codice: string;
    denominazione: string;
    descrizione: string;
    id_uffici: number;

    constructor(id?: number) {
        this.id = id;
        this.codice = null;
        this.denominazione = null;
        this.descrizione = null;
        this.id_uffici = null;
    }
}
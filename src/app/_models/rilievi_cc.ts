export class RilieviCC {
    data_rilievo: number;
    data_risposta: number;
    giorni_rilievo: number;
    id: number;
    id_delibere: number;
    note_rilievo: string;
    numero_rilievo: number;
    numero_risposta: number;
    tipo_documento: number;
    tipo_rilievo: number;

    constructor() {
        this.id = null;
        this.id_delibere = null;
        this.giorni_rilievo = null;
        this.tipo_documento = null;
        this.tipo_rilievo = null;
        this.data_rilievo = null;
        this.numero_rilievo = null;
        this.data_risposta = null;
        this.numero_risposta = null;
        this.note_rilievo = null;
    }
}

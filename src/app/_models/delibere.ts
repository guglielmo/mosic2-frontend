import { Allegati } from "./allegati";
import { RilieviCC } from "./rilievi_cc";

export class Delibere {
    "id": number;
    "data": number;
    "numero": number;
    "id_stato": number;
    "argomento": string;
    "note": string;
    "note_servizio": string;
    "scheda": number;
    "finanziamento": string;
    "data_consegna": number;

    "id_direttore": number;
    "data_direttore_invio": number;
    "data_direttore_ritorno": number;
    "note_direttore": string;

    "invio_mef": number;
    "data_mef_invio": number;
    "data_mef_pec": number;
    "data_mef_ritorno": number;
    "note_mef": string;

    "id_segretario": number;
    "data_segretario_invio": number;
    "data_segretario_ritorno": number;
    "note_segretario": string;

    "id_presidente": number;
    "data_presidente_invio": number;
    "data_presidente_ritorno": number;
    "note_presidente": string;

    "data_invio_cc": number;
    "numero_cc": number;
    "data_registrazione_cc": number;
    "id_registro_cc": number;
    "foglio_cc": number;
    "tipo_registrazione_cc": number;
    "note_cc": string;

    "data_invio_p": number;
    "note_p": string;

    "data_invio_gu": number;
    "numero_invio_gu": number;
    "tipo_gu": number;
    "data_gu": number;
    "numero_gu": number;
    "data_ec_gu": number;
    "numero_ec_gu": number;
    "data_co_gu": number;
    "numero_co_gu": number;
    "pubblicazione_gu": number;
    "note_gu": string;

    "id_uffici": number[];
    "id_segretariato": number[];
    "id_tags": string;

    "allegati_MEF": Allegati[];
    "allegati_CC": Allegati[];
    "allegati_GU": Allegati[];
    "allegati_DEL": Allegati[];
    "allegati_ALL": Allegati[];
    "rilievi_CC": RilieviCC[];

    "giorni_iter": any;

    constructor() {
        this.id = null;
        this.data = null;
        this.numero = null;
        this.id_stato = null;
        this.argomento = "";
        this.note = "";
        this.note_servizio = "";
        this.scheda = null;
        this.finanziamento = "";
        this.data_consegna = null;
        this.id_direttore = null;
        this.data_direttore_invio = null;
        this.data_direttore_ritorno = null;
        this.note_direttore = "";
        this.invio_mef = null;
        this.data_mef_invio = null;
        this.data_mef_pec = null;
        this.data_mef_ritorno = null;
        this.note_mef = "";
        this.id_segretario = null;
        this.data_segretario_invio = null;
        this.data_segretario_ritorno = null;
        this.note_segretario = "";
        this.id_presidente = null;
        this.data_presidente_invio = null;
        this.data_presidente_ritorno = null;
        this.note_presidente = "";
        this.data_invio_cc = null;
        this.numero_cc = null;
        this.data_registrazione_cc = null;
        this.id_registro_cc = null;
        this.foglio_cc = null;
        this.tipo_registrazione_cc = null;
        this.note_cc = "";
        this.data_invio_p = null;
        this.note_p = "";
        this.data_invio_gu = null;
        this.numero_invio_gu = null;
        this.tipo_gu = null;
        this.data_gu = null;
        this.numero_gu = null;
        this.data_ec_gu = null;
        this.numero_ec_gu = null;
        this.data_co_gu = null;
        this.numero_co_gu = null;
        this.pubblicazione_gu = null;
        this.note_gu = "";
        this.id_uffici = [];
        this.id_segretariato = [];
        this.id_tags = "";
        this.allegati_MEF = [];
        this.allegati_CC = [];
        this.allegati_GU = [];
        this.allegati_DEL = [];
        this.allegati_ALL = [];
        this.rilievi_CC = [];
        this.giorni_iter = {};
    }
}

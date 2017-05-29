import { Allegati } from './allegati';

export class Registri {
    id: number; // INT(10)
    data_arrivo: string; // DATETIME
    protocollo_arrivo: string; // VARCHAR(255)
    data_mittente: string; // DATETIME
    protocollo_mittente: string; // VARCHAR(255)
    oggetto: string; // VARCHAR(255)
    id_amministrazioni: number; // INT(11)
    mittenti: number; // INT(11)
    titolario: number; // INT(11)
    numero_fascicolo: number; // INT(11)
    numero_sottofascicolo: number; // INT(11)
    proposta_cipe: number; // TINYINT(1)
    annotazioni: number; // INT(11)
    tags: number; // INT(11)
    allegati: Allegati; // INT(11)
    sottofascicoli_id: number; // INT(10)
    mittenti_id: number; // INT(10)
    id_titolari: number; // INT(10)
    id_tags: string;
}
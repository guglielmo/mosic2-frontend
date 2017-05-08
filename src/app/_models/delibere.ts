import { Allegati, RilieviCC } from './index';

export class Delibere {
    "id": number;
    "data": number;
    "numero": number;
    "id_stato": number;
    "argomento": string;
    "note": string;
    "note_servizio": string;
    "scheda": number;
    "data_consegna": number;

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
    "data_registrazione_cc":number;
    "id_registro_cc": number;
    "foglio_cc": number;
    "note_cc": string;

    "rilievi_CC": RilieviCC[];

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
    "id_segretariato": number[]
}


/*



 Numero_Verbale
 Codice_Settore
 Codice_Tipologia
 Finanziamento

 Codice_Funzionario
 Codice_Funzionario2
 Codice_Funzionario3
 Data_Consegna
 Consegna_Scheda
 Nota_Consegna

 Codice_Direttore
 Data_DirettoreInvio
 Data_DirettoreRitorno
 Nota_Direttore

 Invio_Ragioneria
 Data_RagioneriaInvio
 Data_RagioneriaRitorno
 Nota_Ragioneria

 Invio_Mef
 Data_MefInvio
 Data_MefPec
 Data_MefRitorno
 Osservazioni_Mef
 Nota_Mef

 Codice_Segretario
 Data_SegretarioInvio
 Data_SegretarioRitorno
 Nota_Segretario

 Codice_Presidente
 Data_PresidenteInvio
 Data_PresidenteRitorno
 Nota_Presidente

 Codice_Ufficio
 Codice_Ufficio2
 Codice_Ufficio3

 Allegato_1
 Allegato_2
 Allegato_3

 Codice_StatoDelibera


 Nota_CC
 Tipo_DocumentoCC
 Numero_InvioCC
 Data_InvioCC
 Numero_RilievoCC
 Data_RilievoCC
 Numero_RispostaCC
 Data_RispostaCC
 Tipo_Rilievo
 Nota_RilievoCC
 Tipo_DocumentoCC2
 Numero_RilievoCC2
 Data_RilievoCC2
 Numero_RispostaCC2
 Data_RispostaCC2
 Tipo_Rilievo2
 Nota_RilievoCC2
 Tipo_DocumentoCC3
 Numero_RilievoCC3
 Data_RilievoCC3
 Numero_RispostaCC3
 Data_RispostaCC3
 Tipo_Rilievo3
 Nota_RilievoCC3

 Data_ConferenzaStatoRegioni
 Numero_ConferenzaStatoRegioni
 Nota_ConferenzaStatoRegioni
 File_ConferenzaStatoRegioni
 A_Data_ConferenzaStatoRegioni
 A_Numero_ConferenzaStatoRegioni
 A_Nota_ConferenzaStatoRegioni
 A_File_ConferenzaStatoRegioni

 Data_ConferenzaUnificata
 Numero_ConferenzaUnificata
 Nota_ConferenzaUnificata
 File_ConferenzaUnificata
 A_Data_ConferenzaUnificata
 A_Numero_ConferenzaUnificata
 A_Nota_ConferenzaUnificata
 A_File_ConferenzaUnificata

 Data_CommissioneParlamentare
 Numero_CommissioneParlamentare
 Nota_CommissioneParlamentare
 File_CommissioneParlamentare
 A_Data_CommissioneParlamentare
 A_Numero_CommissioneParlamentare
 A_Nota_CommissioneParlamentare
 A_File_CommissioneParlamentare

 Data_Parlamento
 Nota_Parlamento
 File_Parlamento

 Registro_RegistrazioneCC
 Foglio_RegistrazioneCC
 Data_RegistrazioneCC

 Numero_InvioGU
 Data_InvioGU
 Tipo_GU
 Numero_GU
 Data_GU
 Nota_GU

 Numero_EC
 Data_EC
 Numero_Co
 Data_Co



 Tipo_Registrazione
 Tipo_Pubblicazione
 Inviata_Ragioneria



 Giorni_RilievoCC
 Giorni_RilievoCC2
 Giorni_RilievoCC3
 */

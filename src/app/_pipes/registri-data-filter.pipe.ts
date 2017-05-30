import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "registriDataFilter"
})
export class RegistriDataFilterPipe implements PipeTransform {

    transform(array: any[],
              args: any[]): any {

        // pardon the ugly hack but angular 2.4 supports up to 10 pipe parameters, and here we need 12
        let id = args[0];
        let oggetto = args[1];
        let id_titolari = args[2];
        let id_mittenti = args[3];
        let protocollo_mittente = args[4];
        let protocollo_arrivo = args[5];
        let id_fascicoli = args[6];
        let data_arrivo_da = args[7];
        let data_arrivo_a = args[8];
        let id_tags = args[9];
        let filteredCount = args[10];
        // end ugly hack

        let keys = oggetto.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let tL = id_titolari != null;
        let mL = id_mittenti != null;
        let pM = protocollo_mittente.length;
        let pA = protocollo_arrivo.length;
        let fL = id_fascicoli != null;
        let dF = data_arrivo_da ? new Date(data_arrivo_da).getTime() : false;
        let dT = data_arrivo_a ? new Date(data_arrivo_a).getTime() : false;
        let qL = oggetto.length > 2;
        let iT = id_tags != null;

        let result = _.filter(array, row => {
            if (id && row.id != id) return false;
            if (tL && row.id_titolari != id_titolari) return false;
            if (mL && row.id_mittenti != id_mittenti) return false;
            if (pM && row.protocollo_mittente != protocollo_mittente) return false;
            if (pA && row.protocollo_arrivo != protocollo_arrivo) return false;
            if (fL && row.id_fascicoli != id_fascicoli) return false;
            if (dF && row.data_arrivo < dF) return false;
            if (dT && row.data_arrivo > dT) return false;
            if (iT && row.id_tags.indexOf(Number(id_tags)) === -1) return false;
            if (qL) {
                for (i = 0; i < keysLen; i++) {
                    if ((row.oggetto.toUpperCase()).indexOf((keys[i])) == -1) {
                        return false;
                    }
                }
            }
            return true;
        });

        filteredCount.count = result.length;
        return result;

    }
}
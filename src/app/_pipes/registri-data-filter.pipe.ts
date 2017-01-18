import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "registriDataFilter"
})
export class RegistriDataFilterPipe implements PipeTransform {

    transform(array: any[],
              id: string,
              oggetto: string,
              id_titolari: number,
              mittente: number,
              protocollo_mittente: string,
              protocollo_arrivo: string,
              numero_fascicolo: number,
              data_arrivo_da: number,
              data_arrivo_a: number): any {



        let keys = oggetto.toUpperCase().split(' ');
        let keysLen = keys.length;
        let i;

        // pre-compute some conditions to execute checks outside the loop
        let qL = oggetto.length > 2;
        let tL = id_titolari != -1;
        let mL = mittente != -1;
        let fL = numero_fascicolo > 0;

        return _.filter(array, row => {
            if (id && row.id != id) return false;
            if (tL && row.id_titolari != id_titolari) return false;
            if (mL && row.mittente != mittente) return false;
            if (fL && row.numero_fascicolo != numero_fascicolo) return false;
            if (qL) {
                for (i = 0; i < keysLen; i++) {
                    if ((row.oggetto.toUpperCase()).indexOf((keys[i])) == -1) {
                        return false;
                    }
                }
            }

            return true;
        });

    }
}
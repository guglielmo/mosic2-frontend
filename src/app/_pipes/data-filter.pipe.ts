import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => row.argomento.indexOf(query) > -1);
        }
        return array;
    }

    markMatch(text: string, term: string): any {
        let res, reg, words = [], val = $.trim(term.replace(/[<>]?/g, ""));
        if (val.length > 0) {
            words = val.split(" ");
            reg = new RegExp("(?![^<]+>)(" + words.join("|") + ")", "ig");
            res = text.replace(reg, "<span class='select2-rendered__match'>$&</span>");
        }
        return words.length > 0 ? $('<span>' + res + '</span>') : $('<span>' + text + '</span>');
    }

    matcher(term: string, text: string, option: any): boolean {
        if (term.trim() === '') {
            return true;
        }
        let keywords = term.split(' ');

        for (var i = 0; i < keywords.length; i++) {

            if ((text.toUpperCase()).indexOf((keywords[i]).toUpperCase()) == -1) {
                return false;
            }
        }
        return true;
    }
}
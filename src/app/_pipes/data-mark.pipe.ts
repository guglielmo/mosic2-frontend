import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dataMark"
})
export class DataMarkPipe implements PipeTransform {

    transform(text: string, query: string): any {
        if (query.length > 2) {
            return this.markMatch(text, query);
        }
        return text;
    }

    markMatch(text: string, term: string): any {
        if(typeof text === 'string') {
            let res, reg, words = [], val = $.trim(term.replace(/[<>]?/g, ""));
            if (val.length > 0) {
                words = val.split(" ");
                reg = new RegExp("(?![^<]+>)(" + words.join("|") + ")", "ig");
                res = text.replace(reg, "<strong><u>$&</u></strong>");
            }
            return res;
        } else {
            return text;
        }
    }
}
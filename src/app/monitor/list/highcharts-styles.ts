export class HighChartStyles {

    public base(): Object {

        const o = {
            "credits": {
                "href": "",
                "text": ""
            },
            "plotOptions": {
                "series": {
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function () {
                            return this.y != 0 ? this.y : null;
                        }
                    }
                },
                "columnrange": {
                    "borderRadius": -1
                }
            },
            "lang": {
                loading: 'Sto caricando...',
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                weekdays: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Venerdì', 'Sabato', 'Domenica'],
                shortMonths: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lugl', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                exportButtonTitle: "Esporta",
                printButtonTitle: "Importa",
                rangeSelectorFrom: "Da",
                rangeSelectorTo: "A",
                rangeSelectorZoom: "Periodo",
                downloadPNG: 'Download immagine PNG',
                downloadJPEG: 'Download immagine JPEG',
                downloadPDF: 'Download documento PDF',
                downloadSVG: 'Download immagine SVG',
                printChart: 'Stampa grafico',
                thousandsSep: ".",
                decimalPoint: ','
            }
        };
        return o;
    }

    public multicolumn(categories: string[] = [], height: number = 620 ): Object {

        const o = {
            "chart": {
                "type": "column",
                "height": height
            },
            "legend": {
                itemMarginTop: 5,
                itemMarginBottom: 5
            },
            "xAxis": {
                "categories": categories,
                "allowDecimals": false,
            },
            "yAxis": {
                "allowDecimals": false,
                "min": 0
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            tooltip: {
                formatter: function () {
                    let name;
                    let s = '<b style="font-size: 14px">' + this.x + '</b>';
                    s += '<table>';
                    $.each(this.points, function () {
                        if(this.y > 0) {
                            name = this.series.name.indexOf('-') !== -1 ? this.series.name : this.series.name +' - da inviare';
                            s += '<tr><td>' + name + '</td><td style="text-align: right; padding-left: 10px;">' + this.y + '</td></tr>';
                        }
                    });
                    s += '</table>';
                    return s;
                },
                shared: true,
                useHTML: true
            },
            "series": []
        };
        return o;
    }

    public multiline(categories: string[] = [], height: number = 620): Object {
        const o =  {
            chart: {
                type: 'spline',
                "height": height
            },
            xAxis: {
                "categories": categories,
                title: {
                    text: 'Data'
                }
            },
            yAxis: {
                min: 0
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    var s = '<b style="font-size: 14px">' + this.x + '</b>';
                    s += '<table>';
                    $.each(this.points, function () {
                        s += '<tr><td>' + this.series.name + '</td><td style="text-align: right; padding-left: 10px;">' + this.y + '</td></tr>';
                    });
                    s += '</table>';
                    return s;
                },
                shared: true,
                useHTML: true
            },
            series: []
        };
        return o;
    }

    public multibar(categories: string[] = [], height: number = 620): Object {
        const o = {
            "chart": {
                "type": "bar",
                "height": height
            },
            title: {
                text: 'Giorni per fase dell\'iter'
            },
            "legend": {
                itemMarginTop: 5,
                itemMarginBottom: 5,
                reversed: true
            },
            "xAxis": {
                "categories": categories,
                "title": {
                    "text": 'Nr. delibera'
                },
            },
            "yAxis": {
                "allowDecimals": false,
                "title": {
                    "text": 'Giorni'
                },
                "min": 0
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            tooltip: {
                formatter: function () {
                    let name;
                    let s = '<b style="font-size: 14px">' + this.x + '</b>';
                    s += '<table>';
                    $.each(this.points, function () {
                        if(this.y > 0) {
                            //name = this.series.name.indexOf('-') !== -1 ? this.series.name : this.series.name +' - da inviare';
                            s += '<tr><td>' + this.series.name + '</td><td style="text-align: right; padding-left: 10px;">' + this.y + '</td></tr>';
                        }
                    });
                    s += '</table>';
                    return s;
                },
                shared: true,
                useHTML: true
            },
            "series": []
        };
        return o;
    }
}
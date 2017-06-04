import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { HighChartStyles } from './highcharts-styles';

import { Cipe } from '../../_models/cipe';
import { APICommonService } from '../../_services/index';

import * as _ from 'lodash';


@Component({
    templateUrl: 'monitor-list.component.html'
})
export class MonitorListComponent implements OnInit {

    chart: any;
    chartOptions: Object;

    public model: any = [];

    public monitor: any;
    public monitor_group: any;

    public mode: string = 'group';

    public firstYear = 2007;
    public currentYear: number = Number(new Date().getFullYear());
    public years: number[] = [];

    public viewtype: string = 'situazione';
    public dateFilter: string = '';

    public filter = {
        anno: this.currentYear,
        data_cipe: ''
    };

    filteredCount = {count: 0};

    public cipe$: Observable<Cipe[]>;
    public monitor$: Observable<any[]>;
    public monitor_group$: Observable<any[]>;

    constructor(public apiService: APICommonService,
                private router: Router,
                private route: ActivatedRoute,
    ) {

        this.cipe$ = this.apiService.subscribeToDataService('cipe');
        this.monitor$ = this.apiService.subscribeToDataService('monitor');
        this.monitor_group$ = this.apiService.subscribeToDataService('monitor/group');

        this.monitor$.subscribe( data => this.initMonitor(data));
        this.monitor_group$.subscribe( data => this.initMonitorGroup(data));

        for (let i = this.currentYear; i >= this.firstYear; i--) {
            this.years.push(i);
        }

    }

    ngOnInit() {
        this.apiService.refreshCommonCache();

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd && event.url.indexOf('monitor') != -1) {

                this.viewtype = this.route.snapshot.params['viewtype'];
                this.dateFilter = this.route.snapshot.params['dateFilter'];

                //console.log('dateFilter', this.dateFilter);

                if (this.dateFilter && this.dateFilter.length === 4) {

                    this.mode = 'group';
                    this.filter.anno = Number(this.dateFilter);

                } else if (this.dateFilter && this.dateFilter.length === 10) {

                    this.mode = 'detail';
                    let d = new Date(this.dateFilter);
                    d.setHours(0,0,0,0);
                    let year = d.getFullYear();
                    const ts = d.getTime();
                    this.filter.anno = year;
                    this.filter.data_cipe = String(ts);

                } else {

                    this.mode = 'group';
                }

                this.chartOptions = this.getChartOptions();

            }
        });
    }

    initMonitor(data:any) {
        this.monitor = data;
        this.chartOptions = this.getChartOptions();
    }

    initMonitorGroup(data:any) {
        this.monitor_group = data;
        this.chartOptions = this.getChartOptions();
    }

    public resetFilters(event): void {
        event.stopPropagation();
        this.filter = {
            anno: null,
            data_cipe: ''
        };
    }

    public onYearChanged(year) {
        this.router.navigate(['/app/monitor/'+this.viewtype+'/'+year]);
    }

    public onDataCipeChanged(date) {
        this.router.navigate(['/app/monitor/'+this.viewtype+'/'+this.apiService.transformDate(date,'y-MM-dd')]);
    }

    public onViewTypeChange( viewtype: string ) {
        if (this.dateFilter) {

            if(this.dateFilter.length === 10 && viewtype === 'situazione') {
                    this.router.navigate(['/app/delibere/firme/'+this.dateFilter]);
            } else {
                this.router.navigate(['/app/monitor/'+viewtype+'/'+this.dateFilter]);
            }

        } else {
            this.router.navigate(['/app/monitor/'+viewtype]);
        }
    }

    public sumSeriesGroup(series: any, viewtype: string, item: string) {
        return _.sumBy(series, function(o) { return o[viewtype][item]; });
    }

    public sumSeries(series: any, item: string) {
        return _.sumBy(series, function(o) { return o[item]; });
    }

    public avgSeriesGroup(series: any, viewtype: string, item: string) {
        const l = series.length;
        const sum = _.sumBy(series, function(o) { return o[viewtype][item]; });
        return Math.round(sum/l);
    }

    public avgSeries(series: any, item: string) {
        const l = series.length;
        const sum = _.sumBy(series, function(o) { return o[item]; });
        return Math.round(sum/l);
    }

    public saveChartInstance(chartInstance: Object) {
        this.chart = chartInstance;
    }

    public getChartOptions(): Object {

        let chartOptions = {};
        const HCS = new HighChartStyles();
        let dataSeries = [];

        console.log('getChartOptions',this.mode, this.viewtype, this.filter.data_cipe);

        switch (this.mode) {
            case 'group':
                const year = _.filter(this.monitor_group, ['id',this.filter.anno]);
                //const year = _.filter(this.monitor_group, function(o) { return o.id > 2007; });

                switch (this.viewtype) {
                    case 'situazione':

                        const acq = { name: 'Da acquisire -', data: [], stack: 'acq', color: '#7cb5ec' };
                        const cd_i = { name: 'Capo Dipartimento', data: [], stack: 'cd', color: '#434348' };
                        const cd_r = { name: 'Capo Dipartimento - in firma', data: [], stack: 'cd', linkedTo:':previous', color: '#797980' };
                        const mef_i = { name: 'M.E.F.', data: [], stack: 'mef', color: '#90ed7d' };
                        const mef_r = { name: 'M.E.F. - in firma', data: [], stack: 'mef', linkedTo:':previous', color: '#d1ffc7' };
                        const seg_i = { name: 'Segretario', data: [], stack: 'seg', color: '#f7a35c' };
                        const seg_r = { name: 'Segretario - in firma', data: [], stack: 'seg', linkedTo:':previous', color: '#ffc799' };
                        const pre_i = { name: 'Presidente', data: [], stack: 'pre', color: '#8085e9' };
                        const pre_r = { name: 'Presidente - in firma', data: [], stack: 'pre', linkedTo:':previous', color: '#abafff' };
                        const cc_i = { name: 'Corte dei Conti', data: [], stack: 'cc', color: '#f15c80' };
                        const cc_r = { name: 'Corte dei Conti - da registrare', data: [], stack: 'cc', linkedTo:':previous', color: '#ffabc0' };
                        const gu_i = { name: 'Gazzetta Ufficiale', data: [], stack: 'gu', color: '#e4d354' };
                        const gu_r = { name: 'Gazzetta Ufficiale - da pubblicare', data: [], stack: 'gu', linkedTo:':previous', color: '#fff2ab' };
                        let catSituazione = [];

                        _.forEach(year, (val) => {
                            _.forEach(val.group, (group) => {

                                //console.log(group);
                                catSituazione.push(this.apiService.transformDate(group.id,'dd/MM/y'));
                                acq.data.push([group.situazione.da_acquisire]);
                                cd_i.data.push([group.situazione.CD_inviare]);
                                mef_i.data.push([group.situazione.MEF_inviare]);
                                seg_i.data.push([group.situazione.SEG_inviare]);
                                pre_i.data.push([group.situazione.PRE_inviare]);
                                cc_i.data.push([group.situazione.CC_inviare]);
                                gu_i.data.push([group.situazione.GU_inviare]);

                                cd_r.data.push([group.situazione.CD_firma]);
                                mef_r.data.push([group.situazione.MEF_firma]);
                                seg_r.data.push([group.situazione.SEG_firma]);
                                pre_r.data.push([group.situazione.PRE_firma]);
                                cc_r.data.push([group.situazione.CC_firma]);
                                gu_r.data.push([group.situazione.GU_firma]);
                            })
                        });

                        dataSeries.push(acq, cd_i, cd_r, mef_i, mef_r, seg_i, seg_r, pre_i, pre_r, cc_i, cc_r, gu_i, gu_r);
                        chartOptions = $.extend(true, HCS.base(), HCS.multicolumn(catSituazione),
                            {
                                series: dataSeries,
                                title: {
                                    text: 'Situazione per fase dell\'iter - CIPE del ' + this.filter.anno
                                },
                                xAxis: {
                                    title: {
                                        text: 'Data CIPE'
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: 'Nr. giorni'
                                    }
                                }
                            }
                        );

                        //console.log(chartOptions);
                        break;

                    case 'statistica':

                        const arrivo = { name: 'Arrivo', data: [], color: '#7cb5ec' };
                        const dipe = {name: 'Segreteria DIPE', data: [], color: '#2b908f' };
                        const cd = { name: 'Capo Dipartimento', data: [], color: '#434348' };
                        const mef = { name: 'M.E.F.', data: [], color: '#90ed7d' };
                        const seg = { name: 'Segretario', data: [], color: '#f7a35c' };
                        const pre = { name: 'Presidente', data: [], color: '#8085e9' };
                        const cc = { name: 'Corte dei Conti', data: [], color: '#f15c80' };
                        const gu = { name: 'Gazzetta Ufficiale', data: [], color: '#e4d354' };
                        const catStatistica = [];

                        _.forEach(year, (val) => {
                            _.forEach(val.group, (group) => {
                                catStatistica.push(this.apiService.transformDate(group.id,'dd/MM/y'));
                                arrivo.data.push([group.statistica.arrivo]);
                                dipe.data.push(
                                    group.statistica.cd_invio_giorni +
                                    group.statistica.mef_invio_giorni +
                                    group.statistica.seg_invio_giorni +
                                    group.statistica.pre_invio_giorni +
                                    group.statistica.cc_invio_giorni +
                                    group.statistica.gu_invio_giorni
                                );
                                cd.data.push([group.statistica.cd_ritorno_giorni]);
                                mef.data.push([group.statistica.mef_ritorno_giorni]);
                                seg.data.push([group.statistica.seg_ritorno_giorni]);
                                pre.data.push([group.statistica.pre_ritorno_giorni]);
                                cc.data.push([group.statistica.cc_ritorno_giorni]);
                                gu.data.push([group.statistica.gu_ritorno_giorni]);
                            })
                        });

                        dataSeries.push(arrivo, dipe, cd,mef,seg,pre,cc,gu);
                        chartOptions = $.extend(true, HCS.base(), HCS.multiline(catStatistica),
                            {
                                series: dataSeries,
                                title: {
                                    text: 'Numero di giorni per fase dell\'iter - media per CIPE'
                                },
                                xAxis: {
                                    title: {
                                        text: 'Data CIPE'
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: 'Nr. giorni'
                                    }
                                }
                            }
                        );
                        break;

                    case 'analisi':

                        const A_arrivo = { name: 'Arrivo', data: [], color: '#7cb5ec' };
                        const A_cd = { name: 'Capo Dipartimento', data: [], color: '#434348' };
                        const A_mef = { name: 'M.E.F.', data: [], color: '#90ed7d' };
                        const A_seg = { name: 'Segretario', data: [], color: '#f7a35c' };
                        const A_pre = { name: 'Presidente', data: [], color: '#8085e9' };
                        const A_cc = { name: 'Corte dei Conti', data: [], color: '#f15c80' };
                        const A_gu = { name: 'Gazzetta Ufficiale', data: [], color: '#e4d354' };
                        const catAnalisi = [];

                        _.forEach(year, (val) => {
                            _.forEach(val.group, (group) => {
                                catAnalisi.push(this.apiService.transformDate(group.id,'dd/MM/y'));
                                A_arrivo.data.push([group.analisi.consegna_media]);
                                A_cd.data.push([group.analisi.cd_media]);
                                A_mef.data.push([group.analisi.mef_media]);
                                A_seg.data.push([group.analisi.seg_media]);
                                A_pre.data.push([group.analisi.pre_media]);
                                A_cc.data.push([group.analisi.cc_media]);
                                A_gu.data.push([group.analisi.gu_media]);
                            })
                        });

                        dataSeries.push(A_arrivo, A_cd, A_mef, A_seg, A_pre, A_cc, A_gu);
                        chartOptions = $.extend(true, HCS.base(), HCS.multiline(catAnalisi),
                            {
                                series: dataSeries,
                                title: {
                                    text: 'Numero di giorni per fase dell\'iter - media per CIPE'
                                },
                                xAxis: {
                                    title: {
                                        text: 'Data CIPE'
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: 'Nr. giorni'
                                    }
                                }
                            }
                        );
                        break;
                }
                break;
            case 'detail':

                let DC = Number(this.filter.data_cipe);
                const cipe = _.filter(this.monitor, ['id', DC]);

                switch (this.viewtype) {
                    case 'situazione':
                        break;
                    case 'statistica':

                        const S_arrivo = { name: 'Arrivo', data: [], color: '#7cb5ec'};
                        const S_uff_2_cd = { name: 'Segreteria DIPE', data: [], color: '#2b908f' };
                        const S_cd = { name: 'Capo Dipartimento', data: [], color: '#434348' };
                        const S_uff_2_mef = { name: 'Segreteria DIPE', data: [], showInLegend: false, color: '#2b908f' };
                        const S_mef = { name: 'M.E.F.', data: [], color: '#90ed7d' };
                        const S_uff_2_seg = { name: 'Segreteria DIPE', data: [], showInLegend: false, color: '#2b908f' };
                        const S_seg = { name: 'Segretario', data: [], color: '#f7a35c' };
                        const S_uff_2_pre = { name: 'Segreteria DIPE', data: [], showInLegend: false, color: '#2b908f' };
                        const S_pre = { name: 'Presidente', data: [], color: '#8085e9' };
                        const S_uff_2_cc = { name: 'Segreteria DIPE', data: [], showInLegend: false, color: '#2b908f' };
                        const S_cc = { name: 'Corte dei Conti', data: [], color: '#f15c80' };
                        const S_uff_2_gu = { name: 'Segreteria DIPE', data: [], showInLegend: false, color: '#2b908f' };
                        const S_gu = { name: 'Gazzetta Ufficiale', data: [], color: '#e4d354' };

                        const catStatistica = [];

                        _.forEach(cipe, (val) => {
                            _.forEachRight(val.statistica, (group) => {
                                catStatistica.push(group.nr);

                                S_arrivo.data.push([group.arrivo]);
                                S_uff_2_cd.data.push([group.cd_invio_giorni]);
                                S_cd.data.push([group.cd_ritorno_giorni]);
                                S_uff_2_mef.data.push([group.mef_invio_giorni]);
                                S_mef.data.push([group.mef_ritorno_giorni]);
                                S_uff_2_seg.data.push([group.seg_invio_giorni]);
                                S_seg.data.push([group.seg_ritorno_giorni]);
                                S_uff_2_pre.data.push([group.pre_invio_giorni]);
                                S_pre.data.push([group.pre_ritorno_giorni]);
                                S_uff_2_cc.data.push([group.cc_invio_giorni]);
                                S_cc.data.push([group.cc_ritorno_giorni]);
                                S_uff_2_gu.data.push([group.gu_invio_giorni]);
                                S_gu.data.push([group.gu_ritorno_giorni]);

                            })
                        });
                        dataSeries.push(S_gu, S_uff_2_gu, S_cc, S_uff_2_cc, S_pre, S_uff_2_pre, S_seg, S_uff_2_seg, S_mef, S_uff_2_mef, S_cd, S_uff_2_cd, S_arrivo);
                        chartOptions = $.extend(true, HCS.base(), HCS.multibar(catStatistica,(20*catStatistica.length)+200),
                            {
                                series: dataSeries,
                                title: {
                                    text: 'Numero di giorni per fase dell\'iter - singole delibere'
                                },
                                xAxis: {
                                    title: {
                                        text: 'Nr. delibera'
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: 'Nr. giorni'
                                    }
                                }
                            }
                        );
                        break;
                    case 'analisi':


                        const A_consegna = { name: 'Consegna', data: [], color: '#7cb5ec' };
                        const A_cd = { name: 'Capo Dipartimento', data: [], color: '#434348' };
                        const A_mef = { name: 'M.E.F.', data: [], color: '#90ed7d' };
                        const A_seg = { name: 'Segretario', data: [], color: '#f7a35c' };
                        const A_pre = { name: 'Presidente', data: [], color: '#8085e9' };
                        const A_cc = { name: 'Corte dei Conti', data: [], color: '#f15c80' };
                        const A_gu = { name: 'Gazzetta Ufficiale', data: [], color: '#e4d354' };

                        const catAnalisi = [];

                        _.forEach(cipe, (val) => {
                            //console.log(val);
                            _.forEachRight(val.analisi, (group) => {
                                //console.log(group);
                                catAnalisi.push(group.nr);

                                A_consegna.data.push(group.consegna);
                                A_cd.data.push(group.cd);
                                A_mef.data.push(group.mef);
                                A_seg.data.push(group.seg);
                                A_pre.data.push(group.pre);
                                A_cc.data.push(group.cc);
                                A_gu.data.push(group.gu);

                            })
                        });

                        dataSeries.push(A_gu, A_cc, A_pre, A_seg, A_mef, A_cd, A_consegna);
                        chartOptions = $.extend(true, HCS.base(), HCS.multicolumn(catAnalisi),
                            {
                                series: dataSeries,
                                title: {
                                    text: 'Numero di giorni per fase dell\'iter - singola delibera'
                                },
                                xAxis: {
                                    title: {
                                        text: 'Nr. delibera'
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text: 'Nr. giorni'
                                    }
                                }
                            }
                        );
                        break;
                }
                break;
        }

        return chartOptions;
    }

    loadYear(year: number) {
        this.apiService.getById('monitor/group', year)
            .subscribe(
                response => {
                    //console.log(response);
                    if(response.data) {
                        this.model = response.data;
                    }
                },
                error => {
                    console.log(error);
                }
            )
    }

    loadCipe(date) {

        this.apiService.getById('monitor', date)
            .subscribe(
                response => {
                    //console.log(response);
                    if(response.data) {
                        this.model = response.data;
                    }
                },
                error => {
                    console.log(error);
                }
            )
    }
}

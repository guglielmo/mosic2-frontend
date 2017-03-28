import {Component, OnInit, ViewEncapsulation, AfterViewInit} from '@angular/core';
import {APICommonService} from '../_services/index';

declare const jQuery: any;
/*
declare const jQCloud: any;
*/


@Component({
    selector: 'app-dashboard-component',
    templateUrl: './dashboard.template.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit {
/*
    public words = [
        {text: 'Lorem', weight: 13, link: 'http://github.com/mistic100/jQCloud'},
        {text: 'Ipsum', weight: 10.5, link: 'http://www.strangeplanet.fr'},
        {text: 'Dolor', weight: 9.4, link: 'http://piwigo.org'}
    ];*/

    constructor(public apiService: APICommonService) {

    }

    ngOnInit() {
        this.apiService.refreshCommonCache();
        jQuery(window).on('sn:resize', () => {
            this.resize();
        });
        this.resize();
    }

    ngAfterViewInit() {



/*        const W = this.words;

        const el = jQuery.fn.jQCloud(jQuery('#tag-cloud'), W, {
            autoResize: true
        });
        console.log('afterV', jQuery('#tag-cloud'), el);


        let c = 'boooo';*/
    }

    resize() {

    }
}

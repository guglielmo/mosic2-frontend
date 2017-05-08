import {Directive, ElementRef, OnDestroy, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

declare let jQuery: any;

@Directive({
    selector: '[scroll2bottom]'
})

export class Scroll2Bottom implements OnInit, OnDestroy {
    private $el: any;

    constructor(
        el: ElementRef,
        @Inject(DOCUMENT) private document
    ) {
        this.$el = jQuery(el.nativeElement);
        this.document = jQuery(document.nativeElement);
    }

    ngOnInit(): void {
        this.$el.on('click.scroll2bottom',function () {
            console.log(this.document);
            console.log('clicky clicky');
            this.document.animate({ scrollTop: $("#page-bottom").scrollTop() }, 1000);
        });
    }

    ngOnDestroy(): void {
        this.$el.off('click.scroll2bottom');
    }
}

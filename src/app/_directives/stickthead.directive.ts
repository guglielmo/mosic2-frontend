import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';
declare let jQuery: any;

@Directive({
    selector: '[stickthead]'
})

export class StickThead implements OnInit, OnDestroy {
    $el: any;
    reflowInterval: any;
    reflowTimeout: any;

    constructor(el: ElementRef) {
        this.$el = jQuery(el.nativeElement);
        //console.log('constructor');
    }

    ngOnInit(): void {
        let tableOffset = this.$el.offset().top+80;
        let $header = this.$el.find('thead');
        let $fixedHeader = jQuery("#header-fixed").empty().append($header.clone());

        jQuery(window).on('scroll.stickthead resize.stickthead', () => {
            let offset = jQuery(window).scrollTop();

            if (offset >= tableOffset && $fixedHeader.is(":hidden")) {
                let headerOffset = $header.offset().left;
                let headerWidth = $header.width();
                $fixedHeader.css({left: headerOffset, width: headerWidth});
                $fixedHeader.show();
                //console.log('show');

                jQuery.each($header.find('tr > th'), (ind, val) => {
                    let original_width = jQuery(val).width();
                    //console.log(this.$el, val, original_width);
                    let original_padding = jQuery(val).css("padding");
                    jQuery($fixedHeader.find('tr > th')[ind])
                        .width(original_width)
                        .css("padding", original_padding);
                });
            }
            else if (offset < tableOffset) {
                //console.log('hide');
                $fixedHeader.hide();
            }
        });

        jQuery(document).on('expandNavigation.stickthead collapseNavigation.stickthead', () => {

            clearInterval(this.reflowInterval);
            clearTimeout(this.reflowTimeout);

            this.reflowInterval = setInterval(() => {
                $fixedHeader.css({left: $header.offset().left});
            }, 20);

            this.reflowTimeout = setTimeout(() => {
                clearInterval(this.reflowInterval);
            }, 500)

        });

    }

    ngOnDestroy() {
        jQuery(window).off('scroll.stickthead resize.stickthead');
        jQuery(document).off('expandNavigation.stickthead collapseNavigation.stickthead');
        jQuery("#header-fixed").empty().hide();
        //console.log(`OnDestroy`);
    }

}


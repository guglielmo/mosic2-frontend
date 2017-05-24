import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
declare let jQuery: any;

@Directive({
    selector: '[stickthead]'
})

export class StickThead implements OnInit, OnDestroy {
    @Input() offsetY: number;
    $el: any;
    reflowInterval: any;
    reflowTimeout: any;

    constructor(el: ElementRef) {
        this.$el = jQuery(el.nativeElement);
        //console.log('constructor', el.nativeElement);
    }

    ngOnInit(): void {

        let tableOffset = this.$el.offset().top+80;
        let $header = this.$el.find('thead');
        let $fixedHeader = jQuery("#header-fixed").empty().append($header.clone());

        jQuery(window).on('scroll.stickthead', () => {

            let offset = jQuery(window).scrollTop();

            if (offset >= tableOffset && $fixedHeader.is(":hidden")) {

                let $fixedHeader = jQuery("#header-fixed").empty().append($header.clone());
                this.copyHeaderWidths($header, $fixedHeader);
                $fixedHeader.show();
            }
            else if (offset < tableOffset) {
                //console.log('hide');
                $fixedHeader.hide();
            }
        });

        jQuery(window).on('resize.stickthead', () => {
            this.copyHeaderWidths($header, $fixedHeader);
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

    copyHeaderWidths($header, $fixedHeader) {

        let headerOffset = $header.offset().left;
        let headerWidth = $header.width();
        $fixedHeader.css({left: headerOffset, top: this.offsetY, width: headerWidth});

        jQuery.each($header.find('tr > th'), (ind, val) => {
            let original_width = jQuery(val).width();
            //console.log(this.$el, val, original_width);
            let original_padding = jQuery(val).css("padding");
            jQuery($fixedHeader.find('tr > th')[ind])
                .width(original_width)
                .css("padding", original_padding);
        });
    }
}


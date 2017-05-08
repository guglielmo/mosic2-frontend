import {Directive, ElementRef, OnDestroy, OnInit} from '@angular/core';
declare let jQuery: any;

@Directive({
    selector: '[sticktoolbar]'
})

export class StickToolbar implements OnInit, OnDestroy {
    $el: any;
    reflowInterval: any;
    reflowTimeout: any;

    constructor(el: ElementRef) {
        this.$el = jQuery(el.nativeElement);
        //console.log('constructor');
    }

    ngOnInit(): void {
        let toolbarOffset = this.$el.offset().top+80;
        let $header = this.$el.find('thead');
        if($header.length === 0) {
            $header = this.$el;
        }
        
        jQuery(window).on('scroll.sticktoolbar resize.sticktoolbar', () => {
            let offset = jQuery(window).scrollTop();

            if (offset >= toolbarOffset) {

                let headerOffset = $header.offset().left;
                let headerWidth = $header.width();
                let headerHeight = $header.height();
                let toolbarWidth = this.$el.parent().width() - ( parseInt(this.$el.parent().css("padding-left")) * 2 );

                this.$el.parent().css({height: headerHeight});
                this.$el.addClass('toolbar-fixed');
                
                $header.css({width: headerWidth});

            }
            else if (offset < toolbarOffset) {
                //console.log('hide');
                this.$el.removeClass('toolbar-fixed');
            }
        });

        jQuery(document).on('expandNavigation.sticktoolbar collapseNavigation.sticktoolbar', () => {

            clearInterval(this.reflowInterval);
            clearTimeout(this.reflowTimeout);

            this.reflowInterval = setInterval(() => {
                $header.css({left: $header.offset().left});
            }, 20);

            this.reflowTimeout = setTimeout(() => {
                clearInterval(this.reflowInterval);
            }, 500)

        });

    }

    ngOnDestroy() {
        jQuery(window).off('scroll.sticktoolbar resize.sticktoolbar');
        jQuery(document).off('expandNavigation.sticktoolbar collapseNavigation.sticktoolbar');
        jQuery("#header-fixed").empty().hide();
        //console.log(`OnDestroy`);
    }

}


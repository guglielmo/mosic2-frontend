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
    }

    ngOnInit(): void {
        let toolbarOffset = this.$el.offset().top+80;
        
        jQuery(window).on('scroll.sticktoolbar', () => {
            let offset = jQuery(window).scrollTop();

            if (offset >= toolbarOffset) {

                this.copyToolbarWidths();
                this.$el.addClass('toolbar-fixed');
            }
            else if (offset < toolbarOffset) {
                //console.log('hide');
                this.$el.removeClass('toolbar-fixed');
            }
        });

        jQuery(window).on('resize.sticktoolbar', () => {
            this.copyToolbarWidths();
        });

        jQuery(document).on('expandNavigation.sticktoolbar collapseNavigation.sticktoolbar', () => {

            clearInterval(this.reflowInterval);
            clearTimeout(this.reflowTimeout);

            this.reflowInterval = setInterval(() => {
                this.$el.css({left: this.$el.parent().offset().left});
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

    copyToolbarWidths() {
        let toolbarHeight = this.$el.height();
        let toolbarWidth = this.$el.parent().innerWidth();

        this.$el.parent().css({height: toolbarHeight});
        this.$el.css({width: toolbarWidth});
    }

}


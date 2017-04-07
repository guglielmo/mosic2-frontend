import {Component, ViewEncapsulation, ElementRef, OnInit, HostBinding} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {AppConfig} from '../app.config';

import { NotificationsService } from 'angular2-notifications';

declare var jQuery: any;
declare var Hammer: any;

@Component({
    selector: 'layout',
    encapsulation: ViewEncapsulation.None,
    providers: [NotificationsService],
    templateUrl: './layout.template.html',
    host: {
        '[class.nav-static]': 'config.state["nav-static"]',
        '[class.chat-sidebar-opened]': 'chatOpened',
        '[class.app]': 'true',
        id: 'app'
    }
})
export class LayoutComponent implements OnInit {
    config: any;
    configFn: any;
    $sidebar: any;
    el: ElementRef;
    router: Router;
    chatOpened = false;

    public notifyOptions = {
        position: ['bottom', 'right'],
        showProgressBar: true,
        timeOut: 6000,
        lastOnBottom: true
    };

    constructor(config: AppConfig,
                el: ElementRef,
                private _notificationService: NotificationsService,
                router: Router,
    ) {
        this.el = el;
        this.config = config.getConfig();
        this.configFn = config;
        this.router = router;

        const _that = this;
        this.configFn.notify = function( title: any, msg: any ) {
            _that._notificationService.error(title, msg);
        };

    }

    toggleSidebarListener(state): void {
        const toggleNavigation = state === 'static'
            ? this.toggleNavigationState
            : this.toggleNavigationCollapseState;
        toggleNavigation.apply(this);
        localStorage.setItem('nav-static', this.config.state['nav-static']);
    }

    toggleNavigationState(): void {
        this.config.state['nav-static'] = !this.config.state['nav-static'];
        if (!this.config.state['nav-static']) {
            this.collapseNavigation();
        }
    }

    expandNavigation(): void {
        // this method only makes sense for non-static navigation state
        if (this.isNavigationStatic()
      && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) { return; }

        jQuery('layout').removeClass('nav-collapsed');
        this.$sidebar.find('.active .active').closest('.collapse').collapse('show')
            .siblings('[data-toggle=collapse]').removeClass('collapsed');
        jQuery(document).trigger('expandNavigation');
    }

    collapseNavigation(): void {
        // this method only makes sense for non-static navigation state
        if (this.isNavigationStatic()
      && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) { return; }

        jQuery('layout').addClass('nav-collapsed');
        this.$sidebar.find('.collapse.in').collapse('hide')
            .siblings('[data-toggle=collapse]').addClass('collapsed');
        jQuery(document).trigger('collapseNavigation');

    }

    /**
     * Check and set navigation collapse according to screen size and navigation state
     */
    checkNavigationState(): void {
        if (this.isNavigationStatic()) {
            if (this.configFn.isScreen('sm')
                || this.configFn.isScreen('xs') || this.configFn.isScreen('md')) {
                this.collapseNavigation();
            }
        } else {
            if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
                setTimeout(() => {
                    this.collapseNavigation();
                }, this.config.settings.navCollapseTimeout);
            } else {
                this.collapseNavigation();
            }
        }
    }

    isNavigationStatic(): boolean {
        return this.config.state['nav-static'] === true;
    }

    toggleNavigationCollapseState(): void {
        if (jQuery('layout').is('.nav-collapsed')) {
            this.expandNavigation();
        } else {
            this.collapseNavigation();
        }
    }

    _sidebarMouseEnter(): void {
        if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
            this.expandNavigation();
        }
    }

    _sidebarMouseLeave(): void {
        if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
            this.collapseNavigation();
        }
    }

    enableSwipeCollapsing(): void {
        const swipe = new Hammer(document.getElementById('content-wrap'));
        const d = this;

        swipe.on('swipeleft', () => {
            setTimeout(() => {
        if (d.configFn.isScreen('md')) { return; }

                if (!jQuery('layout').is('.nav-collapsed')) {
                    d.collapseNavigation();
                }
            });
        });

        swipe.on('swiperight', () => {
      if (d.configFn.isScreen('md')) { return; }

      if (jQuery('layout').is('.chat-sidebar-opened')) { return; }

            if (jQuery('layout').is('.nav-collapsed')) {
                d.expandNavigation();
            }
        });
    }

    collapseNavIfSmallScreen(): void {
        if (this.configFn.isScreen('xs')
            || this.configFn.isScreen('sm') || this.configFn.isScreen('md')) {
            this.collapseNavigation();
        }
    }

    ngOnInit(): void {


        if (localStorage.getItem('nav-static') === 'true') {
            this.config.state['nav-static'] = true;
        }

        const $el = jQuery(this.el.nativeElement);
        this.$sidebar = $el.find('[sidebar]');

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                setTimeout(() => {
                    this.collapseNavIfSmallScreen();
                    window.scrollTo(0, 0);

                    $el.find('a[href="#"]').on('click', (e) => {
                        e.preventDefault();
                    });
                });
            }
        });

        this.$sidebar.on('mouseenter', this._sidebarMouseEnter.bind(this));
        this.$sidebar.on('mouseleave', this._sidebarMouseLeave.bind(this));

        this.checkNavigationState();

        this.$sidebar.on('click', () => {
            if (jQuery('layout').is('.nav-collapsed')) {
                this.expandNavigation();
            }
        });

        this.router.events.subscribe(() => {
            this.collapseNavIfSmallScreen();
            window.scrollTo(0, 0);
        });

        if ('ontouchstart' in window) {
            this.enableSwipeCollapsing();
        }

        this.$sidebar.find('.collapse').on('show.bs.collapse', function (e): void {
            // execute only if we're actually the .collapse element initiated event
            // return for bubbled events
      if (e.target !== e.currentTarget) { return; }

            const $triggerLink = jQuery(this).prev('[data-toggle=collapse]');
            jQuery($triggerLink.data('parent'))
                .find('.collapse.in').not(jQuery(this)).collapse('hide');
        })
        /* adding additional classes to navigation link li-parent
         for several purposes. see navigation styles */
            .on('show.bs.collapse', function (e): void {
                // execute only if we're actually the .collapse element initiated event
                // return for bubbled events
        if (e.target !== e.currentTarget) { return; }

                jQuery(this).closest('li').addClass('open');
            }).on('hide.bs.collapse', function (e): void {
            // execute only if we're actually the .collapse element initiated event
            // return for bubbled events
      if (e.target !== e.currentTarget) { return; }

            jQuery(this).closest('li').removeClass('open');
        });
    }
}

/**
 * @ignore
 * scroll-view render
 * @author yiminghe@gmail.com
 */
KISSY.add(function (S, require) {
    var Container = require('component/container');
    var ContentRenderExtension = require('component/extension/content-render');

    // http://www.html5rocks.com/en/tutorials/speed/html5/
    var Features = S.Features,
//        MARKER_CLS = 'ks-scrollview-marker',
        floor = Math.floor,
        transformProperty;

    var isTransform3dSupported = S.Features.isTransform3dSupported();

    // http://www.html5rocks.com/en/tutorials/speed/html5/
    var supportCss3 = S.Features.getVendorCssPropPrefix('transform') !== false;

//    function createMarker(contentEl) {
//        var m;
//        if (m = contentEl.one('.' + MARKER_CLS)) {
//            return m;
//        }
//        return $('<div class="' + MARKER_CLS + '" ' +
//            'style="position:absolute;' +
//            'left:0;' +
//            'top:0;' +
//            'width:100%;' +
//            'height:100%;' +
//            '"></div>').appendTo(contentEl);
//    }

    var methods = {
        syncUI: function () {
            var self = this,
                control = self.control,
                el = control.el,
                contentEl = control.contentEl,
                $contentEl = control.$contentEl;
            // consider pull to refresh
            // refresh label will be prepended to el
            // contentEl must be absolute
            // or else
            // relative is weird, should math.max(contentEl.scrollHeight,el.scrollHeight)
            // will affect pull to refresh
            var scrollHeight = contentEl.offsetHeight,
                scrollWidth = contentEl.offsetWidth;

            var clientHeight = el.clientHeight,
                allowScroll,
                clientWidth = el.clientWidth;

            control.scrollHeight = scrollHeight;
            control.scrollWidth = scrollWidth;
            control.clientHeight = clientHeight;
            control.clientWidth = clientWidth;

            allowScroll = control.allowScroll = {};

            if (scrollHeight > clientHeight) {
                allowScroll.top = 1;
            }
            if (scrollWidth > clientWidth) {
                allowScroll.left = 1;
            }

            control.minScroll = {
                left: 0,
                top: 0
            };

            var maxScrollLeft,
                maxScrollTop;

            control.maxScroll = {
                left: maxScrollLeft = scrollWidth - clientWidth,
                top: maxScrollTop = scrollHeight - clientHeight
            };

            delete control.scrollStep;

            var snap = control.get('snap'),
                scrollLeft = control.get('scrollLeft'),
                scrollTop = control.get('scrollTop');

            if (snap) {
                var elOffset = $contentEl.offset();
                var pages = control.pages = typeof snap === 'string' ?
                        $contentEl.all(snap) :
                        $contentEl.children(),
                    pageIndex = control.get('pageIndex'),
                    pagesOffset = control.pagesOffset = [];
                pages.each(function (p, i) {
                    var offset = p.offset(),
                        left = offset.left - elOffset.left,
                        top = offset.top - elOffset.top;
                    if (left <= maxScrollLeft && top <= maxScrollTop) {
                        pagesOffset[i] = {
                            left: left,
                            top: top,
                            index: i
                        };
                    }
                });
                if (pageIndex) {
                    control.scrollToPage(pageIndex);
                    return;
                }
            }

            // in case content is reduces
            control.scrollToWithBounds({
                left: scrollLeft,
                top: scrollTop
            });
        },

        '_onSetScrollLeft': function (v) {
            this.control.contentEl.style.left = -v + 'px';
        },

        '_onSetScrollTop': function (v) {
            this.control.contentEl.style.top = -v + 'px';
        }
    };

    if (supportCss3) {
        transformProperty = Features.getVendorCssPropName('transform');

        methods._onSetScrollLeft = function (v) {
            var control = this.control;
            control.contentEl.style[transformProperty] = 'translateX(' + floor(-v) + 'px)' +
                ' translateY(' + floor(-control.get('scrollTop')) + 'px)' +
                (isTransform3dSupported ? ' translateZ(0)' : '');
        };

        methods._onSetScrollTop = function (v) {
            var control = this.control;
            control.contentEl.style[transformProperty] = 'translateX(' + floor(-control.get('scrollLeft')) + 'px)' +
                ' translateY(' + floor(-v) + 'px)' +
                (isTransform3dSupported ? ' translateZ(0)' : '');
        };
    }

    return Container.getDefaultRender().extend([ContentRenderExtension],
        methods, {
            name: 'ScrollViewRender'
        });
});
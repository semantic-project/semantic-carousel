/**
 * Semantic Carousel v1.0.0
 * Copyright 2017-2018 semantic project <semantic.project@gmail.com>
 * Licensed The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

    var Plugin = function (element, options) {
        this.$element = $(element);
        this.$buttons = this.$element.find(".carousel-next, .carousel-prev");
        this.$thumb = this.$element.find(".item-thumb");
        this.$shelf  = this.$element.find(".list-items");
        this.shelfLeft = -1 * parseInt(this.$shelf.css("left"), 10);
        this.$left = this.$element.find(".carousel-prev");
        this.$right = this.$element.find(".carousel-next");
        this.$body = $("body");
        this.$document = $(document);
        this.$window = $(window);
        this.token = false;
        this.hoverTimer = false;
        this.options = $.extend({}, Plugin.DEFAULTS, options);

        this.init();
    };

    Plugin.VERSION = '1.0.0';

    Plugin.DEFAULTS = {
        scrollbar: true
    };

    Plugin.prototype.init = function () {
        this.updateControls();
        this.events();
        this.onResize();
        this.build();
    };

    Plugin.prototype.onResize = function () {
        var $this = this;
        this.$window.resize(function () {
            $this.thumb();
        });
    };

    Plugin.prototype.build = function () {

        this.$element
            .on("mouseenter.semantic.carousel", $.proxy(this.enter, this))
            .on("mouseleave.semantic.carousel", $.proxy(this.leave, this));

        this.$thumb
            .on("mousedown.semantic.carousel", $.proxy(this.down, this));

        this.$body.add(this.$thumb)
            .on("mouseup.semantic.carousel", $.proxy(this.up, this));
    };


    Plugin.prototype.enter = function () {
        var $this = this;
        this.$element.addClass("hovering");
        window.clearTimeout(this.hoverTimer);
        this.hoverTimer = window.setTimeout(function () {
            $this.$element.hasClass('hovering') ? $this.showControls() : false;
        }, 300);

    };

    Plugin.prototype.leave = function () {
        var $this = this;
        this.$element.removeClass("hovering");
        window.clearTimeout(this.hoverTimer);
        this.$element.hasClass("scrolling") || (this.hoverTimer = window.setTimeout(function () {
            $this.$element.hasClass("hovering") || $this.hideControls();
        }, 600));
    };

    Plugin.prototype.down = function (event) {
        var $this = this;
        var x = event.clientX;
        1 === event.which && (event.preventDefault(), this.$element.addClass("scrolling"),

        $this.$body.on("mousemove.semantic.carousel", function (event) {
            event.preventDefault();
            var dmc = $this.getDimensions(),
                dm = Math.max(Math.min(dmc.shelfLeft + 1 / dmc.pageRatio * (event.clientX - x), dmc.maxLeft), 0);
            x = event.clientX;
            $this.moveWrapper(dm);
        }), $this.$document.on("selectstart.semantic.carousel", function () {
            return false;
        }));

    };

    Plugin.prototype.up = function (event) {
        this.$element.removeClass("scrolling");
        this.$element.hasClass("hovering") || this.hideControls();
        this.$body.off("mousemove.semantic.carousel");
        this.$document.off("selectstart.semantic.carousel");
        event.preventDefault();
    };

    Plugin.prototype.moveWrapper = function (index, duration) {
        var $this = this;
        duration = duration || 0;
        $this.shelfLeft = index;

        var dmc = this.getDimensions();
        var dm = index / dmc.shelfWidth * dmc.pageWidth;
        this.$shelf.animate({
            left: -index
        }, duration, "swing", function () {
            $this.arrows();
            $this.unlock();
        });
        this.$thumb.animate({
            left: dm
        }, duration, "swing", function () {
            $this.thumb();
            $this.unlock();
        });
    };

    Plugin.prototype.unlock = function () {
        this.token = false;
    };

    Plugin.prototype.lock = function () {
        this.token = true;
    };

    Plugin.prototype.locked = function () {
        return this.token;
    };

    Plugin.prototype.thumb = function () {
        var dmc = this.getDimensions(),
            dm = dmc.leftRatio * dmc.pageWidth,
            d = Math.min(dmc.pageRatio * dmc.pageWidth, dmc.pageWidth);
        this.$thumb.width(d).each(function () {
            $(this).animate({
                left: dm
            }, 0)
        });
    };

    Plugin.prototype.arrows = function () {
        var $this = this;
        var dmc = this.getDimensions();

        $.each([{
            $e: $this.$left,
            enabled: 0 < dmc.shelfLeft
        }, {
            $e: $this.$right,
            enabled: dmc.shelfLeft < dmc.maxLeft
        }], function (b, c) {
            var e = c.$e;

            c.enabled ? e.removeClass("disabled") : e.addClass("disabled");

        });
    };

    Plugin.prototype.getDimensions = function () {
        var self  = this.$shelf.width();
        var selfLeft = this.shelfLeft;
        var element = this.$element.width();

        return {
            pageWidth: element,
            shelfWidth: self,
            shelfLeft: selfLeft,
            pageRatio: element / self,
            leftRatio: selfLeft / self,
            maxLeft: self - element
        }
    };

    Plugin.prototype.showControls = function (event) {
        this.$thumb.add(this.$buttons).stop(true, true).fadeIn({
            duration: 300,
            complete: event,
            queue: false
        });
    };

    Plugin.prototype.hideControls = function (event) {
        this.$thumb.add(this.$buttons).stop(true, true).fadeOut({
            duration: 300,
            complete: event,
            queue: false
        });
    };

    Plugin.prototype.updateControls = function () {
        this.arrows();
        this.thumb();
    };

    Plugin.prototype.slide = function (direction) {
        var index = direction === "next" ? 1 : -1;
        var dmc = this.getDimensions(),
            dm = this.alignWithItem(dmc.shelfLeft + index * dmc.pageWidth),
            d = Math.min(0 > index ? dm.right : dm.left, dmc.maxLeft);

        this.locked() || (this.lock(), dmc.shelfLeft === d ? (this.bounce(this.$shelf, -30 * index), this.bounce(this.$thumb, 6 * index)) : this.moveWrapper(d, 400));

        return this;
    };

    Plugin.prototype.bounce = function (wrapper, margin) {
        var $this = this;

        wrapper.each(function () {
            var $elm = $(this);
            $elm.animate({
                marginLeft: margin
            }, {
                queue: false,
                duration: 400,
                easing: "swing",
                complete: function () {
                    $elm.animate({
                        marginLeft: 0
                    },{
                        queue: false,
                        duration: 100,
                        easing: "swing",
                        complete: function () {
                            $this.unlock();
                        }
                    });
                }
            });
        });

        return this;

    };

    Plugin.prototype.getItems = function () {
        return this.$element.find(".item");
    };

    Plugin.prototype.cardPosition = function (item) {
        var position = (item.position() || {
            left: 0,
            right: 0
        }).left;

        item = position + item.outerWidth(true);

        return {
            left: position,
            right: item
        }
    };

    Plugin.prototype.alignWithItem  = function (item) {
        if (0 > item) return {
            left: 0,
            right: 0
        };

        var $this = this;
        var items = this.getItems();

        var c = items.map(function () {
            var pos = $this.cardPosition($(this));
            if (item >= pos.left && item <= pos.right) return pos;
        }).get(0);

        return c ? c : $this.cardPosition(items.last());
    };

    Plugin.prototype.events = function () {
        var $this = this;
        this.$document.on("click.semantic.carousel", "[data-carousel]", function (event) {
            var $that = $(this);
            var $target = $that.attr("data-carousel");
            $target === "next" ? $this.slide("next") : $this.slide("prev");

            event.preventDefault();
        });
    };

    $.fn.semanticCarousel = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this);
            var data = $this.data("semantic.carousel");
            if (!data) {
                data = new Plugin(this, typeof option === "object" && option);
                $this.data("semantic.carousel", data);
            }
            if (typeof option === "string") {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.semanticCarousel.Constructor = Plugin;

})(window.jQuery, window, document);
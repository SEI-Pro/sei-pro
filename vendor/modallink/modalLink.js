/**
 * version 1.1.0
 * upgrades
 * - fade animation on open and close
 * - open method. can open modal without binding link
 * - possible to open modal with "POST". nessecary when need to send large amount of data to modal
 * - isolated namespace to avoid conflicts with jQuery UI dialog (SEI Pro)
 */

(function ($) {

    var callbackCloseFunction;
    var disableScroll;
    var maximized;
    var openedWidth;
    var openedMarginLeft;
    var openedHeight;
    var openedMarginTop;
    var windowTop;
    var idModal;

    // Create isolated namespace for modalLink to avoid conflicts
    if (!$.modalLinkPlugin) {
        $.modalLinkPlugin = {};
    }

    $.modalLinkPlugin.defaults = {
        height: 600,
        width: 900,
        showTitle: true,
        showClose: true,
        overlayOpacity: 0.6,
        disableScroll: true,
        onHideScroll: function () { },
        onShowScroll: function () { }
    };

    function hideBodyScroll(cb) {
        var w = $("body").outerWidth();
        $("body").css({ overflow: "hidden" });
        var w2 = $("body").outerWidth();
        $("body").css({ width: w });

        if (typeof cb == "function") {
            var scrollbarWidth = w2 - w;
            cb(scrollbarWidth);
        }
    }

    function showBodyScroll(cb) {
        var $body = $("body");
        var w = $body.outerWidth();
        $body.css({ width: '', overflow: '' });
        var w2 = $body.outerWidth();

        if (typeof cb == "function") {
            var scrollbarWidth = w - w2;
            cb(scrollbarWidth);
        }
    }

    /**
     * Helper method for appending parameter to url
     */
    function addUrlParam(url, name, value) {
        return appendUrl(url, name + "=" + value);
    }

    /**
     * Hepler method for appending querystring to url
     */
    function appendUrl(url, data) {
        return url + (url.indexOf("?") < 0 ? "?" : "&") + data;
    }

    function buildOptions(option) {

    }

    function resolveBooleanValue($link) {

        for (var i = 1; i < arguments.length; i++) {
            var val = arguments[i];

            if (typeof val == "boolean") {
                return val;
            }

            if (typeof val == "string") {
                var attrValue = $link.attr(val);
                if (attrValue) {
                    if (attrValue.toLowerCase() === "true") {
                        return true;
                    }
                    if (attrValue.toLowerCase() === "false") {
                        return false;
                    }
                }
            }
        }
    }

    var methods = {
        init: function (options) {
            maximized = false;

            var settings = $.extend({}, $.modalLinkPlugin.defaults);
            $.extend(settings, options);

            return this.each(function () {
                var $link = $(this);

                // already bound
                if ($link.hasClass("sparkling-modal-link"))
                    return;

                // mark as bound
                $link.addClass("sparkling-modal-link");

                $link.click(function (e) {
                    e.preventDefault();
                    methods.open($link, settings);
                    return false;
                });
            });
        },

        close: function (cb) {
            windowTop.arrModal.pop();

            if(!windowTop) { //caso não exista o modalLink
                return;
            }

            var $container =  $(windowTop.document.getElementById('divInfraSparklingModalContainer'+idModal));

            var $link = $container.data("modallink");

            if (!$link) {
                return;
            }

            var iframe = windowTop.document.getElementById("modal-frame"+idModal);
            iframe.contentWindow.onblur = null;

            if(typeof callbackCloseFunction == "function"){
                callbackCloseFunction();
            }else if (callbackCloseFunction!=null){
                if (iframe != null){
                    iframe.contentWindow[callbackCloseFunction]();
                }
            }

            $link.trigger("modallink.close");

            var $overlay = $container.find("#divInfraSparklingModalOverlay"+idModal);
            var $content = $container.find("#divInfraSparklingModalFrame"+idModal);

            try{
                if (windowTop.infraJanelaModalCampo!=null) {
                    windowTop.infraJanelaModalCampo.focus();
                }
            }catch(excFocus){}

            showBodyScroll(cb);

            if (typeof cb == "function") {
                cb();
            }

            $overlay.remove();
            $content.remove();
            $container.remove();




        },

        resize: function () {

            var $modalFrame = $(windowTop.document.getElementById('divInfraSparklingModalFrame'+idModal));
            var $modalContent = $(windowTop.document.getElementById('divInfraSparklingModalContent'+idModal));
            var $modalSize = $(windowTop.document.getElementById('divInfraSparklingModalSize'+idModal));
            var $iframe = $(windowTop.document.getElementById('modal-frame'+idModal));

            if(!maximized){
                maximized = true;

                methods.removerResizableDraggable();

                $modalFrame.animate({
                    width:"100%",
                    height:"100%",
                    left: "0px",
                    marginLeft: "0px",
                    top: "0px",
                    marginTop: "0px",
                }, 200, function() {
                    // Animation complete.
                });

//                $modalContent.css("width","100%").css("height","100%");

                //               $iframe.css("width","100%").css("height","95%");

                $modalSize.html("<a href='#'><img title=\"Restaurar janela\" onmouseover=\"this.src=INFRA_PATH_JS + '/modal/restaurar_cinza.png'\" onmouseout=\"this.src=INFRA_PATH_JS + '/modal/restaurar_branco.png'\" src=\"" + INFRA_PATH_JS + "/modal/restaurar_branco.png\" tabindex=\"1\" /></a>");

            }else{
                maximized = false;

                methods.inserirResizableDraggable();

                //               $iframe.css({ width: openedWidth, height: openedHeight });

                //               $modalContent.css("width","").css("height","");

                $modalFrame
                  .css("left","50%")
                  .css("marginLeft",openedMarginLeft)
                  .css("top","50%")
                  .css("marginTop",openedMarginTop)
                  .css("width",openedWidth)
                  .css("height",openedHeight);
                /*  $modalFrame.animate({
                      width:"",
                      height:"",
                      left: "50%",
                      marginLeft: openedMarginLeft,
                      top: "50%",
                      marginTop: openedMarginTop,
                  }, 200, function() {


                  });*/

                $modalSize.html("<a href='#'><img title=\"Maximizar janela\" onmouseover=\"this.src=INFRA_PATH_JS + '/modal/maximizar_cinza.png'\" onmouseout=\"this.src=INFRA_PATH_JS + '/modal/maximizar_branco.png'\" src=\"" + INFRA_PATH_JS + "/modal/maximizar_branco.png\"  tabindex=\"1\" /></a>");

            }
        },

        open: function ($link, options) {

            var elementoAtivo = document.activeElement;

            if(options.callbackClose){
                callbackCloseFunction = options.callbackClose;
            }

            disableScroll = options.disableScroll;

            options = options || {};
            var url, title, showTitle, showClose, disableScroll;

            url = options.url || $link.attr("href");
            title = options.title
              || $link.attr("data-ml-title")
              || $link.attr("title")
              || $link.text();

            showTitle = resolveBooleanValue($link,
              options.showTitle,
              "data-ml-show-title",
              $.modalLinkPlugin.defaults.showTitle);

            showClose = resolveBooleanValue($link,
              options.showClose,
              "data-ml-show-close",
              $.modalLinkPlugin.defaults.showClose);

            disableScroll = resolveBooleanValue($link,
              options.disableScroll,
              "data-ml-disable-scroll",
              $.modalLinkPlugin.defaults.disableScroll);

            var settings = $.extend({}, $.modalLinkPlugin.defaults);
            $.extend(settings, options);

            var dataWidth = $link.attr("data-ml-width");
            if (dataWidth) {
                settings.width = parseInt(dataWidth);
            }
            if(settings.width > $( parent.document  ).width()){
                settings.width = $( parent.document  ).width()-20;
            }
            openedWidth = settings.width;

            var dataHeight = $link.attr("data-ml-height");
            if (dataHeight) {
                settings.height = parseInt(dataHeight);
            }
            settings.height += 35;
            if(settings.height +100> $( parent.document  ).height() ){
                settings.height = $( parent.document  ).height() -100;
            }

            openedHeight = settings.height;

            var data = {};

            if (typeof settings.data != 'undefined') {
                if (typeof settings.data == "function") {
                    data = settings.data();
                }
                else {
                    data = settings.data;
                }
            }

            var $container = $("<div id=\"divInfraSparklingModalContainer"+idModal+"\" class=\"sparkling-modal-container\"></div>");
            $container.data("modallink", $link);

            var containerModalAberta = $(".sparkling-modal-close",windowTop.document);
            var qtdModalAberta = 0;
            if(containerModalAberta != null && containerModalAberta.length){
                qtdModalAberta = containerModalAberta.length+1;
            }


            var $overlay = $("<div id=\"divInfraSparklingModalOverlay"+idModal+"\" class=\"sparkling-modal-overlay\"  ></div>");
            $overlay.css({ position: 'fixed', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', zIndex: 999999999+qtdModalAberta });
            $overlay.appendTo($container);
            // $overlay.click(methods.close);

            openedMarginTop = -settings.height / 2;
            openedMarginLeft = -settings.width / 2;
            var $content = $("<div id=\"divInfraSparklingModalFrame"+idModal+"\" class=\"sparkling-modal-frame d-flex flex-column\"></div>")
              .css("opacity", 0)
              .css({ zIndex: 1000000000+qtdModalAberta, position: 'fixed' })
              .css({ left: '50%', marginLeft: openedMarginLeft })
              .css({ top: '50%', marginTop: openedMarginTop })
              .css({ width: settings.width, height: settings.height })
              .appendTo($container);


            windowTop.infraJanelaModalOrigem = window;
            windowTop.infraJanelaModalCampo = elementoAtivo;

            $(windowTop.document.body).append($container.get(0));

            if (showTitle) {

                var $title = $("<div id=\"divInfraSparklingModalTitle"+idModal+"\" class=\"sparkling-modal-title\" ><div id=\"modal_drag"+idModal+"\" style='z-index: 999999997;'  class='w-100 h-100'> </div></div>");
                $title.appendTo($content);

                var $sizeButton = $("<div id=\"divInfraSparklingModalSize"+idModal+"\" class=\"sparkling-modal-size\"  style='z-index: 999999998;'  ><a href='#'><img title=\"Maximizar janela\"   onmouseover=\"this.src=INFRA_PATH_JS + '/modal/maximizar_cinza.png'\" onmouseout=\"this.src=INFRA_PATH_JS + '/modal/maximizar_branco.png'\" src=\"" + INFRA_PATH_JS + "/modal/maximizar_branco.png\"  tabindex=\"1\" /></a></div>");
                $sizeButton.click(methods.resize);
                $sizeButton.appendTo($title);

                if (showClose) {
                    var $closeButton = $("<div id=\"divInfraSparklingModalClose"+idModal+"\" timestamp=\""+idModal+"\" style='z-index: 999999998;'   class=\"sparkling-modal-close\"><a href='#'><img title=\"Fechar janela (ESC)\" onmouseover=\"this.src=INFRA_PATH_JS + '/modal/fechar_vermelho.png'\" onmouseout=\"this.src=INFRA_PATH_JS + '/modal/fechar_branco.png'\" src=\"" + INFRA_PATH_JS + "/modal/fechar_branco.png\"  tabindex=\"1\" /></a></div>");
                    $closeButton.appendTo($title);
                    $closeButton.click(methods.close);
                }

                $title.append("<div style=\"clear: both;\"></div>");
            }
            var $iframeContainer = $("<div id=\"divInfraSparklingModalContent"+idModal+"\" class=\"sparkling-modal-content flex-grow-1\" ></div>");
            $iframeContainer.appendTo($content);

            var $iframe;
            var scroll = "";
            if(disableScroll && disableScroll == true){
                scroll = "no";
            }
            $iframe = $("<iframe frameborder=0   scrolling='"+scroll+"'  ¨ id='modal-frame"+idModal+"' name='modal-frame' tabindex='1'></iframe>");

            $iframe.appendTo($iframeContainer);
            $iframe.css({ width: "100%", height: "100%" });

            if (typeof data == "object") {
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        url = addUrlParam(url, i, data[i]);
                    }
                }
            } else if (typeof data != "undefined") {
                url = appendUrl(url, data);
            }

            $iframe.attr("src", url);
            $iframe.on("load",function(){
               const ifr = this.contentWindow;
               ifr.focus();
               this.contentWindow.onblur = function(){
                   if(idModal ==  windowTop.arrModal[windowTop.arrModal.length-1].name){
                       setTimeout(function (){
                           ifr.focus()
                       },0)
                   }
                }
            })

            openedMarginTop = -($content.outerHeight(false) / 2);
            $content.css({ marginTop: openedMarginTop });

            $overlay.fadeTo("fast", settings.overlayOpacity);
            $content.fadeTo("fast", 1);

            if (disableScroll) {
                hideBodyScroll(settings.onHideScroll);
            }

            methods.inserirResizableDraggable();

        },

        criarDivTemp: function(){
            var d = $('<div id="temp_div'+idModal+'"></div>');
            $('#divInfraSparklingModalFrame'+idModal,windowTop.document).append(d);
            d.css({position: 'absolute'});
            d.css({top: 0, left: 0});
            d.height('100%');
            d.width('100%');
        },

        inserirResizableDraggable:function(){
            var w = windowTop.document;
            $("#divInfraSparklingModalFrame"+idModal,w).resizable({
                handles: "e,w,s,n,se",
                minWidth: 300,
                minHeight: 300,

                create: function(event, ui) {
                },
                start: function () {
                    methods.criarDivTemp();
                },
                stop: function () {
                    $('#temp_div'+idModal,w).remove();

                    var espaco = 2;

                    var marginTop = parseInt($(this).css("margin-top"));
                    var top = $(this).position().top;
                    var height = $(this).height();
                    if(top+ marginTop < 0){
                        $(this).css({ top: (-marginTop+espaco)+"px" , height: (height+top+marginTop-espaco)+"px"});
                    }
                    top = $(this).position().top;
                    height = $(this).height();
                    var bottom = $(w).height()-(top+marginTop+height);
                    if(bottom < 0){
                        $(this).css({ height: (height+bottom-espaco)+"px" });
                    }

                    var marginLeft = parseInt($(this).css("margin-left"));
                    var left = $(this).position().left;
                    var width = $(this).width();
                    if(left+ marginLeft  < 0){
                        $(this).css({ left: (-marginLeft+espaco)+"px" , width: (width+left+marginLeft-espaco)+"px"});
                    }
                    left = $(this).position().left;
                    width = $(this).width();
                    var right = $(w).width()-(left+marginLeft+width);
                    if(right < 0){
                        $(this).css({ width: (width+right-espaco)+"px" });
                    }
                }
            });

            $("#modal_drag"+idModal,w).css("cursor","move");
            $( "#divInfraSparklingModalFrame"+idModal,w ).draggable({
               handle:'#modal_drag'+idModal,
                start: function(event) {
                    methods.criarDivTemp();
                },

                stop: function(event) {
                    $('#temp_div'+idModal,w).remove();

                    var espaco = 35;

                    var top = $(this).position().top;
                    var marginTop = parseInt($(this).css("margin-top"));
                    if(top+ marginTop < 0){
                        $(this).css({ top: (-marginTop)+"px" });
                    }
                    if(top+ marginTop > $(w).height()){
                        $(this).css({ top:( $(w).height()-marginTop -espaco)+"px" });
                    }

                    var left = $(this).position().left;
                    var width = $(this).width();
                    var marginLeft = parseInt($(this).css("margin-left"));

                    if(left+width+marginLeft-espaco < 0){
                        $(this).css({ left: (-width-marginLeft+espaco+50)+"px" });
                    }
                    if(left+marginLeft+espaco > $(w).width()){
                        $(this).css({ left:($(w).width()-marginLeft-espaco)+"px" });
                    }


                },
            });
        },

        removerResizableDraggable: function(){
            var w = windowTop.document;
            $("#modal_drag"+idModal,w).css("cursor","default");
            $("#divInfraSparklingModalFrame"+idModal,w).resizable("destroy");
            $("#divInfraSparklingModalFrame"+idModal,w).draggable("destroy");
        }
    };

    $.fn.modalLink = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.modalLink');
            return this;
        }
    };

    // Maintain backward compatibility while using isolated namespace
    $.modalLink = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.modalLink');
            return this;
        }
    };

    // Also add defaults to the original namespace for backward compatibility
    $.modalLinkDefaults = $.modalLinkPlugin.defaults;

    // Add the open method to the isolated namespace
    $.modalLinkPlugin.open = function(url, options) {
        windowTop = window.top;

        if(!windowTop.arrModal || windowTop == window){
            windowTop.arrModal = [];
        }
        idModal = (new Date()).getTime();
        window.name = idModal;
        windowTop.arrModal.push(window);
        options = $.extend({}, options);
        options.url = url;
        methods["open"].call(this, $("<a />"), options);
    };

    // Add the open method to both namespaces for compatibility
    $.modalLink.open = $.modalLinkPlugin.open;

})(jQuery);



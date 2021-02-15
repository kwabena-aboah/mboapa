"use strict";

var app = {
    app: false,
    isloaded: false,
    header: false,
    footer: false,    
    settings: {
        navDetectAuto: true,
        navHorizontalDetectAuto: true,
        screen_md: 992,
        sidepanelMobileHeight: 400,
        sidebarMobileHeight: 400
    },
    accordion_settings: {titleHeight: 50, noResize: false},
    
    init: function(){
        this.app = $(".app");
        this.header = $(".app > .app-header").length > 0 ? $(".app > .app-header") : false;
        this.footer = $(".app > .app-footer").length > 0 ? $(".app > .app-footer") : false;                
    },
    layout: function(){
        
        // sidebars media
        app.layoutSidebars();
        // end
        
        // check header position
        if($(".app-content > .app-header").length === 1)
            $(".app-container").addClass("app-header-inside-content");        
        // end 
        
        // params for app-container
        $(".app-container").each(function(){
            var app_content = $(this).find(".app-content");
            
            $(this).find(".app-sidebar").each(function(){
                
                if($(this).hasClass("dir-left")){                    
                    app_content.addClass("app-sidebar-left");
                }
                
                if($(this).hasClass("dir-right"))
                    app_content.addClass("app-sidebar-right");
                
            });
        });
        // end of params
        
        // sidebar actions        
        $(".app-sidebar-left-closed .app-sidebar, .app-sidebar-right-closed .app-sidebar").css("display","none");
        
        $("[data-sidebar-toggle]").on("click",function(){
            var app_sidebar = $($(this).data("sidebar-toggle")),
                app_sidebar_direction = app_sidebar.hasClass("dir-left") ? 'left' : 'right',
                app_container = app_sidebar.parent(".app-container");
            
            if(app_container.hasClass("app-sidebar-"+app_sidebar_direction+"-closed")){
                app_sidebar.css("display","block");
                setTimeout(function(){
                    app_container.removeClass("app-sidebar-"+app_sidebar_direction+"-closed");
                },10);
                
            }else{
                app_sidebar.css("display","none");
                app_container.addClass("app-sidebar-"+app_sidebar_direction+"-closed");
            }
            //app_container.toggleClass("app-sidebar-"+app_sidebar_direction+"-closed");            
            //app_sidebar.toggleClass("app-sidebar-open"); ??? WTF?
            
            $(window).resize();
            
            return false;
        });
        $("[data-sidebar-minimize]").on("click",function(){
            
            if($(window).width() < app.settings.screen_md) return false;
            
            var app_sidebar = $($(this).data("sidebar-minimize")),
                app_sidebar_direction = app_sidebar.hasClass("dir-left") ? 'left' : 'right',
                app_container = app_sidebar.parent(".app-container"),
                toggle_class = "app-sidebar-"+app_sidebar_direction+"-minimized";                
                
            app_container.removeClass("app-sidebar-"+app_sidebar_direction+"-closed");
            app_sidebar.css("display","block");
            
            if(app_container.hasClass(toggle_class)){
                app_container.removeClass(toggle_class);
                app_sidebar.removeClass("app-navigation-minimized").find("li.open").removeClass("open");                
                app_sidebar.removeAttr("data-minimized").removeData("minimized");                                
                
                if(app_sidebar.hasClass("scroll"))
                    app_sidebar.mCustomScrollbar("update");
            }else{
                app_container.addClass(toggle_class);
                app_sidebar.addClass("app-navigation-minimized").find("li.open").removeClass("open");
                app_sidebar.removeAttr("data-minimized").removeData("minimized");
                
                if(app_sidebar.hasClass("scroll"))
                    app_sidebar.mCustomScrollbar("disable",true);
            }                                    
            
            // fix after resize                                                
            $(window).resize();
            
            return false;
        });        
        
        // sidepanel
        
        
        $("[data-sidepanel-toggle]").on("click",function(){
            var app_sidepanel = $($(this).data('sidepanel-toggle'));
                
            if($(".app").hasClass("app-sidepanel-open")){
                // close sidepanel
                $(".app").removeClass("app-sidepanel-open");
                
                // remove overlay if needs
                if(app_sidepanel.data("overlay") === 'show'){
                    app.hideOverlay();
                }
                
            }else{
                // open sidepanel
                $(".app").addClass("app-sidepanel-open");
                
                // show overlay if needs
                if(app_sidepanel.data("overlay") === 'show'){
                    app.showOverlay(function(){
                        $(".app-overlay").on("click",function(){                            
                            $(".app").removeClass("app-sidepanel-open");
                            app.hideOverlay();
                        });
                    });
                }
            }
            
            // fix after resize
            $(window).resize();
            
            return false;
        });
        // end sidepanel actions
        
        // separated content actions
        $("[data-separate-toggle-panel]").on("click",function(){
            $($(this).data("separate-toggle-panel")).toggleClass("open");
        });
    },
    layoutSidebars: function(){
        
        // control sidebar media
        if($(window).width() < app.settings.screen_md){
            if($(".app-container").hasClass("app-sidebar-left-minimized")){
                $(".app-container").removeClass("app-sidebar-left-minimized");
                $(".app-sidebar.dir-left").removeClass("app-navigation-minimized");
                $(".app-sidebar.dir-left").attr("data-minimized","minimized");
            }
            if($(".app-container").hasClass("app-sidebar-right-minimized")){
                $(".app-container").removeClass("app-sidebar-right-minimized");
                $(".app-sidebar.dir-right").removeClass("app-navigation-minimized");
                $(".app-sidebar.dir-right").attr("data-minimized","minimized");
            }
        }else{
            if($(".app-sidebar.dir-left").data("minimized") === "minimized"){                
                $(".app-container").addClass("app-sidebar-left-minimized");
                $(".app-sidebar.dir-left").addClass("app-navigation-minimized");
            }                        
            if($(".app-sidebar.dir-right").data("minimized") === "minimized"){
                $(".app-container").addClass("app-sidebar-right-minimized");
                $(".app-sidebar.dir-right").addClass("app-navigation-minimized");               
            }                        
        }
        // end
        
    },
    navigation: function(){
        
        // set openable navigation items
        $(".app-navigation nav > ul").find("ul").parent("li").addClass("openable"); 
        
        // set open element if it's avail
        if(app.settings.navDetectAuto && !$(".app-navigation").hasClass("app-navigation-minimized")){
            var path        = window.location.pathname,
                pathArray   = path.split("/"),
                page        = pathArray[pathArray.length - 1];
            
            $(".app-navigation a[href='"+page+"']").addClass("active").parents(".openable").addClass("open");
        }
        
        // add open handler
        $(".app-navigation .openable > a").on("click",function(e){
            e.stopPropagation();
            
            var element = $(this).parent(".openable");
            
            if(element.hasClass("open")){
                element.removeClass("open");
                element.find("li.open").removeClass("open");
            }else{
                
                if(element.parents(".app-navigation").hasClass("app-navigation-minimized") || element.parents(".app-navigation").data("type") === "close-other"){                   
                    element.parent("ul").find("> li").not(element).removeClass("open"); 
                }

                //element.parents(".app-navigation").css("height","auto"); // Tell me why?
                element.addClass("open");
            }
            
            // fix after resize
            
            if($(".app-navigation").hasClass("scroll")){
               $(".app-navigation").mCustomScrollbar("update");
            }else{
                $(window).resize();
            }
            
            return false;
        });
        
        // horizontal navigation handler 
        $(".app-navigation-horizontal nav > ul > li > ul").each(function(){
            $(this).parent("li").addClass("openable");
        });
        
        // set open element if it's avail
        if(app.settings.navHorizontalDetectAuto){
            var path        = window.location.pathname,
                pathArray   = path.split("/"),
                page        = pathArray[pathArray.length - 1];
            
            $(".app-navigation-horizontal a[href='"+page+"']").parent("li").addClass("active").parents(".openable").addClass("active");
        }
        
        $(".app-navigation-horizontal .openable > a").on("click",function(e){
            e.stopPropagation();
            
            var nav = $(this).parents(".app-navigation-horizontal");            
            nav.find(".openable").removeClass("active");
            
            $(this).parent(".openable").addClass("active");
            
            return false;
        });
        // end horizontal navigation handler 
    },
    navigationMobile: function(){
        
        /* Mobile navigation handler */
        if($(".app-navigation-moblie-wrapper").length > 0){
            $("[data-navigation-mobile-toggle]").on("click",function(e){
                e.stopPropagation();
                $(".app").toggleClass("app-navigation-moblie-open");            
                
                return false;
            });                

            $(".app .app-navigation-mobile").on("click",function(e){
                e.stopPropagation();
            });

            $(".app .app-content").on("click",function(){
                $(".app").removeClass("app-navigation-moblie-open");
            });
        }
        /* end Mobile navigation handler */
        
        /* header navigation handler */
        if($(".app-header-navigation").length > 0){
            
            $("[data-header-navigation-toggle]").on("click",function(){                
                $(".app-header-navigation").toggleClass("show");
                return false;
            });
            
            $(".app-header-navigation li > a").on("click",function(){
                var pli = $(this).parent("li");
                
                if(pli.find("ul").length > 0 || pli.find(".app-header-navigation-megamenu").length > 0){                    
                    pli.toggleClass("open");
                    
                    return false;
                }
            });
            
        }
        /* end header navigation handler */
        
        /* navigation vertical handler */
        if($(".app-navigation-horizontal").length > 0){
            $("[data-navigation-horizontal-toggle]").on("click",function(){
                $(".app-navigation-horizontal").toggleClass("show");
                
                return false;
            });
        }
        /* end navigation vertical handler */
    },
    spy: function(){
        
        app.layoutSidebars();               
        
        var winHeight = $(window).height(),
            offsetHeight = this._getHeaderHeight() + this._getFooterHeight() + this._getCustomOffset(),
            navFixed = $(".app-container .app-sidebar.app-navigation-fixed").length > 0 ? true : false,
            sidebars = $(".app-container .app-sidebar"),
            content = $(".app-container .app-content"),
            sidepanel = $(".app-sidepanel").length > 0 ? $(".app-sidepanel") : false;
            
            sidebars.css({"height":"auto"});            
            
        var contentHeight = app._getTotalHeight(content.children()),
            sidebarHeight = this._getMaxHeight(sidebars);
        
        if($(window).width() > app.settings.screen_md){
            
            if(contentHeight >= sidebarHeight){                
                sidebars.height(contentHeight);
                
                if(sidebarHeight === 0 && (contentHeight+offsetHeight) < winHeight){
                    content.height(winHeight - offsetHeight);
                }
            }else{
                if((sidebarHeight + offsetHeight) <= winHeight){
                    sidebars.height(winHeight - offsetHeight);
                }                                
            }

            sidebars.each(function(){
                if($(this).attr("data-control-height") === 'true'){
                    $(this).height(sidebarHeight);
                }
            });
            
            if($("[data-separate-control-height]").length > 0){
                var contentHeight = $(".app-content").height() - app._getTotalHeight($(".app-content > div").not(".app-content-separate"));
                $("[data-separate-control-height]").height(contentHeight);
            }
            
                        
            if(navFixed){
                var nav = $(".app-container .app-sidebar.app-navigation-fixed");
                
                if(app.footer){
                    nav.addClass("app-navigation-fixed-absolute");
                    
                    //if($(".app").height() < winHeight)
                    //if($(".app").height() < winHeight)
                    
                    nav.height($(".app").height() - app.footer.height());
                }else
                    nav.height(winHeight);
            }

            if(sidepanel) sidepanel.height(winHeight);
            
        }else{
            if($("[data-separate-control-height]").length > 0){
                $("[data-separate-control-height]").css({"height":"auto"});
            }                        
            
            sidebars.each(function(){
                if($(this).attr("data-control-height") === 'true'){
                    $(this).height(app.settings.sidebarMobileHeight);
                }else{
                    $(this).css({"height":"auto"});
                }
            });
            
            if(sidepanel) 
                sidepanel.height($(window).height());                
                //sidepanel.height(app.settings.sidepanelMobileHeight);
        }
        
        return false;        
    },
    
    /* block predefined functions */
    block: {
        delete: function(elm, fn){
            elm = $(elm);
            
            elm.fadeOut(200,function(){
                $(this).remove();
            });
            
            if(typeof fn === "function") fn();
            
            app.spy();
            
            return false;
        },
        toggle: function(elm, fn){
            elm = $(elm);
            
            elm.toggleClass("block-toggled");
            
            if(typeof fn === "function") fn();
            
            app.spy();
            
            return false;
        },
        expand: function(elm, fn){
            elm = $(elm);
                        
            elm.toggleClass("block-expanded");            
            
            if(typeof fn === "function") fn();
            
            return false;
        }
    },
    panel: {
        delete: function(elm, fn){
            elm = $(elm);
            
            elm.fadeOut(200,function(){
                $(this).remove();
            });
            
            if(typeof fn === "function") fn();
            
            app.spy();
            
            return false;
        },
        toggle: function(elm, fn){
            elm = $(elm);
            
            elm.toggleClass("panel-toggled");
            
            if(typeof fn === "function") fn();
            
            app.spy();
            
            return false;
        },
        expand: function(elm, fn){
            elm = $(elm);
                        
            elm.toggleClass("panel-expanded");            
            
            if(typeof fn === "function") fn();
            
            return false;
        }
    },
    /* end block predefined functions */
    
    /* resizable layout */    
    resizableLayout: function(){
        
        if($(".app-content-resizable").length === 0) return false;
                        
        var minWidth    = 300,
            wrapper     = $(".app-content-resizable"),
            columns     = wrapper.children(".app-content-resizable-column");                                    
                        
            $(".app-content-resizable-column").not(":last-child").resizable({
                handles: "e",
                minWidth: minWidth,
                start: function(e, ui) {
                    columns.each(function(){
                        $(this).width($(this).width());
                    });
                },
                resize: function(e, ui){                    
                    
                    var next            = $(this).next(".app-content-resizable-column"),                        
                        otherElements   = $(".app-content-resizable-column").not(next).not($(this)),
                        otherWidth      = app._getMaxWidth(otherElements),
                        newWidth        = wrapper.width() - otherWidth - ui.size.width;
                                                                    
                    if(newWidth < minWidth){
                        newWidth = minWidth;
                        
                        $(this).width(wrapper.width() - otherWidth - minWidth);
                        next.width(newWidth);
                        
                        return false;
                    }
                    
                    next.width(newWidth);
                },
                stop: function(e, ui) {
                    
                    columns.each(function(){
                        $(this).width( Math.round(($(this).width() / wrapper.width()) * 100) + "%" );
                    });
                    
                }
            });//.on('resize', function (e) {
                //e.stopPropagation(); 
            //});
    },
    /* end resizable layout */
    
    /* features */
    features: {
        gallery: {
            init: function(){
                this.controlHeight();
                
                $(".app-feature-gallery > li").on("click",function(){
                    var gallery = $(this).parents(".app-feature-gallery");
                    $(this).appendTo(gallery);
                });
            },
            controlHeight: function(){                
                $(".app-feature-gallery").each(function(){                    
                    var felm = $(this).find("> li:first");                    
                    $(this).height(app._getTotalHeight(felm.children()));                    
                });                
            }
        },
        preview: {
            init: function(){
                var preview = $("#preview"),
                    dialog  = preview.find(".modal-dialog"),
                    content = preview.find(".modal-body");                
                
                $(".preview").on("click",function(){      
                    content.html("");
                    dialog.removeClass("modal-lg modal-sm modal-fw");
                    
                    if($(this).data("preview-image"))
                        content.append(app.features.preview.build.image($(this).data("preview-image")));
                                                
                    if($(this).data("preview-video"))
                        content.append(app.features.preview.build.video($(this).data("preview-video")));
                    
                    if($(this).data("preview-href")){                        
                        content.html(app.features.preview.build.href($(this).data("preview-href")));
                        app_plugins.loaded();
                    }
                    
                    if($(this).data("preview-size"))
                        dialog.addClass($(this).data("preview-size"));                                                           
                    
                    if($(this).data("preview-title") && $(this).data("preview-description"))
                        content.prepend(app.features.preview.build.text($(this).data("preview-title"),$(this).data("preview-description")));                    
                    
                    preview.modal("show");
                    
                    return false;
                });
                
                preview.on('hidden.bs.modal',function(){
                    content.html("");
                });
                                
            },
            build: {
                image: function(src){
                    return $("<img>").attr("src",src).addClass("img-responsive");
                },
                video: function(src){
                    return $("<div class=\"app-preview-video\"><iframe src=\""+src+"\" width=\"100%\" frameborder=\"0\" allowfullscreen></iframe></div>");
                },
                href: function(path){
                    
                    var result = null;
                    
                    $.ajax({url: path,type: 'get',dataType: 'html',async: false,
                        success: function(data) {
                            result = data;
                        }
                    });
                    
                    return result;                                        
                },
                text: function(title,description){
                    return $("<div></div>").addClass("app-heading app-heading-small app-heading-condensed").append( $("<div></div>").addClass("title").html("<h5>"+title+"</h5><p>"+description+"</p>") );
                }
            }
        }                      
    },
    /* end features */
    
    /* accordion feature */
    accordion: function(){
        
        if($(".app-accordion").length > 0){
            
            $(".app-accordion").each(function(){
               var app_accordion = $(this);
               
               app_accordion.find(".item").each(function(){
                    var app_accordion_item = $(this);
                   
                    if(!app_accordion.data("type"))
                        app_accordion.addClass("app-accordion-simple");
                   
                    app_accordion_item.find(".heading").on("click",function(){
                       
                        if(app_accordion_item.hasClass("open"))
                            app_accordion_item.removeClass("open").removeAttr("style");
                        else
                            app_accordion_item.addClass("open");
                                                                       
                        
                        if(app_accordion.data("open") === "close-other"){
                           app_accordion.find(".item").not(app_accordion_item).removeClass("open").removeAttr("style");                           
                        }
                        
                        if(app_accordion.data("type") === "full-height"){
                            app.accordionFullHeight(app_accordion);
                        }
                        
                    });
               }); 
                
            });
            
        }
        
    },
    accordionFullHeight: function(accordion){        
        if(accordion.hasClass("app-accordion-simple")) return false;
                        
        var wrapper = accordion.parent("div"),
            items = accordion.find(".item"),
            itemsCount = items.length,
            openItemsCount = items.filter(".open").length;
        
        accordion.height(wrapper.height());                
        
        var items = items.filter(".open");        
            items.removeAttr("style");
        
        var freeHeight = wrapper.height() - (itemsCount - openItemsCount) * app.accordion_settings.titleHeight;
        var height = Math.floor(freeHeight / openItemsCount);
        
        items.each(function(){
            $(this).height(height);
            $(this).find(".content").height(height - app.accordion_settings.titleHeight);
        });
    },
    accordionFullHeightSpy: function(){
        $(".app-accordion").each(function(){                        
            app.accordionFullHeight($(this));
        });                    
    },
    accordionFullHeightResize: function(){        
        $(".app-accordion").removeAttr("style").find(".item.open").removeAttr("style");
        
        delayBeforeFire(function(){
            app.accordionFullHeightSpy();
        },200);
    },
    /* end accordion feature */
    
    /* content tabs */
    contentTabs: function(){
        
        if($(".app-content-tabs").length > 0){
            
            $(".app-content-tabs a .close-tab").on("click",function(e){
                e.stopPropagation();                                
                
                var act = $(this).parents(".app-content-tabs");
                
                $($(this).parent("a").attr("href")).remove();                                
                $(this).parents("li").remove();
                
                act.find("li:first > a").trigger("click");
            });
            
            $(".app-content-tabs a").on("click",function(){
                $(".app-content-tabs a, .app-content-tab").removeClass("active");                
                $(this).addClass("active");                
                $($(this).attr("href")).addClass("active");
                
                return false;
            });
    
        }
        
    },
    /* end content tabs */    
    
    /* features */
    showOverlay: function(func){
        $(".app-overlay").addClass("show");        
        if(typeof func === "function") func();        
    },
    hideOverlay: function(){
        $(".app-overlay").removeClass("show");
    },
    formsFile: function(){
        
        $("input.file").each(function(){
            var if_title = typeof $(this).attr("title") === "undefined" ? "Browse" : $(this).attr("title");
            var if_class = $(this).attr("class").replace("file","");

            if_class = if_class === "" ? " btn-default" : if_class;
            if_class = $(this).is(":disabled") ? if_class+" disabled" : if_class;

            $(this).wrap("<a href=\"#\" class=\"file-input btn"+if_class+"\"></a>").parent("a").append(if_title);
            $(this).parent("a").after("<span class=\"file-input-name\"></span>");
        });

        $("input.file").on("change",function(){
            
            var files = $(this)[0].files,
                text = "",
                divider = files.length > 1 ? divider = ", " : "";
            
            for (var i = 0; i < files.length; i++)
                text += files[i].name.split('/').pop().split('\\').pop() + (i !== (files.length - 1) ? divider : "");
            
            $(this).parent("a").next(".file-input-name").html(text);            
        });
            
    },    
    misc: function(){
        
        /* fix height after shown */
        $(".panel-collapse").on("shown.bs.collapse", function(){            
            $(window).resize();
        });
        /* end */
        
        /* fix height after tab shown */
        $("a[data-toggle='tab']").on("shown.bs.tab", function(){
            $(window).resize();
        });
        /* end */
        
        /* icon preview */
        $(".icons-preview > li").on("click",function(){
            
            var icon = $(this).find(".name").html();
            
            $("#modal-icon-preview .modal-icon-preview-name").html(icon);
            $("#modal-icon-preview .modal-icon-preview-span").val("<span class=\""+icon+"\"></span>");            
            $("#modal-icon-preview .modal-icon-preview-value").val(icon);                        
            $("#modal-icon-preview .modal-icon-preview-icon span").removeAttr("class").addClass(icon);
            
            $("#modal-icon-preview").modal("show");
        });
        
        $(".modal-icon-preview-value, .modal-icon-preview-span").on("click",function(){
            $(this).select();
        });
        /* end icon preview */        
        
        /* lock screen */
        $(".app-lock .app-lock-user").on("click",function(){
            $(".app-lock").addClass("app-lock-open");
            $(".app-lock .app-lock-form").show().addClass("animated bounceIn");
            $(".app-lock .app-lock-form .form-control").focus();
        });        
        /* ./lock screen */        
        
        // New selector case insensivity        
        $.expr[':'].containsi = function(a, i, m) {
            return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };
    },
    doc_nav: function(){
        
        var wH = $(window).height(),
            nav = $(".doc_fix_nav"),
            pdw = nav.parent("div").width() - 27;
    
        if(nav.length > 0){
            nav.width(pdw);
            
            if(nav.height() > wH){
                nav.height(wH - 60);                
                nav.mCustomScrollbar({axis:"y", autoHideScrollbar: true, scrollInertia: 200, advanced: {autoScrollOnFocus: false}});
            }
            
            $(window).scroll(function(){
                var wp = $(window).scrollTop();
                var point = $(document).height() - 397 - nav.outerHeight(true);

                if(wp > 175){
                    nav.addClass("fixed");

                    if(wp > point)
                        nav.addClass("stack");
                    else
                        nav.removeClass("stack");

                }else{
                    nav.removeClass("fixed");
                }               

            });
            
        }
        
    },
    loading: function(action,options){

        var settings = $.extend({
            state: '',            
            value: [0,0],
            position: '',
            speed: 20,
            complete: null
        },options);

        if(action == 'show' || action == 'update'){
            
            if(action == 'show'){
                $(".app-loading").remove();
                var loading = '<div class="app-loading '+settings.position+'">\n\
                               <div class="app-loading-progress'+(settings.state != '' ? ' app-loading-'+settings.state: '')+'" style="width:'+settings.value[0]+'%;"></div>\n\
                           </div>';
                $('body').append(loading);
            }
            
            var i  = $.isArray(settings.value) ? settings.value[0] : $(".app-loading .app-loading-progress").width();
            var to = $.isArray(settings.value) ? settings.value[1] : settings.value;            
            
            var timer = setInterval(function(){
                $(".app-loading .app-loading-progress").css('width',i+'%'); i++;
                
                if(i > to){
                    clearInterval(timer);
                    if($.isFunction(settings.complete)){
                        settings.complete.call(this);
                    }
                }
            }, settings.speed);

        }

        if(action == 'destroy'){
            $(".app-loading").remove();
        }                
        
    },
    statusbar: {
        init: function(){
            
            $(".app-statusbar-open, .app-statusbar-close").on("click",function () {
                app.statusbar.open($(this).attr('href'));
                return false;
            });
            
        },
        open: function(id){            
            $(".app-statusbar").hide();            
            if($(id).is(":hidden")) $(id).fadeIn();            
        }
    },
    search: function(){
        
        $(".app-header-search").on("click",function(){
            $(".app-header-search > input").focus();
        });
        
    },
    _getTotalHeight: function(elm){
        var totalHeight = 0;
        
        elm.each(function(){            
            totalHeight += $(this).outerHeight(true);
        });
        
        return totalHeight;
    },
    _getMaxHeight: function(elm){
        var maxHeight = 0;
        
        elm.each(function(){            
            maxHeight = $(this).height() > maxHeight ? $(this).height() : maxHeight;
        });
        
        return maxHeight;
    },
    _getMaxWidth: function(elm){
        var maxWidth = 0;
        
        elm.each(function(){            
            maxWidth = $(this).width() > maxWidth ? $(this).width() : maxWidth;
        });
        
        return maxWidth;
    },
    _getHeaderHeight: function(){        
        return this.header ? this.header.outerHeight(true) : 0;        
    },
    _getFooterHeight: function(){        
        return this.footer ? this.footer.outerHeight(true) : 0;
    },
    _getCustomOffset: function(){
        return this.app.data("offset-height") ? this.app.data("offset-height") : 0;
    },
    _delayBeforeFire: function(){
        var timer = 0;
    
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    },
    _toggleClass: function(container,cl){        
        $(container).toggleClass(cl);        
        
        // spy height changes
        app.spy();
        
        return false;
    },
    _addClass: function(container,cl){        
        $(container).addClass(cl);        
        
        // spy height changes
        app.spy();
        
        return false;
    },
    _removeClass: function(container,cl){        
        $(container).removeClass(cl);        
        
        // spy height changes
        app.spy();
            
        return false;
    },
    loaded: function(){        
        app.spy();
        
        app.app.addClass("app-loaded");
        app.accordion();
        app.accordionFullHeightSpy();
        
        setTimeout(function(){
            $("body").scrollTop(0);            
        },200);
        
        app.isloaded = true;
    }
};

$(function(){    
    
    app.init();    
    app.layout();
    app.resizableLayout();           
    
    app.navigation();        
    app.navigationMobile();
    app.contentTabs();    
    app.formsFile();
    
    app.features.gallery.init();
    app.features.preview.init();
    app.statusbar.init();    
    
    app.search();    
    
    app.misc();
    app.doc_nav();
});

$(window).resize(function(){        
    
    delayBeforeFire(function(){
        app.accordionFullHeightResize();
        app.features.gallery.controlHeight();
        app.spy();
    },100);
    
});

var delayBeforeFire = (function(){
    var timer = 0;
    
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
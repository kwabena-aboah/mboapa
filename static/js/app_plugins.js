"use strict";

var app_plugins = {
    checkbox_radio: function(){
        if($(".app-checkbox").length > 0 || $(".app-radio").length > 0){            
            $(".app-checkbox label, .app-radio label").each(function(){
                $(this).append("<span></span>");
            });
        }
    },
    switch_button: function(){
        
        if($(".switch").length > 0){
            $(".switch").each(function(){
                $(this).append("<span></span>");
            });
        }
        
    },
    isotope: function(){
        
        var $grid = $(".grid").isotope({
            itemSelector: ".grid-element",
            layoutMode: "fitRows",
            percentPosition: true
        });

        $("button[data-filter]").on("click", function() {
            var filter = $(this).attr("data-filter");                    
            $grid.isotope({filter: filter});

            $(this).parents(".btn-group").find(".btn-primary").removeClass("btn-primary").addClass("btn-default");
            $(this).removeClass("btn-default").addClass("btn-primary");
        });

        $(window).resize(function(){
            setTimeout(function(){
                $grid.isotope('layout');
                
                app.accordionFullHeightResize();
                app.features.gallery.controlHeight();
                app.spy();
            },100);                    
        });        
    },
    formSpinner: function(){
        
        if($("input.spinner").length > 0){
            
            $("input.spinner").each(function(){
                $(this).wrap("<div class=\"spinner-wrapper\"></div>");
                $(this).after("<button class=\"spinner-button-up\"><span class=\"fa fa-angle-up\"></span></button>");
                $(this).after("<button class=\"spinner-button-down\"><span class=\"fa fa-angle-down\"></span></button>");                                                
            });                        
                                                    
            $(".spinner-button-up").on("click", function(){

                var input       = $(this).parent(".spinner-wrapper").find("input"),    
                    spinMax     = input.attr("data-spinner-max") ? parseFloat(input.data("spinner-max")) : false,
                    spinMin     = input.attr("data-spinner-min") ? parseFloat(input.data("spinner-min")) : false,
                    spinStep    = input.attr("data-spinner-step") ? parseFloat(input.data("spinner-step")) : 1,
                    val         = parseFloat(input.val()) + spinStep;                   
                    
                if(typeof spinMax !== 'undefined' && spinMax !== false){
                    if(val > spinMax) return false;
                }
                if(typeof spinMin !== 'undefined' && spinMin !== false){
                    if(val < spinMin) return false;
                }

                input.val(val);

                return false;
            });

            $(".spinner-button-down").on("click", function(){

                var input       = $(this).parent(".spinner-wrapper").find("input"),
                    spinMax     = input.attr("data-spinner-max") ? parseFloat(input.data("spinner-max")) : false,
                    spinMin     = input.attr("data-spinner-min") ? parseFloat(input.data("spinner-min")) : false,
                    spinStep    = input.attr("data-spinner-step") ? parseFloat(input.data("spinner-step")) : 1,
                    val         = parseFloat(input.val()) - spinStep;

                if(typeof spinMax !== 'undefined' && spinMax !== false){
                    if(val > spinMax) return false;
                }
                if(typeof spinMin !== 'undefined' && spinMin !== false){
                    if(val < spinMin) return false;
                }

                input.val(val);

                return false;
            });            
            
        }
        
    },
    customScrollBar: function(){
        if($(".scroll").length > 0)
            $(".scroll").mCustomScrollbar({axis:"y", autoHideScrollbar: true, scrollInertia: 200, advanced: {autoScrollOnFocus: false}});
    },    
    bootstrap_select: function(){       
        if($(".bs-select").length > 0)
           $(".bs-select").selectpicker({iconBase: '', tickIcon: 'icon-check'});       
       
    },
    bootstrap_datepicker: function(){
       
       /* in case of update datepicker 
        * icons
        *   time: "icon-clock2",
            date: "icon-calendar-full",
            up: "icon-chevron-up",
            down: "icon-chevron-down",                    
            previous: 'icon-chevron-left',
            next: 'icon-chevron-right',
            today: 'icon-calendar-insert',
            clear: 'icon-trash2',
            close: 'icon-cross'
        * 
        */
        if($("#id_date_of_birth").length > 0){
            $("#id_date_of_birth").datetimepicker({format: "YYYY-MM-DD"});
        }

        if($("#id_id_issue_date").length > 0){
            $("#id_id_issue_date").datetimepicker({format: "YYYY-MM-DD"});
        }

        if($("#id_id_expiry_date").length > 0){
            $("#id_id_expiry_date").datetimepicker({format: "YYYY-MM-DD"});
        }

        if($("#id_opening_date").length > 0){
            $("#id_opening_date").datetimepicker({format: "YYYY-MM-DD"});
        }
        
        if($(".bs-datetimepicker").length > 0){
            $(".bs-datetimepicker").datetimepicker();
        }
        if($(".bs-timepicker").length > 0){
            $(".bs-timepicker").datetimepicker({format: "LT"});
        }
        
        if($(".bs-datepicker-weekends").length > 0){
            $(".bs-datepicker-weekends").datetimepicker({format: "YYYY-MM-DD", daysOfWeekDisabled: [0, 6]});
        }
        
        if($(".bs-datepicker-inline").length > 0){
            $(".bs-datepicker-inline").datetimepicker({
                inline: true                
            });
        }
        
        if($(".bs-datepicker-inline-time").length > 0){
            $(".bs-datepicker-inline-time").datetimepicker({
                inline: true,
                 sideBySide: true
            });
        }
        
        if($(".bs-datepicker-inline-years").length > 0){
            $(".bs-datepicker-inline-years").datetimepicker({
                inline: true,
                viewMode: 'years'
            });
        }
    },
    bootstrap_popover: function(){
        $("[data-toggle='popover']").popover();
        
        $(".popover-hover").on("mouseenter",function(){             
            $(this).popover('show');
        }).on("mouseleave",function(){
            $(this).popover('hide');
        });
                
        $(".modal").on("show.bs.modal", function () {
            $("[data-toggle='popover']").popover("hide");
        });
    },
    bootstrap_tooltip: function(){        
        $("[data-toggle='tooltip']").tooltip();        
    },    
    maskedInput: function(){
        if($("input[class^='mask_']").length > 0){
            $("input.mask_tin").mask('99-9999999');
            $("input.mask_ssn").mask('999-99-9999');        
            $("input.mask_date").mask('9999-99-99');
            $("input.mask_date_rev").mask('99-99-9999');
            $("input.mask_product").mask('a*-999-a999');
            $("input.mask_phone").mask('99 (999) 999-99-99');
            $("input.mask_phone_ext").mask('99 (999) 999-9999? x99999');
            $("input.mask_credit").mask('9999-9999-9999-9999');        
            $("input.mask_percent").mask('99%');            
        }
    },
    noty: function(){
        
        $(".notify").on("click",function(){
            
            noty({
                text: $(this).data("notify"),
                type: $(this).data("notify-type"),
                layout: $(this).data("notify-layout") ? $(this).data("notify-layout") : 'topRight',
                animation: {
                    open: 'animated bounceIn',
                    close: 'animated fadeOut',                    
                    speed: 200
                }
            });
            
        });
        
    },
    datatables: function(){
        
        if($(".datatable-basic").length > 0){
            $(".datatable-basic").DataTable({
                searching: false,
                paging: false,
                info: false
            });
        }
        
        if($(".datatable-extended").length > 0){
            $(".datatable-extended").DataTable();
        }
        
    },
    knob: function(){
        $(".knob").knob({
            'format' : function (value) {
               return value + '%';
            }
        });
    },
    sparkline: function(){
        if($(".sparkline").length > 0)
            $(".sparkline").sparkline('html', { enableTagOptions: true,disableHiddenCheck: true});   
    },
    loaded: function(){
        app_plugins.customScrollBar();
        app_plugins.checkbox_radio();
        app_plugins.formSpinner();
        app_plugins.switch_button();
        app_plugins.bootstrap_select();
        app_plugins.bootstrap_popover();
        app_plugins.bootstrap_datepicker();
        app_plugins.bootstrap_tooltip();
        app_plugins.maskedInput();
        app_plugins.datatables();
        app_plugins.knob();

        app_plugins.sparkline();
        
        app_plugins.isotope();

        app_plugins.noty();
    }
};

$(function(){
    app_plugins.loaded();
});

$(document).ready(function(){
    app.loaded();
});
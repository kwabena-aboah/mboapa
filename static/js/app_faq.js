"use strict";

var app_faq = {
    init: function(){
        
        $(".app-faq-item").on("click", function(){
            $(this).toggleClass("open");

            delayBeforeFire(function(){                
                $(window).resize();
            },100);
        });
        
        $("#app_faq_open").on("click", function(){
            $(".app-faq .app-faq-item").addClass("open");
            delayBeforeFire(function(){                
                $(window).resize();
            },100);
        });

        $("#app_faq_hide").on("click", function(){
            $(".app-faq .app-faq-item").removeClass("open");
            delayBeforeFire(function(){                
                $(window).resize();
            },100);
        });
        
        $("#app_faq_remove").on("click", function(){
            var hl = $(".app-faq").find(".app-faq-highlight");
            hl.each(function(){
                var txt = $(this).html();
                $(this).after(txt);
                $(this).remove();
            });
            $("#app_faq_hide").trigger("click");
        });
        
        this.search();        
    },
    search: function(){
        
        $("#app_faq_form").on("submit",function(){
            var keyword = $("#app_faq_search").val();

            if(keyword.length >= 3){
                $(".app-faq .app-faq-item").removeClass("open");
                
                $(".app-faq").removeHighlight();

                var items = $(".app-faq .app-faq-item-content:containsi('"+keyword+"')");

                items.highlight(keyword);

                items.each(function(){
                    $(this).parent(".app-faq-item").addClass("open");
                });

                delayBeforeFire(function(){                
                    $(window).resize();
                },100);
            }                

            return false;
        });
        
    }    
};


$(function(){                        
   app_faq.init();
});

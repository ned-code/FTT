jQuery.fn.extend({   
    tabsHandler: function(options) {  
        return this.each(function() {
          var that = jQuery(this);
          jQuery(this).children("li").children("a")
            .click(function(){
              that.children("li").children("a").removeClass("selected");
              jQuery(this).addClass("selected");
            });
        });  
    }  
});
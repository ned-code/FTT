// editor.init.js
//
// Makes ui components work (ONLY ui things that are NOT dependent
// on the application).

(function(undefined){
  
  var doc = jQuery(document),
      
      // Store jQuery objects
      dropdowns = {};
  
  doc.ready(function(){
    
    doc.delegate('a', 'click', function(e){
      var target = jQuery( e.currentTarget ),
          href = target.attr('href'),
          hashRefFlag = /^#/.test(href),
          anchor, dropdown;
      
      if ( hashRefFlag ) {
        
        // Cache the obj against the selector, or false
        // if there isnt one.
        if ( dropdowns[href] === undefined ) {
          anchor = jQuery(href);
          
          dropdowns[href] = anchor.length && anchor.hasClass('dropdown') ? {
            obj: jQuery(href),
            state: false
          } : false ;
        }
        
        dropdown = dropdowns[href];
        
        if ( dropdown ) {
          e.preventDefault();
          
          obj = dropdown.obj;
          
          // Control opening and closing of dropdown menu
          if (!dropdown.state) {
            dropdown.state = true;
            obj.addTransitionClass("active");
            target.addClass("active");
            
            doc.bind('click.dropdown', function(e){
              dropdown.state = false;
              obj.removeTransitionClass("active");
              target.removeClass("active");
              
              doc.unbind('.dropdown');
            });
          }
        }
      }
    });
  });
})();
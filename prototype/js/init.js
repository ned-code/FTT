var debug = (window.console && console.log);

jQuery(document).ready(function(){
  
  jQuery('#webdoc')
  .scrollbars({
    x: jQuery('#webdoc_x_scrollbar .x_scrollbar'),
    y: jQuery('#webdoc_y_scrollbar .y_scrollbar')
  });
  
  if (debug) console.log('jQuery.support.css.borderBox', jQuery.support.css.borderBox);
  if (debug) console.log('jQuery.support.css.borderBoxMinMax', jQuery.support.css.borderBoxMinMax);
  
});

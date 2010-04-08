MTools.Application.beforeMain("explore", function() {
  //bind all necessary events
  
  // launch viewers
  WebDoc.WebdocViewer.showViewers();

  jQuery('#wd-main-filter').change(function(){
    window.location.href = "/explore?main_filter="+jQuery(this).val()+"&category_filter="+jQuery('#wd-category-filter').val();
  });

  jQuery('#wd-category-filter').change(function(){
    window.location.href = "/explore?main_filter="+jQuery("#wd-main-filter").val()+"&category_filter="+jQuery(this).val();
  });

  jQuery(document).delegate('a[href="#prev-page"]', 'click', function(){
    $("#"+$(this).attr('data-webdoc-document-id')).data('object').prevPage();
  });


  jQuery(document).delegate('a[href="#next-page"]', 'click', function(){
    $("#"+$(this).attr('data-webdoc-document-id')).data('object').nextPage();
  });


});

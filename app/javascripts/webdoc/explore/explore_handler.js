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

  jQuery(document)
  .delegate('a[href="#prev-page"]', 'click', function(e){
    $("#"+$(this).attr('data-webdoc-document-id')).data('object').prevPage();
    e.preventDefault();
  })
  .delegate('a[href="#next-page"]', 'click', function(e){
    $("#"+$(this).attr('data-webdoc-document-id')).data('object').nextPage();
    e.preventDefault();
  })
  .delegate('.webdoc-viewer-container', 'click', function(e){
    var id = $(this).attr('data-webdoc-document-id');
    window.location.href = '/documents/'+id;
  });
  
  jQuery('.webdoc-viewer-title h4').truncate();
});
/**
 * This script add viewer list capabilities to the page. It must be included in each page that uses the _viewer_list partial
 * Basically, it will instanciate all webdoc viewer on the page and connaect all webdoc viewer actions with the viewers (previous page, next page, pen, etc...)
 * @author Julien Bachmann
 */
MTools.Application.beforeMain("viewer_list_handler", function() {
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
    $("#"+$(this).attr('data-webdoc-document-id')).data('object').open();
  });
  
  jQuery('.webdoc-viewer-title h4').truncate();
});
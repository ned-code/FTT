/*
  @author Jonathan
*/

WebDoc.WebSearchController = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super('web');
    this.domNode = jQuery('#web');
    //this.createHandlers(this.domNode, 'click', this._webHandlers);
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
    this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);

    // Checkbox filters listening
    $(".filters>input[type='checkbox']")
      .attr("checked", 1)
      .change(function(){
        var panelNode = $("#"+$(this).attr("name"));
        if($(this).attr("checked")){
            panelNode.show();
        }else{
            panelNode.hide();
        }
      });
      
      //click listening
      jQuery('a[href=#search_images]').click(function(event){
        event.preventDefault();
        this.showImagesSearch();
      }.pBind(this));
      jQuery('a[href=#search_videos]').click(function(event){
        event.preventDefault();
        this.showVideosSearch();
      }.pBind(this));
  },
  
  showImagesSearch: function(){
    this.hideAll();
    jQuery('#web-images').show();
    jQuery('#web_images_result').show();
  },
  
  showVideosSearch: function(){
    this.hideAll();
    jQuery('#web-videos').show();
    jQuery('#web_videos_result').show();
  },
  
  hideAll: function(){
    jQuery('.web-search-tab').hide();
    jQuery('.web_search_result').hide();
  }
  
});
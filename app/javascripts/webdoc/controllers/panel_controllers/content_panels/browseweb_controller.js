/**
 * @author Jonathan
 * Modified by noe
 */

WebDoc.BrowsewebController = $.klass(WebDoc.Library, {
  initialize: function($super, domNodeId) {
    $super(domNodeId);
    this.domNode = jQuery('#'+domNodeId);
    //this.createHandlers(this.domNode, 'click', this._webHandlers);
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
    this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);

    // TODO don't work??
		// just to preload the icon (so that it'll be immediately available at the first drag)
		// jQuery(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("video", ""));
		// jQuery(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("image", ""));
		// jQuery(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("apps", ""));

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
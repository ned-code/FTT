/**
 * @author julien
 */

//= require <WebDoc/model/image>
WebDoc.ImageLibraryController = $.klass({
  initialize: function() {
    this.domNode = $("#image_library_wrap");
    this.loadImages();
  },
  
  loadImages: function() {
    this.domNode.find("ul").empty();
    MTools.ServerManager.getObjects("/medias?type=Medias::Image", WebDoc.Image, function(data)
        {
            this.images = data;
            this.refreshImageList();
        }.pBind(this), this);
  },
  
  refreshImageList: function() {    
    for (var i = 0; i < this.images.length; i++) {
      ddd(this.images[i]);
      var imageItem = $("<img/>").attr("src", this.images[i].data.url).addClass("image_item");
      var imageListItem = $("<li/>").append(imageItem);
      this.domNode.find("ul").append(imageListItem);
    }
  },
  
  toggle: function() {
    this.domNode.slideToggle("slow");
  }
  
});

$.extend(WebDoc.ImageLibraryController,{
});
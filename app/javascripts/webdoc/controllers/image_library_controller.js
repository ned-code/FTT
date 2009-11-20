/**
 * @author julien
 */

//= require <webdoc/model/image>
WebDoc.ImageLibraryController = $.klass({
  initialize: function() {
    this.domNode = $("#image_library_wrap");
    this.loadImages();
    this.domNode.find("ul").bind("dragstart", this.dragStart.pBind(this));    
  },
  
  loadImages: function() {
    this.domNode.find("ul").empty();
    MTools.ServerManager.getObjects("/medias?type=Medias::Image", WebDoc.Image, function(data)
        {
          this.images = {};
          for (var i = 0; i < data.length; i++) {
            this.images[data[i].uuid()] = data[i];
          }  
          this.refreshImageList();
        }.pBind(this), this);
  },
  
  refreshImageList: function() {    
    for (imageId in this.images) {
      var image = this.images[imageId];
      if (image) {
        var imageItem = $("<img/>").attr({
          id: image.uuid(),
          src: image.data.properties.thumb_url
        }).addClass("image_item");
        var imageListItem = $("<li/>").append(imageItem);
        this.domNode.find("ul").append(imageListItem);
      }
    }
  },
  
  toggle: function() {
    this.domNode.slideToggle("slow");
  },
  
  dragStart: function(e) {
    ddd("start drag");
    ddd($(e.target));
    ddd(this.images[$(e.target).attr("id")]);
    e.originalEvent.dataTransfer.setData('application/ub-image', this.images[e.target.id].data.properties.url);
  }
  
});

$.extend(WebDoc.ImageLibraryController,{
});
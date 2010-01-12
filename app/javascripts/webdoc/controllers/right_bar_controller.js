/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */

(function(undefined){

// Default settings
var panelWidth = 350;

WebDoc.RightBarController = $.klass({
  initialize: function() {
    var domNode = $("#right_bar");
    
    this.visible = false;
    this.domNode = domNode;
    
    // Store actual size of panel
    panelWidth = domNode.outerWidth();
    ddd('Width of right panel: '+panelWidth);
  },
  
  showLib: function() {
    ddd("show lib");
    
    if (!WebDoc.application.librariesController) { // lazily load the library
      WebDoc.application.librariesController = new WebDoc.LibrariesController();
    }
    
    if (this.visible) {
      ddd("animate lib");
      this.showRightBar(function() {
        $("#inspectors").slideUp("fast");
        $("#libraries").slideDown("fast");
      });
    }
  },  
  
  showInspectors: function(callBack) {
    if (this.visible) {
      $("#libraries").slideUp("fast");
      $("#inspectors").slideDown("fast", function() {
        if (callBack) {
          callBack.apply(this);
        }
      });
    }
  },
  
  showRightBar: function(callBack) {
    if (!this.visible) {
      this.visible = true;
      
      console.log('THIS');
      
      $("#right_bar")
      .animate({
          marginLeft: '-' + panelWidth + 'px'
      }, function() {
        if (callBack) {
          callBack.apply(this);
        }
      });
    }
    else {
      if (callBack) {
        callBack.apply(this);
      }
    }
  },
  
  hideRightBar: function(callBack) {
    if (this.visible) {
      this.visible = false;
      $("#right_bar").animate({
        marginLeft: 0
      }, function() {
        if (callBack) {
          callBack.apply(this);
        }
      });
    }
    else {
      if (callBack) {
        callBack.apply(this);
      }
    }
  },
  
  toggleRightBar: function() {
    if (this.visible) {
      this.hideRightBar();
    }
    else {
      this.showRightBar();
    }
  }
  
});

$.extend(WebDoc.InspectorController, {});

}());

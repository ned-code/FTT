/**
 * Controller of the right bar. It manage show, hide, toggle the right bar. It also manage if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
 
WebDoc.RightBarController = $.klass({
  initialize: function() {
    this.visible = false;
    this.domNode = $("#right_bar");
  },
  
  showLib: function() {
    ddd("show lib");
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
      $("#right_bar").animate({
        width: "300px"
      }, function() {
        WebDoc.application.boardController.centerBoard();
        if (callBack) {
          callBack.apply(this);
        }
      });
        
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginRight: "305px"
        });
      }      
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
        width: "0px"
      }, function() {
        WebDoc.application.boardController.centerBoard();
        if (callBack) {
          callBack.apply(this);
        }
      });
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginRight: "0px"
        });
      }
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
  },
  
});

$.extend(WebDoc.InspectorController, {});

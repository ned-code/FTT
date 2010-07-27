jQuery.fn.flash = function(options) {
    
    var options = !options ? {} : options;
    var domNodeId = "flash";
    var parentNode = options.parent = !options.parent ? jQuery("body") : options.parent;
    var msgNode = jQuery("#"+domNodeId).length === 0 ? jQuery("<div id='"+domNodeId+"'></div>") : jQuery("#"+domNodeId);
    var message = this;
    var duration = 2000;
    
    
    this.flash = function(){
      var that = this;
      var timeout = setTimeout(function(){hide(message)},duration);
      this.show();
    };
    
    this.show = function(){
      msgNode.append(message);
      setTimeout(function(){message.addClass("visible")},0);    
      if(!msgNode.hasClass("visible")){
        parentNode.append(msgNode);
        setTimeout(function(){msgNode.addClass("visible")},0);
      }
    }
    
    var close = function(){
      msgNode.removeClass("visible");
      msgNode.get(0).addEventListener("webkitTransitionEnd", function(e){
        msgNode.remove();
      });
    }
    
    var hide = function(node){
      if(parentNode.find(".flash_message").length <= 1){
        close();
      }
      node.removeClass("visible");
      node.get(0).addEventListener("webkitTransitionEnd", function(e){
        node.remove();
      });
    }
    
    this.isModal = function(){
      return typeof(options.modal) !== "undefined" && options.modal ? true : false;
    }
    
    msgNode
      .addClass("flash")
      .addClass("anim_opacity")
      .bind("close", close);
      
    message
      .addClass("flash_message")
      .addClass("anim_opacity");
              
    if(this.isModal())
      this.show();
    else
      this.flash();
    
}
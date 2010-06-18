/**
 * PostMessageManager is the class to start and process received message from postMessage
 *
 * @author Noe
**/

WebDoc.PostMessageManager = $.klass({
  ILLEGALCSSPARAMS: {
    'top': true,
    'left': true,
    'bottom': true,
    'right': true,
    'width': true,
    'height': true,
    'box-sizing': true,
    'clear': true,
    'display': true,
    'display-model': true,
    'display-role': true,
    'float': true,
    'float-offset': true,
    'max-height': true,
    'max-width': true,
    'min-height': true,
    'min-width': true,
    'move-to': true,
    'opacity': true,
    'outline': true,
    'outline-color': true,
    'outline-offset': true,
    'outline-style': true,
    'outline-width': true,
    'overflow-style': true,
    'overflow-x': true,
    'overflow-y': true,
    'position': true,
    'rendering-intent': true,
    'resize': true,
    'size': true,
    'string-set': true,
    'tab-side': true,
    'table-layout': true,
    'target': true,
    'target-name': true,
    'target-new': true,
    'target-position': true,
    'visibility': true,
    'z-index': true
  },
  
  initialize: function() {
    ddd('initialize message manager');
    this.startListener();
  },

  startListener: function() {
    window.addEventListener("message", function(event){
      // event.domain event.data event.source event.origin
      ddd('[post message manager] received a new message: ' + event.data);
      try {
        this.processMessage(event.data);
      } 
      catch (Exception) {
        ddd("not a message for me");
        WebDoc.appsMessagingController.processMessage(event);
      }
    }.pBind(this), false);
  },

  /*
   * Return a associative array from the url
   */
  parseUrl: function(url) {
    var array = new Array();
    array['params'] = new Array();
    url = url.slice(1,url.length);
    url_array = url.split("?");
    array['action'] = url_array[0];
    params = url_array[1].split("&");
    for(i=0;i<params.length;i++){
      keyValue = params[i].split("=");
      array['params'][keyValue[0]] = keyValue[1];
    }
    return array;
  },

  /*
   * Process an action with a optional position
   */
  processMessage: function(action, pos) {
    var parsedUrl = this.parseUrl(action);
    if(parsedUrl['action']) {
      ddd('[post message manager] action ' + parsedUrl['action']);
      switch(parsedUrl['action']) {
        case 'set_page_class':
          if(parsedUrl['params']['class']) {
            WebDoc.application.pageEditor.currentPage.setClass(parsedUrl['params']['class']);
          }
          break;
        case 'set_page_css':
          var cssParams = this.getCssParams(parsedUrl['params']);
          WebDoc.application.pageEditor.currentPage.addCss(cssParams);
          break;
        case 'set_item_class':
          var selection = WebDoc.application.boardController.selection()[0];
          if(selection && selection.item) {
            if(parsedUrl['params']['class']) {
              selection.item.setClass(parsedUrl['params']['class']);
            }
          }
        break;
        case 'set_item_css':
          var selection = WebDoc.application.boardController.selection()[0];
          if(selection && selection.item) {
            var cssParams = this.getCssParams(parsedUrl['params']);
            selection.item.addCss(cssParams);
          }
          break;
        case 'add_item':
          if(parsedUrl['params']['type']) {
            switch(parsedUrl['params']['type']) {
              case 'image':
                if(parsedUrl['params']['url']) {
                  WebDoc.application.boardController.insertImage(parsedUrl['params']['url'], pos);
                }
                break;
              default:
                break;
            }
          }
          break;
        default:
          ddd('[post message manager] action not implemented');
          break;
      }
    } else {
      ddd('[post message manager] action not found')
    }
  },

  getCssParams: function(params) {
    var cssArray = new Array();
    for (param in params) {
      if ( !ILLEGALCSSPARAMS[param] ) {
        cssArray[param] = params[param];
      }
    }
    return cssArray;
  }

});


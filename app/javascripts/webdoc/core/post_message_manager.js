/**
 * PostMessageManager is the class to start and process received message from postMessage
 *
 * @author Noe
**/

WebDoc.PostMessageManager = $.klass({
  initialize: function() {
    ddd('initialize message manager');
    this.startListener();
  },

  startListener: function() {
    window.addEventListener("message", function(event){
      // event.domain event.data event.source event.origin
      ddd('[post message manager] received a new message: ' + event.data);

      if (event.origin !== "http://assets.test.webdoc.com" &&
          event.origin !== "http://assets.staging.webdoc.com" &&
          event.origin !== "http://assets.webdoc.com" &&
          event.origin !==  'http://localhost') {
        ddd(event.origin + ' not allowed!');
        return;
      } else {
        var parsedUrl = this.parseUrl(event.data);
        this.processMessage(parsedUrl);
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

  processMessage: function(parsedUrl) {
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
          if(parsedUrl['params']['class']) {
            var selection = WebDoc.application.boardController.selection()[0];
            if(selection && selection.item) {
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
      if (param === 'border' || param === 'background-color') {
        cssArray[param] = params[param];
      }
    }
    return cssArray;
  }

});


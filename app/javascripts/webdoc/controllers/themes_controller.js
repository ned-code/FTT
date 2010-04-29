// Themes controller
//
// Stephen Band

WebDoc.ThemesController = jQuery.klass({
  
  // Constructor     
  initialize: function() {
    var that = this;
    
    this.chooserNode = jQuery("<div/>");
    this.listNode = jQuery('<ul/>', {'class': 'vertical thumbs themes-index index'});
    
    // Delegate event handling
    WebDoc.handlers.addPanelHandlers( 'click', {
      'themes-chooser': this.handlers.openChooser
    }, this );
    
    WebDoc.handlers.addDocumentHandlers( 'click', {
      'theme': this.handlers.changeTheme
    }, this );
    
    this._updateListNode();
  },
  
  // Event handlers
  handlers: {
    changeTheme: function(e){
      var link = jQuery(e.currentTarget),
          data = link.data('theme');
      
      // Give this link theme data, if it does not already have it
      if (!data) {
        data = this.list[ link.attr('data-theme') ];
        link.data('theme', data);
      }
      
      ddd('[Themes Controller] instantiate theme: '+data.name);
      
      WebDoc.application.pageEditor.currentDocument.setTheme( data );
    },

    openChooser: function(e){
      var anchor = e && jQuery(e.currentTarget);
    
      this.listNode
      .pop({
        attachTo: anchor,
        initCallback: function(){
          //console.log('HEY - THEMES CONTROLLER');
        }
      })
    
      ddd('[Themes] open chooser');
    }
  },
  
  // Themes list
  list: {
    'swisschocolate': {
      id: 'swisschocolate',
      name: 'Swiss Chocolate',
      version: 0.1,
      path: '/themes/swisschocolate',
      thumb: '/images/thumb.png',
      stylesheet: '/css/typography.css'
    },
    'notmytype': {
      id: 'notmytype',
      name: 'Not My Type',
      version: 0.1,
      path: '/themes/notmytype',
      thumb: '/images/thumb.png',
      stylesheet: '/css/typography.css'
    },
    'default': {
      id: 'default',
      name: 'Webdoc default',
      version: 0.1,
      path: '/themes/default',
      thumb: '/images/thumb.png',
      stylesheet: '/css/typography.css'
    }
  },
  
  // Populate listNode with list of themes
  _updateListNode: function(){
    var key, item,
        list = this.list,
        html = '';
    
    for (key in list) {
      item = list[key];
      
      html += '<li><a href="#theme" data-theme="'+key+'" style="background-image: url(\''+ item.path + item.thumb +'\');"><h3>'+key+'</h3></a></li>';
    }
    
    this.listNode.html(html);
  }
});
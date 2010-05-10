// Themes controller
//
// Stephen Band

WebDoc.ThemesController = jQuery.klass({
  
  // Constructor     
  initialize: function() {
    var that = this,
        defaultTheme;
    
    this.chooserNode = jQuery("<div/>");
    this.listNode = jQuery('<ul/>', {'class': 'vertical thumbs themes-index index'});
    this.list = {};
    this._currentTheme;
    this._previousTheme;
    
    // Delegate event handling
    WebDoc.handlers.addPanelHandlers( 'click', {
      'themes-chooser': this.handlers.openChooser
    }, this );
    
    WebDoc.handlers.addDocumentHandlers( 'click', {
      'theme': this.handlers.changeTheme
    }, this );
    
    // Get themes and populate themes list
    WebDoc.ServerManager.getRecords( WebDoc.Theme, null, function( themes ){
      var theme, l = themes.length;
      
      // Convert array to object so that we
      // can reference themes by id later
      while(l--){
        theme = themes[l];
        that.list[ theme.data.id ] = theme;
      }
    });
    
    defaultTheme = WebDoc.ThemeManager.getInstance().getDefaultTheme();
    
    this.list['default'] = defaultTheme;
  },
  
  // Event handlers
  handlers: {
    changeTheme: function(e){
      var link = jQuery(e.currentTarget),
          data = link.data('theme');
      
      // Give this link theme data, if it does not already have it
      if (!data) {
        data = this.list[ link.attr('data-theme-id') ];
        link.data('theme', data);
      }
      
      ddd('[Themes Controller] set theme: ' + data.getTitle() );
      
      this.setTheme( data );
    },

    openChooser: function(e){
      var anchor = e && jQuery(e.currentTarget);
      
      this._refreshListNode();
      
      this.listNode
      .pop({
        attachTo: anchor,
        initCallback: function(){
          //console.log('HEY - THEMES CONTROLLER');
        }
      });
    
      ddd('[Themes] open chooser');
    }
  },
  
  setTheme: function( data ){
    this._previousTheme = this._currentTheme;
    this._currentTheme = data;
    WebDoc.application.pageEditor.currentDocument.setTheme( data );
  },
  
  getCurrentTheme: function(){
  	return this._currentTheme;
  },
  
  getPreviousTheme: function(){
  	return this._previousTheme;
  },
  
  // Populate listNode with list of themes
  _refreshListNode: function(){
    var list = this.list,
        html = '',
        theme, key;
      
    for (key in list) {
      theme = list[key];
      html += '<li><a href="#theme" data-theme-id="'+key+'" style="background-image: url(\''+ theme.getThumbnailUrl() +'\');"><h3>'+theme.getTitle()+'</h3></a></li>';
    }
    
    this.listNode.html(html);
  }
});
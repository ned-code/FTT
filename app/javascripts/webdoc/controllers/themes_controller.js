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
    
    // Delegate event handling
    WebDoc.handlers.addPanelHandlers( 'click', {
      'themes-chooser': this.handlers.openChooser
    }, this );
    
    WebDoc.handlers.addDocumentHandlers( 'click', {
      'theme': this.handlers.changeTheme
    }, this );
    
    // Get themes and populate themes list
    MTools.ServerManager.getRecords( WebDoc.Theme, null, function( themes ){
      var theme, l = themes.length;
      
      // Convert array to object so that we
      // can reference themes by id later
      while(l--){
        theme = themes[l];
        console.log('THEME', theme);
        that.list[ theme.data.id ] = theme;
      }
    });
    
    defaultTheme = new WebDoc.Theme({
      theme: {
        id: 'default',
        name: 'Webdoc Default',
        layouts: [],
        style_url: '/themes/default/css/typography.css',
        thumbnail_url: ''
      }
    });
    
    // Override theme object methods
    // that we don't want on default
    defaultTheme.refresh = function(){};
    
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
      
      ddd('[Themes Controller] set theme: ' + data.getName() );
      
      WebDoc.application.pageEditor.currentDocument.setTheme( data );
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
      })
    
      ddd('[Themes] open chooser');
    }
  },
  
  // List of themes
  list: {},
  
  // Populate listNode with list of themes
  _refreshListNode: function(){
    var list = this.list,
        html = '',
        theme, key;
      
    for (key in list) {
      theme = list[key];
      html += '<li><a href="#theme" data-theme-id="'+key+'" style="background-image: url(\''+ theme.getThumbnailUrl() +'\');"><h3>'+theme.getName()+'</h3></a></li>';
    }
    
    this.listNode.html(html);
  }
});
/**
 * @author David / Stephen
 */
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/gui/item_thumbnail_view>

(function(){

var defaultTitle = 'enter a title',
    defaultClass = 'default',
    screenClass = 'screen layer',
    numberClass = 'number',
    cancelClass = 'cancel',
    popClass = 'pop';

WebDoc.PageBrowserItemView = $.klass({
  
  //TITLE_CLASS: 'page-title',
  LOADING_ICON_CLASS: 'loading-icon',
  EDIT_ICON_CLASS: 'edit-icon mode-edit-show',
  THUMB_CLASS: 'thumb',
  DEFAULT_CLASS: 'default',
  
  initialize: function(page) {
    var self = this;
    
    this.page = page;
    
    try {
      var titleObj = this.getPageTitle(page),
          pageItem = $('<li/>'),
          //pageItemTitle = $('<div/>').addClass( this.TITLE_CLASS ),
          pageItemNumber = $('<span/>').addClass(numberClass),
          pageItemEdit = $('<a/>', {href: '#pop', target: 'pop', title: 'Click to edit'}).addClass( this.EDIT_ICON_CLASS ).html('<span>edit</span>'),
          pageItemLoading = $('<span/>').addClass( this.LOADING_ICON_CLASS ),
          pageItemThumb = $('<div/>').addClass( this.THUMB_CLASS + " " + page.document.styleClass() ),
          pageItemThumbView = new WebDoc.PageThumbnailView(page, 128, 128).domNode,
          popForm = $('<form/>', { method: 'post', 'class': 'ui-pop-page-title' }),
          popLabel = $('<label/>', { 'class': 'underlay' }).text('enter a title'),
          popTitle = $('<input/>', { type: 'text', title: 'Page title', name: 'page-title', value: '', autocomplete: 'off' }),
          popActions = $('<div/>', { 'class': "ui-actions" }),
          popSubmit = $('<input/>', { type: 'submit', name: 'page-title-form', value: 'Save' }),
          popCancel = $('<a/>', { href: '#cancel', 'class': cancelClass, html: 'cancel' });
      
      this.domNode = pageItem;
      this.thumbNode = pageItemThumb;
      //this._titleNode = pageItemTitle;
      this._titleEditNode = pageItemEdit;
      this._popForm = popForm;
      this._popTitle = popTitle;
      
      // If the title is default
      //if(titleObj.defaultBehavior) {
      //  if( this.page.nbTextItems() > 0 ) {
      //    this.page.getFirstTextItem().addListener(this);
      //  }
      //  pageItemTitle.addClass( defaultClass );
      //}
      
      // Construct Pop DOM Tree
      popForm
      .append( popLabel )
      .append( popTitle )
      .append(
        popActions
        .append( popCancel )
        .append( popSubmit )
      );
      
      // Construct Item DOM tree
      pageItem
      //.append(
      //  pageItemTitle
      //  .text( titleObj.title )
      //)
      .append(
        pageItemThumb
        .append( pageItemThumbView )
      )
      .append( pageItemEdit )
      .append( pageItemNumber )
      .append( pageItemLoading );
      
      // Bind actions
      function clickHandler(e) {
        this.editTitle();
        e.preventDefault();
      }
      
      pageItemEdit.bind( 'click', clickHandler.pBind(this) );
      //pageItemTitle.bind( 'dblclick', clickHandler.pBind(this) );

      page.document.addListener(this);
      page.addListener(this);
    }
    catch(e) {
      ddd("PageBrowserItemView: initialize: error: "+e);
    }
  },
  
  editTitle: function( str ) {
    var self = this,
        node,
        popOptions;
    
    if ( typeof str === 'undefined' ) {
      
      popOptions = {
        // Some of these should really be put in a global setup
        popWrapClass: 'ui ui-pop-position',
        popClass: 'ui-pop ui-widget ui-corner-all',
        width: '12em',
        openEasing: 'easeOutBack',
        shutEasing: 'easeInQuart'
      };
      
      // Decide where to trigger the pop
      if ( WebDoc.application.pageBrowserController.visible ) {
        node = this._titleEditNode;
        node.css({ display: 'block' });
        
        popOptions.closeCallback = function(){
          node.css({ display: '' });
        }
      } else {
        // TODO: We lack a way of knowing what was clicked.
        node = jQuery(".toolbar-panel a[href='#add-page']");
        
        popOptions.orientation = 'bottom';
      }
      
      this._popForm.pop(
        jQuery.extend( popOptions, {
          attachTo: node,
          initCallback: function(){
            var currentTitle = self.page.getTitle();
            
            // It returns the string 'undefined'
            if (currentTitle === undefined || currentTitle === 'undefined') {
              self._popTitle.addClass( 'default' );
            }
            else {
              self._popTitle.val( currentTitle );
            }
            
            self._popTitle.bind('keyup', function(){
                
              if ( self._popTitle.val().length === 0 ) {
                self._popTitle.addClass( 'default' );
              }
              else {
                self._popTitle.removeClass( 'default' );
              }
            });
            
            // Bind stuff to do on submit
            self._popForm.bind('submit', function(e){
              self.page.setTitle( self._popTitle.val() );
              self._popForm.trigger('close');
              
              return false;
            });
            
            // Give the input focus
            self._popTitle.focus();
          }
        })
      );
    }
    else {
      // _changeTitle for string
    }
    
    return false;
  },
  
  destroy: function() {
    ddd("destroy page browser item view", this);
    this.page.removeListener(this);
    this.page.document.removeListener(this);
    this.domNode.remove();
  },

  //updateTitle: function( page ){
  //  ddd("[PageBrowserController] Update title");
  //  // Find item related to this page
  //  var newTitle = this.getPageTitle(page).title;
  //
  //  if( newTitle ) {
  //      //this._titleNode
  //      //      .removeClass( this.DEFAULT_CLASS );
  //      //this.setAndTruncateTitle( newTitle );
  //  }
  //},
  
  objectChanged: function(record, options) {
    ddd("[PageBrowserItemView] objectChanged", record);
    switch(record.className()) {
      case "page":
        //this.updateTitle(record);
        break;
      case "document":
        if (record._isAttributeModified(options, 'theme')) {
          var previousThemeClass = WebDoc.application.boardController.previousThemeClass,
              currentThemeClass = WebDoc.application.boardController.currentThemeClass;

          if (previousThemeClass) {
            this.thumbNode.removeClass(previousThemeClass);
          }
          this.thumbNode.addClass(currentThemeClass);
        }
        break;
    }
  },

  innerHtmlChanged: function() {
    ddd('innerHTMLChanged');
    //this.checkUpdateTitle();
  },

  itemAdded: function(addedItem) {
   // If page contains a single text item, it will be used to define the page title, so
   // add a listener to this item so it will notify its changes to the related browser node
   if(this.page.nbTextItems()===1 && addedItem.type() === "text") {
     addedItem.addListener(this);
   }
   //this.checkUpdateTitle();
  },

  itemRemoved: function(removedItem) {
   ddd('page_browser_item_view: itemRemoved');
   //this.checkUpdateTitle();
  },

  // Iterates through the page items and if contains a text item, takes it as page title
  // Otherwise, returns a default name
  getPageTitle: function(page) {
    if(!page.data.title || page.data.title === "undefined") {
      if(page.data.data && page.data.data.externalPage) {
        return { title: page.data.data.externalPageUrl, defaultBehavior: true} ;
      }
      else {
        for(var itemIndex in page.items) {
          if(page.items[itemIndex].type() == "text") {
            if(page.items[itemIndex].getInnerText() != "") {
              return { title: page.items[itemIndex].getInnerText(), defaultBehavior: true};
            }
            else {
              return { title: defaultTitle, defaultBehavior: true};
            }
          }
        }
        return { title: defaultTitle, defaultBehavior: true};
      }
    }
    else {
      return  { title: page.data.title, defaultBehavior: false };
    }
  },

  //checkUpdateTitle: function() {
  //  var title = this.getPageTitle(this.page);
        //currentTitle = this._titleNode.text();
    
    //if(title.title !== currentTitle) {
    //  this.setAndTruncateTitle(title.title);
    //}

    //if(title.defaultBehavior) {
    //  this._titleNode.addClass(defaultClass);
    //}
    //else {
    //  this._titleNode.removeClass(defaultClass);
    //}
  //},

  //setAndTruncateTitle: function(title) {
  //  this._titleNode.truncate(title);
  //},

  //truncateTitleWithActualTitle: function() {
  //  this.setAndTruncateTitle(this._titleNode);
  //}
  
});

})();
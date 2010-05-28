
//= require <mtools/record>

WebDoc.Document = $.klass(WebDoc.Record, {
  initialize: function($super, json) {
    this.pages = [];
    $super(json);
  },
  
  title: function() {
    return this.data.title;
  },
  
  description: function() {
    return this.data.description;
  },
  
  category: function() {
    return this.data.category_id;
  },
  
  featured: function() {
    return this.data.featured;
  },

  size: function() {
    return this.data.size;
  },
  
  creatorId: function() {
    return this.data.creator_id;
  },
  
  isShared: function() {
    return this.data.is_public;
  },
  
  setTitle: function(title, skipSave) {
    this.data.title = title;
    if(!skipSave && !skipSave === true) {
      this.fireObjectChanged({ modifedAttribute: 'title' });
      this.save();
    }
  },
  
  setDescription: function(description, skipSave) {
    this.data.description = description;
    if(!skipSave && !skipSave === true) {
      this.fireObjectChanged({ modifedAttribute: 'description' });
      this.save();
    }
  },
  
  setCategory: function(category_id, skipSave) {
    this.data.category_id = category_id;
    if(!(skipSave && skipSave === true)) {
      this.fireObjectChanged({ modifedAttribute: 'category' });
      this.save();
    }
  },

  setFeatured: function(featured, skipSave) {
    this.data.featured = featured;
    if(!(skipSave && skipSave === true)) {
      this.fireObjectChanged({ modifedAttribute: 'featured' });
      this.save();
    }
  },
  
  setSize: function(size, skipSave) {
    this.data.size = size;
    if(!(skipSave && skipSave === true)) {
      this.save();
    }
  },
  
  setTheme: function( theme, skipSave ){
    this.data.theme_id = theme.id();
    this.data.style_url = theme.getStyleUrl();
    if(!(skipSave && skipSave === true)) {
      this.fireObjectChanged({ modifedAttribute: 'theme' });
      this.save();
    }
  },
  
  getTheme: function(callBack) {
    if (this.data.theme_id && this.data.theme_id !== 'null') {
      WebDoc.ServerManager.getRecords(WebDoc.Theme, this.data.theme_id, callBack);
    }
    else {
      if (WebDoc.ThemeManager.getInstance().getDefaultTheme()) {
        callBack.call(this, [WebDoc.ThemeManager.getInstance().getDefaultTheme()]);
      }
      else {
        callBack.call(this, []);
      }
    }
  },
    
  styleUrl: function() {       
    if ((!this.data.style_url || this.data.style_url === 'null') && WebDoc.ThemeManager.getInstance().getDefaultTheme()) {
      return WebDoc.ThemeManager.getInstance().getDefaultTheme().getStyleUrl();
    }
    return this.data.style_url;
  },
  
  styleClass: function() {
    var themeName = "";
    if ( WebDoc.ThemeManager.getInstance().getDefaultTheme()) {
      WebDoc.ThemeManager.getInstance().getDefaultTheme().id();
    }
    if (this.data.theme_id) {
      themeName = this.data.theme_id;
    }     
    return "theme_" + themeName;
  },
  
  share: function() {
    this.data.is_public = true;
    this.save();
  },
  
  unshare: function() {
    this.data.is_public = false;
  },

  refresh: function($super, json) {
    $super(json);
    var that = this;
    if (json.document.pages && $.isArray(json.document.pages)) {
      this.pages = [];    
      if (this.data.pages && $.isArray(this.data.pages)) {
        for (var i = 0; i < this.data.pages.length; i++) {
          var pageData = this.data.pages[i];
          this.createOrUpdatePage({ page: pageData });
        }
      }    
    }
  },
  
  getData: function($super, withRelationShips) {
    var dataObject = $super(withRelationShips);
    delete dataObject.pages;
    if (withRelationShips && this.pages.length) {
      dataObject.pages = [];
      for (var i = 0; i < this.pages.length; i++) {
        dataObject.items.push(this.pages[i].getData(withRelationShips));
      }
    }
    return dataObject;
  },
  
  findPageWithUuidOrPosition: function(pUuid) {
    var i = 0;
    ddd("find page with uuid or position " + pUuid);
        
    var checkedAttribute = "uuid";
    if (!WebDoc.UUID.isUUID(pUuid)) {
      checkedAttribute = "position";
      var pagePosition = (parseInt(pUuid, 10) - 1);
      return this.pages[pagePosition];
    }
    else {
      for (; i < this.pages.length; i++) {
        var anObject = this.pages[i];
        if (anObject.uuid() == pUuid) {
          return anObject;
        }
      }
    }
    return null;
  },
  
  createOrUpdatePage: function(pageData) {
    var page = this.findPageWithUuidOrPosition(pageData.page.uuid);
    if (pageData.action == "delete") {
      this.removePage(page, true);
    }
    else if (!page) {
      this.createPage(pageData);
    }
    else {
      if (pageData.page.position != page.data.position) {
        this.movePage(page.uuid(), pageData.page.position);
      }
      page.refresh(pageData);
    }
  },
  
  createPage: function(pageData) {
    ddd("create page with data");
    ddd(pageData);
    var newPage = new WebDoc.Page(pageData, this);
    this.addPage(newPage, true);
    ddd("page created");
  },
  
  positionOfPage: function(page) {
    var index = $.inArray(page, this.pages);
    if (index > -1) {
      return index + 1;
    }
    return -1;
  },
  
  nextPage: function(page) {
    var index = $.inArray(page, this.pages);
    if (index + 1 < this.pages.length) {
      return this.pages[index + 1];
    }
    return null;
  },
  
  previousPage: function(page) {
    var index = $.inArray(page, this.pages);
    if (index -1 > -1) {
      return this.pages[index - 1];
    }    
    return null;
  },
  
  addPage: function(page, updateFollowing) {
    if (updateFollowing) {
      for (var i = page.data.position; i < this.pages.length; i++) {
        this.pages[i].data.position++; 
      }
    }
    page.document = this;
    this.pages.push(page);
    this.sortPages();
    this.firePageAdded(page);    
  },
  
  removePage: function(page, updateFollowing) {    
    var index = $.inArray(page, this.pages);
    if (index != -1) {
      if (updateFollowing) {
        for (var i = index + 1; i < this.pages.length; i++) {
          this.pages[i].data.position--; 
        }      
      }      
      this.pages.splice(index, 1);
      this.firePageRemoved(page);
    }
  },
 
  sortPages: function() {
    this.pages = this.pages.sort(function(a,b) {
     return a.data.position - b.data.position;
    });
  },
  
  firePageAdded: function(addedPage) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].pageAdded) {
        this.listeners[i].pageAdded(addedPage);
      }
    }    
  },
  
  firePageRemoved: function(removedPage) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].pageRemoved) {
        this.listeners[i].pageRemoved(removedPage);
      }
    }      
  },

  firePageMoved: function(movedPage, newPosition, previousPosition) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].pageMoved) {
        this.listeners[i].pageMoved(movedPage, newPosition, previousPosition);
      }
    }      
  },
  
  movePage: function(movedPageUuid, newPosition) {
    var page = this.findPageWithUuidOrPosition(movedPageUuid);
    ddd("move page", page, "to position", newPosition);
    var previousPosition = page.data.position;
    // ignore wrong new position
    if (newPosition !== previousPosition && newPosition >= 0 && newPosition < this.pages.length) {
      var i;
      // move backward
      if (newPosition < previousPosition) {
        for (i = page.data.position -1; i >= newPosition; i--) {
          this.pages[i].data.position += 1;
        }
      }      
      // move forward
      if (newPosition > previousPosition) {
        for (i = page.data.position + 1; i <= newPosition; i++) {
          this.pages[i].data.position -= 1;
        }        
      }
      page.data.position = newPosition;  
      this.sortPages();
      this.firePageMoved(page, newPosition, previousPosition);
      return page;
    }
    return null;
  },
  
  /**
   * Duplicate a record SERVER SIDE. A method "duplicate" must be implemented in the rails controller
   */
  duplicate: function(newTitle) {
    extraParams = null;
    if (newTitle !== '' || newTitle !== null) {
      extraParams = { 'title': newTitle }; 
    }

    WebDoc.ServerManager.sendObject(
            this,
            function(newDocument) {
              window.location = '/documents/' + newDocument.document.uuid;
            },
            "POST",
            "duplicate",
            extraParams
    );
  }
    
});

$.extend(WebDoc.Document, {
  className: function() {
    return "document";
  },
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "documents";
  } 
});

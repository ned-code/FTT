
//= require <mtools/record>

WebDoc.Document = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  },
  
  className: function() {
    return "document";
  },
  
  title: function() {
    return this.data.title;
  },
  
  setTitle: function(title) {
    this.data.title = title;
  },
  
  to_json: function($super) {
    var result = $super();
    delete result['document[pages]'];
    return result;
  },

  refresh: function($super, json) {
    $super(json);
    var that = this;
    this.pages = [];    
    if (this.data.pages && $.isArray(this.data.pages)) {
      $.each(this.data.pages, function() {
        that.createOrUpdatePage({ page: this });
      });
    }    
  },
  
  findPageWithUuidOrPosition: function(pUuid) {
    var i = 0;
    ddd("find page with uuid or position " + pUuid);
        
    var checkedAttribute = "uuid";
    if (!MTools.UUID.isUUID(pUuid)) {
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
  
  createOrUpdateItem: function(itemData) {
    var page = this.findPageWithUuidOrPosition(itemData.item.page_id);    
    if (!page) {
      ddd("Cannot find page");
    }
    else {
      page.createOrUpdateItem(itemData);
    }
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
    var newPage = new WebDoc.Page(pageData);
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
    page.data.document_id = this.uuid();
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
      this.firePageAdded(page);       
      return page;
    }
    return null;
  }
    
});


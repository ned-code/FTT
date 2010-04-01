
WebDoc.WidgetApi = $.klass( 
{
  initialize: function(widgetItem, isInspector) {
    this.widgetItem = widgetItem;
    this.isInspector = isInspector;
  },
  
  setWidgetItem: function(item) {
    this.widgetItem = item;
  },
  
  isInspectorApi: function() {
    return this.isInspector;
  },
  
  resize: function(width, height) {
      this.resizeContainer(width, height);
  },
  
  resizeContainer: function(width, height) {
    this.widgetItem.data.data.css.width = width + "px";
    this.widgetItem.data.data.css.height = height + "px";
    ddd("resize container to " + this.widgetItem.data.data.css.width + ":"  + this.widgetItem.data.data.css.height);
    this.widgetItem.fireObjectChanged();
  },
  
  preference: function(key, value) {
    var result = this.widgetItem.data.data.preference[key];
  if (typeof(result)!='undefined') {return result;}
    return value;
  },
  
  setPreference: function(key, value) {
    var previous = this.widgetItem.data.data.preference[key];
    if (previous != value) {
      this.widgetItem.data.data.preference[key] = value;
      ddd("save widget pref");
      this.widgetItem.save();
      if (!this.isInspectorApi()) {
        ddd("will refresh inspector");
        WebDoc.application.inspectorController.refreshWidgetPalette();
      }
      else {
        this.widgetItem.fireWidgetChanged();
      }
    }
  },
  
  setPenColor: function(color) {
    WebDoc.application.drawingTool.penColor = color;
  } ,
  
  /*********************************************************************
  network - object used by the sdk to make local or remote ajax call
  *********************************************************************/
  network: { //remote call - use rails proxy
  getUrl: function(url,callback,extradata) {
    var proxy_url = '/proxy/get?url='+url;
    this.local._ajax(proxy_url,null,'GET','text',callback,extradata);
  },
	postUrl: function(url,data,callback,extradata) {
		var proxy_url = '/proxy/post?url='+url;
		this.local._ajax(proxy_url,data,'POST','text',callback,extradata);
	},
	putUrl: function(url,data,callback,extradata) {
		var proxy_url = '/proxy/put?url='+url;
		this.local._ajax(proxy_url,data,'PUT','text',callback,extradata);
	},
	deleteUrl: function(url,callback,extradata) {
		var proxy_url = '/proxy/delete?url='+url;
		this.local._ajax(proxy_url,null,'DELETE','text',callback,extradata);
	},
  local: { //local call - use direct jQuery call
    getJson: function(url,callback,extradata) {
      this._ajax(url,null,'GET','json',callback,extradata);
    },
    postText: function(url,data,callback,extradata) {
      this._ajax(url,data,'POST','text',callback,extradata);
    },
    deleteText: function(url,callback,extradata) {
      this._ajax(url,null,'DELETE','text',callback,extradata);
    },
    
    //*****internal methods**********************************************************************
    _ajax: function(url,data,type,dataType,callback,extradata) {
      jQuery.ajax({
        type:type,
        url:url,
        data:data,
        dataType:dataType,
        success:function(response){
          callback(response,null,extradata);
              },
              error:function (xhr, ajaxOptions, thrownError){
          callback(null,thrownError,extradata);
              }
            });
    }
  }
  }
});
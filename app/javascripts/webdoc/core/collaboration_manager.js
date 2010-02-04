
//= require <webdoc/model/document>

WebDoc.CollaborationManager = $.klass(
  {
    BOSH_SERVICE: '/http-bind',
    
    initialize: function()    
    {
      // the from attribute that will be used to send xmpp message.
      this._from = null;
      //the node name we want to subscribe
      this._nodeName = null;
      // the XMPP connection
      this._connection = null;
      $(document).bind("keypress", function(e) {
        if (e.keyCode === 27) {
          ddd("[CollaborationManager] key down. prevent default", e);          
          e.preventDefault();
          return false;          
        }
      });
    },

    listenXMPPNode: function(nodeName) {
      $.getJSON("/users/current", function(userData) {
        this._from = userData.user.name.toLowerCase() + "@webdoc.com/web_" + WebDoc.application.pageEditor.applicationUuid ;
        ddd("XMPP user from", this._from, userData);
        // we want to listen only one node. So be sure to remove all previous connection and create a new fresh XMPP connection.
        this.disconnect();
        this._nodeName = nodeName;
        this._connection = new Strophe.Connection(this.BOSH_SERVICE);  
        ddd("will connect");      
        this._connection.connect(this._from,"1234", this._onConnect.pBind(this));              
      }.pBind(this));      
    },
    
    disconnect: function()
    {
      if (this._connection) {
        //this.unsubscribe();
        this._connection.disconnect();  
      }
    },
    
    _onConnect: function(status)
    {
      if (status == Strophe.Status.CONNECTING) {
        ddd('Strophe is connecting.');
      } else if (status == Strophe.Status.CONNFAIL) {
        ddd('Strophe failed to connect.');
        this.disconnect();
      } else if (status == Strophe.Status.DISCONNECTING) {
        ddd('Strophe is disconnecting.');
      } else if (status == Strophe.Status.DISCONNECTED) {
        ddd('Strophe is disconnected.');
      } else if (status == Strophe.Status.CONNECTED) {
        ddd('Strophe is connected.');
        this._connection.addHandler(this._onMessage.pBind(this), null, 'message', null, null,  null); 
        this._connection.addHandler(this._onIq.pBind(this), null, 'iq', null, null,  null);         
        this._connection.send($pres().tree());
        ddd("presence is set");
        // register to pusub for document id
        this._addDocumentSubscription(function(message) {
          var messageWrap = $(message);
          var createdSub = messageWrap.find("subscription");
          if (createdSub.length == 1) {
            this.subid = $(createdSub[0]).attr("subid");                
          }
          else {
            ddd("Error while subscribing to doc !!!!!!!!!!!!!!!!!!!!!!!!!");
          }
          // remove the handler by returning false
          return false;
        });
      }
    },

    _getDocumentSubscriptions : function(callBack) {
      var iq = $iq({ from: this._from, to: "pubsub.webdoc.com", type: "get", id: 'getDocSubs'} );
      var subscriptions = $build("subscriptions", { node: this._nodeName, jid: "julien.bachmann@webdoc/web" }).tree();      
      var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree()).cnode(subscriptions);
      if (callBack) {
        this._connection.addHandler(callBack, null, 'iq', 'result', 'getDocSubs', null);      
      }
      this._connection.send(iq.tree());    
    },
    
    _addDocumentSubscription: function(callBack) {
      var iq = $iq({ from: this._from, to: "pubsub.webdoc.com", type: "set", id: "addDocSub"});
      var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree());
      pubSub.cnode($build("subscribe", { node: this._nodeName, jid: this._from}).tree());
      if (callBack) {
        this._connection.addHandler(callBack, null, 'iq', 'result', 'addDocSub', null);            
      }
      this._connection.send(iq.tree());      
    },
    
    _unSubsribe: function(subid, callBack) {
      var iq = $iq({ from: this._from, to: "pubsub.webdoc.com", type: "set", id: "unsubscribe"});
      var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree());
      pubSub.cnode($build("unsubscribe", { node: this._nodeName, jid: this._from, subid:subid }).tree());
      if (callBack) {
        this._connection.addHandler(callBack, null, 'iq', null, 'unsubscribe', null);                  
      }
      this._connection.send(iq.tree());    
    },

    _onMessage: function(msg)
    {
      ddd("recieve message", msg);
      try {
        var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        // we need to clean unused subscriptions. All old subscriptions are sent to the last logged user
        if (from == "pubsub.webdoc.com" && to != this._from) {
          try {
            var messageWrap = $(msg);
            var subId = messageWrap.find("header").text();
            ddd("unsubscribe subid", subId);
            this._unSubsribe(subId);
            }
            catch(e) {
              ddd("error while trying to remove old subscriptions", e);
            }            
        }
        else if (from == "pubsub.webdoc.com" && to == this._from) {
          this._dispathMessage(elems);
        }
      }
      catch(e) {
        ddd("error while treating message.", e);
      }
      // we must return true to keep the handler alive.  
      // returning false would remove it after it finishes.      
      return true;
    },
    
    _onIq: function(iq) {
      ddd("recieve iq", iq);
      return true;      
    },
    
    _dispathMessage: function(body) {      
      var messageObject = $.evalJSON($(body).text());
      ddd("check message", messageObject);      
      if (messageObject.source != WebDoc.application.pageEditor.applicationUuid) {
        ddd("dispatch message", messageObject);
        if (messageObject.page) {
          WebDoc.application.pageEditor.currentDocument.createOrUpdatePage(messageObject);
        }
        if (messageObject.item) {   
          var modifiedPage = MTools.ServerManager.cache.get(WebDoc.Item, messageObject.item.page_id);       
          if (modifiedPage) {
            modifiedPage.createOrUpdateItem(messageObject);
          }
        }
      }
    }
  });

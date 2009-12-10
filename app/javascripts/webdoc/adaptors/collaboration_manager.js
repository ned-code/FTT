
//= require <webdoc/model/document>

WebDoc.CollaborationManager = $.klass(
  {
    BOSH_SERVICE: '/http-bind',
    
    initialize: function(document)    
    {
    },

    setDocumentId: function(documentId) {
      $.getJSON("/users/current", function(userData) {
        this.from = userData.user.name + "@webdoc.com/web_" + WebDoc.application.pageEditor.applicationUuid ;
        ddd("XMPP user from", this.from, userData);
        this.disconnect();
        this.documentId = documentId;
        this.connection = new Strophe.Connection(this.BOSH_SERVICE);  
        ddd("will connect");      
        this.connection.connect(this.from,"cdrcdt", this.onConnect.pBind(this));              
      }.pBind(this));      
    },
    
    onConnect: function(status)
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
        this.connection.addHandler(this.onMessage.pBind(this), null, 'message', null, null,  null); 
        this.connection.addHandler(this.onIq.pBind(this), null, 'iq', null, null,  null);         
        this.connection.send($pres().tree());
        ddd("presence is set");
        // register to pusub for document id
        this.addDocumentSubscription(function(message) {
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

    getDocumentSubscriptions : function(callBack) {
      var iq = $iq({ from: this.from, to: "pubsub.webdoc.com", type: "get", id: 'getDocSubs'} );
      var subscriptions = $build("subscriptions", { node: this.documentId, jid: "julien.bachmann@webdoc/web" }).tree();      
      var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree()).cnode(subscriptions);
      if (callBack) {
        this.connection.addHandler(callBack, null, 'iq', 'result', 'getDocSubs', null);      
      }
      this.connection.send(iq.tree());    
    },
    
    addDocumentSubscription: function(callBack) {
      var iq = $iq({ from: this.from, to: "pubsub.webdoc.com", type: "set", id: "addDocSub"});
      var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree());
      pubSub.cnode($build("subscribe", { node: this.documentId, jid: this.from}).tree());
      if (callBack) {
        this.connection.addHandler(callBack, null, 'iq', 'result', 'addDocSub', null);            
      }
      this.connection.send(iq.tree());      
    },
    
    unSubsribe: function(subid, callBack) {
      var iq = $iq({ from: this.from, to: "pubsub.webdoc.com", type: "set", id: "unsubscribe"});
      var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree());
      pubSub.cnode($build("unsubscribe", { node: this.documentId, jid: this.from, subid:subid }).tree());
      if (callBack) {
        this.connection.addHandler(callBack, null, 'iq', null, 'unsubscribe', null);                  
      }
      this.connection.send(iq.tree());    
    },
        
    disconnect: function()
    {
      if (this.connection) {
        //this.unsubscribe();
        this.connection.disconnect();  
      }
    },

    onMessage: function(msg)
    {
      ddd("recieve message", msg);
      try {
        var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        // we need to clean unused subscriptions. All old subscriptions are sent to the last logged user
        if (from == "pubsub.webdoc.com" && to != this.from) {
          try {
            var messageWrap = $(msg);
            var subId = messageWrap.find("header").text();
            ddd("unsubscribe subid", subId);
            this.unSubsribe(subId);
            }
            catch(e) {
              ddd("error while trying to remove old subscriptions", e);
            }            
        }
        else if (from == "pubsub.webdoc.com" && to == this.from) {
          this.dispathMessage(elems);
        }
      }
      catch(e) {
        ddd("error while treating message.");
      }
      // we must return true to keep the handler alive.  
      // returning false would remove it after it finishes.      
      return true;
    },
    
    onIq: function(iq) {
      ddd("recieve iq", iq);
      return true;      
    },
    
    dispathMessage: function(body) {      
      var messageObject = $.evalJSON($(body).text());
      ddd("check message", messageObject);      
      if (messageObject.source != WebDoc.application.pageEditor.applicationUuid) {
        ddd("dispatch message", messageObject);
        if (messageObject.page) {
          WebDoc.application.pageEditor.currentDocument.createOrUpdatePage(messageObject);
        }
        if (messageObject.item) {          
          WebDoc.application.pageEditor.currentDocument.createOrUpdateItem(messageObject);
        }
      }
    }
  });

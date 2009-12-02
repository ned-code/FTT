
//= require <webdoc/model/document>

WebDoc.CollaborationManager = $.klass(
  {
    BOSH_SERVICE: '/http-bind',
    
    initialize: function(document)    
    {
      this.from = "julien.bachmann@webdoc/web";
    },

    setDocumentId: function(documentId) {
      this.disconnect();
      this.documentId = documentId;
      this.connection = new Strophe.Connection(this.BOSH_SERVICE);        
      this.connection.connect(this.from,"cdrcdt", this.onConnect.pBind(this));      
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
        var iq = $iq({ from: this.from, to: "pubsub.webdoc", type: "set"});
        var pubSub = iq.cnode($build("pubsub", { xmlns: "http://jabber.org/protocol/pubsub"}).tree());
        pubSub.cnode($build("subscribe", { node: "jba3", jid: this.from}).tree());
        this.connection.send(iq.tree());   
      }
    },

    disconnect: function()
    {
      if (this.connection) {
        this.connection.disconnect();
      }
    },

    onMessage: function(msg)
    {
      ddd("recieve message", msg);
      var to = msg.getAttribute('to');
      var from = msg.getAttribute('from');
      var type = msg.getAttribute('type');
      var elems = msg.getElementsByTagName('body');
      // we must return true to keep the handler alive.  
      // returning false would remove it after it finishes.
      return true;
    },
    
    onIq: function(iq) {
      ddd("recieve iq", iq);
      return true;      
    }
  });

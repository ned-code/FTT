/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

com.mnemis.core.Provide("com/mnemis/wb/controllers/WBCollaborationController.js");

com.mnemis.wb.controllers.WBCollaborationController = function(page)
{
    this.page = page;
    // init Stomp
    this.stomp = new STOMPClient();
    this.stomp.onopen = this.onopen;
    this.stomp.onclose = this.onclose;
    this.stomp.onerror = this.onerror;
    this.stomp.onerrorframe = this.onerrorframe;
    this.stomp.onconnectedframe = this.onconnectedframe;
    this.stomp.onmessageframe = this.onmessageframe;
    this.stomp.connect(document.domain, 61613, 'UNIQUE_ID_PER_CLIENT', '');
    setTimeout("WB.application.boardController.collaborationController.stomp.subscribe('"+ page.uuid() + "', {exchange:''})",5000);
}

com.mnemis.wb.controllers.WBCollaborationController.prototype.disconnect = function()
{
    this.stomp.disconnect();
}


com.mnemis.wb.controllers.WBCollaborationController.prototype.moveItem = function(item)
{
    console.log("send move to server");
    var data = item.data();
    data.ubApplicationId = WB.application.viewer.applicationUuid;
    data.ubAction = "MOVE";
    $.ajax({
        url: com.mnemis.core.applicationPath + "/documents/" + WB.application.viewer.currentDocument + "/pages/" + WB.application.viewer.currentPageId + "/update",
        global: false,
        type: "POST",
        data: ({
            ubChannel : this.page.uuid(),
            ubData : $.toJSON(data)
        }),
        dataType: "html",
        success: function(msg){
            console.log("success " +msg);
        },
        error: function(msg)
        {
            console.log("error " +msg);
        }
    })
}

 com.mnemis.wb.controllers.WBCollaborationController.prototype.onopen = function() {
 };

 com.mnemis.wb.controllers.WBCollaborationController.prototype.onclose = function(code) {
     console.log("connection closed: " + code);
 };

 com.mnemis.wb.controllers.WBCollaborationController.prototype.onerror = function(error) {
  console.log("connection error: " + error);
 };

 com.mnemis.wb.controllers.WBCollaborationController.prototype.onerrorframe = function(frame) {
  console.log("onerrorframe: " + frame.body);
 };
 com.mnemis.wb.controllers.WBCollaborationController.prototype.onconnectedframe = function() {
  console.log("Connected to collaboration server");
 };
 com.mnemis.wb.controllers.WBCollaborationController.prototype.onmessageframe = function(frame) {
   console.log("recieve message" + frame.body);
   var message = $.evalJSON(frame.body);
   if (message.ubApplicationId != WB.application.viewer.applicationUuid)
       {
           console.log("must update item" + message.uuid);
           var item = WB.application.boardController.collaborationController.page.findObjectWithUuid(message.uuid);
           if (item)
           {
                item.moveTo(message.position);
           }
       }
 };

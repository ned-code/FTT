//Note: use registerOnLoadHandler instead of $(document).ready(function() {}); ($(document).ready may be called too early?)
gadgets.util.registerOnLoadHandler(function() {
  
  WebDoc.registerInspectorPanes("settings");
  //for multiple panes use: WebDoc.registerInspectorPanes(["inspector-settings", ...])
  
  var poll = new Poll();
  
  gadgets.window.adjustHeight();
});


Poll = $.klass({
  initialize: function() {
    this.wrapper = $('.poll_wrap');
    
    this.questionData = "Question?";
    this.answersData = [
      "Answer 1",
      "Answer 2",
      "Answer 3"
    ];
    this.answers = [];
    this.parentWin = null;
    
    this.build();
    
    $('h2.question.title.editable').editable('#', {
        type      : 'autogrow',
        cancel    : '<button class="cancel"><span>Cancel</span></button>',
        submit    : '<button class="ok"><span>OK</span></button>',
        indicator : 'Saving...',
        tooltip   : 'Click to edit...',
        onblur    : 'ignore',
        onreset   : function() {
          removeEditingClass($(this));
        },
        onsubmit  : function() {
          removeEditingClass($(this));
        },
        autogrow  : { lineHeight : 30 }
    });
    
    setInterval(this.heightResize, 100);
  },
  
  build: function() {
    var questionEl = $('<h2>').addClass('question title editable').html(this.questionData);
    this.wrapper.append(questionEl);
    
    $.each(this.answersData, function(index, answerData){
      var answerWrap = this.buildEntry("radio", answerData, index);
      
      this.wrapper.append(answerWrap);
      this.answers.push(answerWrap);
    }.pBind(this));
  },
  
  buildInput: function(type, index) {
    return $("<input>").attr({ 'type':type, 'id':'answer_'+index, 'name':'radio', 'disabled':'disabled' });
  },
  
  buildLabel: function(html, index) {
    return $('<label>').addClass('answer editable').attr({ "for":"answer_"+index, "name":"radio" }).html(html);
  },
  
  buildEntry: function(type, html, index) {
    var actionsDiv = $('<div>').addClass('actions');
    actionsDiv.append($('<a href="#">').html("<span>Delete</span>"));
    actionsDiv.append($('<a href="#">').html("<span>Add</span>"));
    
    var entryDiv = $('<div>').addClass('entry');
    entryDiv.append(this.buildInput(type, index));
    entryDiv.append(this.buildLabel(html, index));
    entryDiv.append(actionsDiv);
    entryDiv.append($('<div>').addClass('spacer'));
    return entryDiv;
  },
  
  setMultipleSelections: function(multiple) {
    var type = multiple ? 'checkbox' : 'radio';
    $.each(this.answers, function(index, answer){
      answer.find('input').remove();
      answer.prepend(this.buildInput(type, index));
    }.pBind(this));
  },
  
  heightResize: function() {
    $('.poll').parents('iframe').removeAttr('height').css({ height: $('.poll').height()+20 });
  },
  
  newMessage: function(receiver, action) {
    $('#messages').append($('<li>').html("<li>[to " + receiver + "] : " + action + "</li>"));
    
    if(receiver != null) receiver = $('#'+receiver, this.parentWin.document)[0].contentWindow;
    else receiver = this.parentWin;
    
    if(receiver != null) receiver.postMessage(mainId + "," + action, '*');
    else gadgets.log("receiver is null!");
  },
  
  onmessage: function(e) {
    var dataArray_ = e.data.split(',');
    var origin = e.origin;
    var fromId = dataArray_[0];
    var message = dataArray_[1];
    if(origin == document.location.protocol + "//" + document.location.host) {
      gadgets.log("in main from same domain, module: " + fromId + ", message: " + message);
      
      document.getElementById('messages').innerHTML += "<li>[from " +fromId+ "] " + message + "</li>";
      gadgets.log(e.source);
      e.source.postMessage('with e.source','*');
    }
    else {
      gadgets.log("from somewhere else: " + origin);
    }
  }
});

// var mainId = window.name;
// var styleInspectorId = "";
// 
// pollGadget.refreshPollsEdit = function() {
//   var idspec = opensocial.newIdSpec({ 'userId' : 'OWNER' });
//   var req = opensocial.newDataRequest();
//   req.add(req.newFetchPersonRequest('OWNER'), 'owner');
//   // req.add(req.newFetchPeopleRequest(idspec), "get_friends");
//   req.add(req.newFetchPersonAppDataRequest(idspec, 'polls'), 'polls');
//   req.send(pollGadget.renderEdit);
// };
// 
// pollGadget.renderEdit = function(data) {
//   var owner = data.get('owner').getData();
//   // gadgets.log(owner);
//   // gadgets.log(data.get('polls').getData());
//   globalPolls = gadgets.json.parse(data.get('polls').getData()[owner.getId()].polls);
//   
//   // gadgets.window.setTitle("Mnemis poll module: " + owner.getId());
//   
//   // var html = "<p><strong>Edit polls</strong></p>";
//   // html += "<select name='poll_select' onchange='generateEditPollFields();'>";
//   // for (var i = 0; i < globalPolls.length; i++){
//   //   html += "<option>" + globalPolls[i]["question"] + "</option>";
//   // };
//   
//   // document.getElementById("poll_select").innerHTML = html;
//   // pollGadget.generateNewPollFields();
//   // pollGadget.generateEditPollFields();
//   
//   // Tells gadget to resize itself
//   gadgets.window.adjustHeight();
// };
// 
// // pollGadget.generatenewPollFields = function() {
// //   var html = "<div id='" + poll_div_id + "' class=\"poll_container\">";
// //   html += "<p><label for='poll_question'>Question:</label> <input type='text' name='poll_question' /></p>";
// //   html += "</p><label for='poll_choices'>Choices:</label> <ul>";
// // 
// //   for (var j = 0; j < 2; j++){
// //     html += "<li><input type='text' name='poll_choices' /></li>";
// //   };
// //   html += "<li class=\"add_choice\"><a href=\"#\" onclick=\"addChoice('"+poll_div_id+"');\">Add a choice!</a></li>";
// //   html += "</ul><a href=\"#\" onclick=\"updatePoll("+selectedIndex+");\">Update!</a>";
// //   document.getElementById("poll_fields").innerHTML = html;
// // 
// //   $("#"+poll_div_id+" > ul").first().children().has("input").last().append(deleteLink(poll_div_id));
// // }
// 
// pollGadget.generateEditPollFields = function() {
//   var html = "<div id='" + poll_div_id + "' class=\"poll_container\">";
//   html += "<p><label for='poll_question'>Question:</label> <input type='text' name='poll_question' value=\"" + globalPolls[selectedIndex]['question'] + "\" /><a href='javascript:void(0);' onclick='deletePoll("+selectedIndex+");'>X!</a></p>";
//   html += "</p><label for='poll_choices'>Choices:</label> <ul>";
//   
//   for (var j = 0; j < globalPolls[selectedIndex]['choices'].length; j++){
//     html += "<li><input type='text' name='poll_choices' value=\"" + globalPolls[selectedIndex]['choices'][j] + "\" /></li>";
//   };
//   html += "<li class=\"add_choice\"><a href=\"javascript:void(0);\" onclick=\"addChoice('"+poll_div_id+"');\">Add a choice!</a></li>";
//   html += "</ul><a href=\"javascript:void(0);\" onclick=\"updatePoll("+selectedIndex+");\">Update!</a>";
//   document.getElementById("edit_poll_fields").innerHTML = html;
//   
//   $("#"+poll_div_id+" > ul").first().children().has("input").last().append(deleteLink(poll_div_id));
// };












//NOT USED AT THE MOMENT

// var widgetIframe;
// 
// $(document).ready(function() {
//     
//     $('.title.editable').editable('http://www.example.com/save.php', { 
//         type      : 'autogrow',
//         cancel    : '<button class="cancel"><span>Cancel</span></button>',
//         submit    : '<button class="ok"><span>OK</span></button>',
//         indicator : 'Saving...',
//         tooltip   : 'Click to edit...',
//         onblur    : 'ignore',
//         onreset   : function(){
//           removeEditingClass($(this));
//         },
//         onsubmit  : function(){
//           removeEditingClass($(this));
//         },
//         autogrow  : { lineHeight : 30 }
//     });
//     
//     $('.answer.editable').editable('http://www.example.com/save.php', { 
//         type      : 'autogrow',
//         cancel    : '<button class="cancel"><span>Cancel</span></button>',
//         submit    : '<button class="ok"><span>OK</span></button>',
//         indicator : 'Saving...',
//         tooltip   : 'Click to edit...',
//         onblur    : 'ignore',
//         onreset   : function(){
//           removeEditingClass($(this));
//         },
//         onsubmit  : function(){
//           removeEditingClass($(this));
//         },
//         autogrow  : { lineHeight : 22 }
//     });
//     
//     $('.editable').click(function(event){
//       $(this).addClass('editing');
//       $(this).parent('.entry').find('.actions').hide();
//     });
//     
//     $('.actions a.delete').click(function(event){
//       $(this).closest('.entry').remove();
//       event.preventDefault();
//     });
//     
//     $('.actions a.add').click(function(event){
//       event.preventDefault();
//     });
//     
//     // setInterval(heightResize, 100);
//     // widgetIframe = $(parent.document).find("#widget");
// });
// 
// function heightResize(){
//   var widgetHeight = $('.widget').height();
//   var widgetIframeHeight = widgetIframe.height();
//   widgetIframe.removeAttr("height").css({ height: widgetHeight+20 });
// }
// 
// function removeEditingClass(element){
//   element.closest('.editing').removeClass('editing');
//   element.closest('.entry').find('.actions').show();
// }



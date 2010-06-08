var poll = null;

//Note: use registerOnLoadHandler instead of $(document).ready(function() {}); ($(document).ready may be called too early?)
gadgets.util.registerOnLoadHandler(function() {
  
  poll = new Poll();
  
  WebDoc.adjustAppHeight();
  // gadgets.window.adjustHeight();
});

WebDoc.appInit = function() {
  // WebDoc.registerInspectorPanes("settings");
  WebDoc.registerInspectorPanes(["settings", "style"]);
}

WebDoc.appEnteredEditMode = function() {
  if (poll) {
    poll.enableUI(false);
  }
};

WebDoc.appEnteredPreviewMode = function() {
  if (poll) {
    poll.enableUI(true);
  }
};


Poll = $.klass({
  initialize: function() {
    this.questionEl = $('.question');
    this.answersForm = $('form.answers');
    this.voteButton = $('button.submit');
    // this.iButton = $('.show_inspector_pane');
    
    this.questionData = "Question?";
    this.answersData = [
      "Answer 1",
      "Answer 2",
      "Answer 3"
    ];
    this.answers = [];
    this.parentWin = null;
    
    this.build();
    
    this.enableUI(!WebDoc.isEditMode)
    
    // $('h2.question.title.editable').editable('#', {
    //     type      : 'autogrow',
    //     cancel    : '<button class="cancel"><span>Cancel</span></button>',
    //     submit    : '<button class="ok"><span>OK</span></button>',
    //     indicator : 'Saving...',
    //     tooltip   : 'Click to edit...',
    //     onblur    : 'ignore',
    //     onreset   : function() {
    //       removeEditingClass($(this));
    //     },
    //     onsubmit  : function() {
    //       removeEditingClass($(this));
    //     },
    //     autogrow  : { lineHeight : 30 }
    // });
    
    // setInterval(this.heightResize, 100);
    
    // Register app calls
    WebDoc.registerAppCall("allowMultipleSelection", this.setMultipleSelections, this);
  },
  
  build: function() {
    this.questionEl.html(this.questionData);
    
    $.each(this.answersData.reverse(), function(index, answerData){
      var answerWrap = this.buildEntry("radio", answerData, index);
      
      this.answersForm.prepend(answerWrap);
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
    var type = eval(multiple) ? 'checkbox' : 'radio';
    
    $.each(this.answers, function(index, answer){
      answer.find('input').remove();
      answer.prepend(this.buildInput(type, index));
    }.pBind(this));
  },
  
  heightResize: function() {
    // ddd("test")
    // $('.poll').parents('iframe').removeAttr('height').css({ height: $('.poll').height()+20 });
  },
  
  enableUI: function(flag) {
    if (flag) {
      // enable inputs
      $.each(this.answers, function(index, answer){
        answer.find('input').removeAttr("disabled");
      });
      
      // enable vote button
      this.voteButton.removeAttr('disabled');
      this.voteButton.removeClass('disabled');
    }
    else {
      // disable inputs
      $.each(this.answers, function(index, answer){
        answer.find('input').attr("disabled","disabled");
      });
      
      // disable vote button
      this.voteButton.attr('disabled', 'disabled');
      this.voteButton.addClass('disabled');
    }
  }

});


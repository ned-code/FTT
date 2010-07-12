/**
 * @autor noe
 */

WebDoc.Comment = $.klass(WebDoc.Record, {

  initialize: function($super, json, discussion) {

    this.belongsTo = {
      discussion: WebDoc.Discussion
    };
    this.discussion = discussion;


    $super(json);

  }


});

$.extend(WebDoc.Discussion, {

  className: function() {
    return "comment";
  },

  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "comments";
  }
});
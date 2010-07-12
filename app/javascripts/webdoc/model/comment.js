/**
 * @autor noe
 */

WebDoc.Comment = $.klass(WebDoc.Record, {

  initialize: function($super, json) {

    this.belongsTo = {
      discussion: WebDoc.Discussion
    };
    this.theme = theme;

    if(associatedType && associatedId && associatedType === 'page') {
      this[associatedType + '_id'] = associatedId;
    }
    else {
      ddd('[Discussion] bad associated type or associated id');
      return false;
    }


    $super(json);

    if(this.data.properties === undefined) {
      this.data.properties = {};
    }


  },

  setPosition: function(position, skipSave) {
    this.data.properties.position = position;
    if(!skipSave && !skipSave === true) {
      this.fireObjectChanged({ modifedAttribute: 'position' });
      this.save();
    }
  },

  position: function() {
    if(this.data.properties.position) {
        return this.data.properties.position;
    }
    else {
        return undefined;
    }
  }

});

$.extend(WebDoc.Discussion, {

  className: function() {
    return "discussion";
  },

  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "discussions";
  }
});
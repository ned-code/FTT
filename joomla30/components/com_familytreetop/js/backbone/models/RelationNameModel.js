(function(){
  'use strict';
  var RelationName = Backbone.Model.extend({
    url: function(){
      var url = $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=relationName';
      if(this.isNew()){
        return url;
      } else {
        return url + '&id=' + this.get('id');
      }
    }
  });
  this.BackboneModels['RelationName'] = RelationName;
}).call($FamilyTreeTop);


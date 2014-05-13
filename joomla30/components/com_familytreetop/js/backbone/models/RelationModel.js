(function(){
  'use strict';
  var Relation = Backbone.Model.extend({
    url: function(){
      var url = $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=relation';
      if(this.isNew()){
        return url;
      } else {
        return url + '&id=' + this.get('id');
      }
    }
  });
  this.BackboneModels['Relation'] = Relation;
}).call($FamilyTreeTop);


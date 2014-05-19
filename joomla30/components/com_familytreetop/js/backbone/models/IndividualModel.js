(function(){
  'use strict';
  var Individual = Backbone.Model.extend({
    url: function(){
      var url = $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=individual';
      if(this.isNew()){
        return url;
      } else {
        return url + '&id=' + this.get('id');
      }
    }
  });
  this.BackboneModels['Individual'] = Individual;
}).call($FamilyTreeTop);


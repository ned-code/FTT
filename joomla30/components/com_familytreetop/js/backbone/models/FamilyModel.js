(function(){
  'use strict';
  var Family = Backbone.Model.extend({
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.family';
    }
  });
  this.BackboneModels['Family'] = new Family;
}).call($FamilyTreeTop);

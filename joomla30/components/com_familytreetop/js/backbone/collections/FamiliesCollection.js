(function(){
  'use strict';
  var FamiliesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Family,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.families';
    }
  });
  this.BackboneCollections['Families'] = new FamiliesCollection;
}).call($FamilyTreeTop);


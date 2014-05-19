(function(){
  'use strict';
  var RelationNamesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.RelationName,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=relationNames';
    }
  });
  this.BackboneCollections['RelationNames'] = RelationNamesCollection;
}).call($FamilyTreeTop);


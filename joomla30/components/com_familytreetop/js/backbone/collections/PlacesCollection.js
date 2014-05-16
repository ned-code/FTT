(function(){
  'use strict';
  var PlacesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Place,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=places&treeId='+this.treeId;
    }
  });
  this.BackboneCollections['Places'] = PlacesCollection;
}).call($FamilyTreeTop);


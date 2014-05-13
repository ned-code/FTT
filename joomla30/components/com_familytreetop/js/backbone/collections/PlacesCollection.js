(function(){
  'use strict';
  var PlacesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Place,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=places';
    }
  });
  this.BackboneCollections['Places'] = new PlacesCollection;
}).call($FamilyTreeTop);


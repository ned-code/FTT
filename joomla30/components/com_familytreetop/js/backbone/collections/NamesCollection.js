(function(){
  'use strict';
  var NamesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Name,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=names';
    }
  });
  this.BackboneCollections['Names'] = new NamesCollection;
}).call($FamilyTreeTop);


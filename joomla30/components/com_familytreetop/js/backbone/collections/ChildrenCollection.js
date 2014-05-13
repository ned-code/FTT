(function(){
  'use strict';
  var ChildrenCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Child,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=children';
    }
  });
  this.BackboneCollections['Children'] = new ChildrenCollection;
}).call($FamilyTreeTop);


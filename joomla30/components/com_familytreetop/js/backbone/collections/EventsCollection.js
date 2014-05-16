(function(){
  'use strict';
  var EventsCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Event,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=events&treeId='+this.treeId;
    }
  });
  this.BackboneCollections['Events'] = EventsCollection;
}).call($FamilyTreeTop);


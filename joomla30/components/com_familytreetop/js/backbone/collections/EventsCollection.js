(function(){
  'use strict';
  var EventsCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Event,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=events';
    }
  });
  this.BackboneCollections['Events'] = new EventsCollection;
}).call($FamilyTreeTop);


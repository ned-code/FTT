(function(){
  'use strict';
  var DatesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Date,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=dates';
    }
  });
  this.BackboneCollections['Dates'] = new DatesCollection;
}).call($FamilyTreeTop);


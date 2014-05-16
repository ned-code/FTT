(function(){
  'use strict';
  var DatesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Date,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=dates&tree_id='+this.tree_id;
    }
  });
  this.BackboneCollections['Dates'] = DatesCollection;
}).call($FamilyTreeTop);


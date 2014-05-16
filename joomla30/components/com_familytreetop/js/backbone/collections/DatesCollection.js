(function(){
  'use strict';
  var DatesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Date,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=dates&treeId='+this.treeId;
    }
  });
  this.BackboneCollections['Dates'] = DatesCollection;
}).call($FamilyTreeTop);


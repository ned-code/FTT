(function(){
  'use strict';
  var FamiliesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Family,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=families&tree_id='+this.tree_id;
    }
  });
  this.BackboneCollections['Families'] = FamiliesCollection;
}).call($FamilyTreeTop);


(function(){
  'use strict';
  var NamesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Name,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=names&treeId='+this.treeId;
    }
  });
  this.BackboneCollections['Names'] = NamesCollection;
}).call($FamilyTreeTop);


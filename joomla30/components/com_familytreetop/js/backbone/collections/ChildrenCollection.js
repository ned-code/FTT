(function(){
  'use strict';
  var ChildrenCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Child,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=children&treeId='+this.treeId;
    }
  });
  this.BackboneCollections['Children'] = ChildrenCollection;
}).call($FamilyTreeTop);


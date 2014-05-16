(function(){
  'use strict';
  var $FTT = this;
  var MembersCollection = Backbone.Collection.extend({
    model : $FTT.BackboneModels.Member,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=members&treeId='+this.treeId;
    }
  });
  this.BackboneCollections['Members'] = MembersCollection;
}).call($FamilyTreeTop);

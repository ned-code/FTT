(function(){
  'use strict';
  var $FTT = this;
  var MembersCollection = Backbone.Collection.extend({
    model : $FTT.BackboneModels.Member,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=members&tree_id='+this.tree_id;
    }
  });
  this.BackboneCollections['Members'] = MembersCollection;
}).call($FamilyTreeTop);

(function(){
  'use strict';
  var RelationsCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Relation,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=relations';
    }
  });
  this.BackboneCollections['Relations'] = new RelationsCollection;
}).call($FamilyTreeTop);


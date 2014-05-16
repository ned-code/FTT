(function(){
  'use strict';
  var RelationsCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Relation,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=relations&tree_id='+this.tree_id+'&user_gedcom_id='+this.user_gedcom_id;
    }
  });
  this.BackboneCollections['Relations'] = RelationsCollection;
}).call($FamilyTreeTop);


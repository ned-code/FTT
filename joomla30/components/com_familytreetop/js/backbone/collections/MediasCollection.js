(function(){
  'use strict';
  var $FTT = this;
  var MediasCollection = Backbone.Collection.extend({
    model : $FTT.BackboneModels.Media,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=medias&tree_id='+this.tree_id;
    }
  });
  this.BackboneCollections['Medias'] = MediasCollection;
}).call($FamilyTreeTop);

(function(){
  'use strict';
  var $FTT = this;
  var UsersCollection = Backbone.Collection.extend({
    model : new $FTT.BackboneModels.User,
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.users';
    }
  });
  this.BackboneCollections['Users'] = new UsersCollection;
}).call($FamilyTreeTop);

(function(){
  'use strict';
  var UsersCollection = Backbone.Collection.extend({
    model : this.BackboneModels.User,
    url : 'api/users'
  });
  this.BackboneCollections['Families'] = new UsersCollection;
}).call($FamilyTreeTop);

(function(){
  'use strict';
  var User = Backbone.Model.extend({
    urlRoot: '/api/user'
  });
  this.BackboneModels['User'] = new User;
}).call($FamilyTreeTop);


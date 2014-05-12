(function(){
  'use strict';
  var Family = Backbone.Model.extend({
    urlRoot: '/api/user'
  });
  this.BackboneModels['Family'] = new Family;
}).call($FamilyTreeTop);

(function(){
  'use strict';
  var FamiliesCollection = Backbone.Collection.extend({
    model : this.BackboneModels.Family,
    url : 'api/families'
  });
  this.BackboneCollections['Families'] = new FamiliesCollection;
}).call($FamilyTreeTop);


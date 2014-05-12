(function(){
  'use strict';
  var User = Backbone.Model.extend({
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.user';
    }
  });
  this.BackboneModels['User'] = new User;
}).call($FamilyTreeTop);


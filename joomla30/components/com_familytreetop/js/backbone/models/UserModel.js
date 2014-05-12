(function(){
  'use strict';
  var User = Backbone.Model.extend({
    url: function(){
      var url = $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.user';
      if(this.isNew()){
        return url;
      } else {
        return url + '&id=' + this.get('id');
      }
    }
  });
  this.BackboneModels['User'] = User;
}).call($FamilyTreeTop);


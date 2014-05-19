(function(){
  'use strict';
  var Member = Backbone.Model.extend({
    url: function(){
      var url = $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=member';
      if(this.isNew()){
        return url;
      } else {
        return url + '&id=' + this.get('id');
      }
    }
  });
  this.BackboneModels['Member'] = Member;
}).call($FamilyTreeTop);


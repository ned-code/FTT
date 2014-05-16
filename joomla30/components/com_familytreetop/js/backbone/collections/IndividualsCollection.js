(function(){
  'use strict';
  var $FTT = this;
  var IndividualsCollection = Backbone.Collection.extend({
    model : $FTT.BackboneModels.Individual,
    Initialize : function(data){
      console.log(data);
    },
    url: function(){
      return $FamilyTreeTop.currenturl + '?option=com_familytreetop&task=api.send&class=individuals&tree_id=' + this.tree_id;
    }
  });
  this.BackboneCollections['Individuals'] = IndividualsCollection;
}).call($FamilyTreeTop);

$FamilyTreeTop.create("controller", function($){
  'use strict';
  var
    $this = this,
    schema = {};

  $this.instance = function(collectionName){
    if("undefined" === typeof( $FamilyTreeTop.BackboneCollections[collectionName] )) return false;
    return $FamilyTreeTop.BackboneCollections[collectionName];
  }

  $this.model = function(modelName, options){
    var settings, model;
    if("undefined" === typeof( $FamilyTreeTop.BackboneModels[modelName])) return false;
    settings = $.extend(true, {}, {
      data : {}
    }, options)
    model = $FamilyTreeTop.BackboneModels[modelName];
    return new model(settings.data);
  }
});
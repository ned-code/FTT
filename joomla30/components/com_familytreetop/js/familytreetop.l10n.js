$FamilyTreeTop.create("l10n", function($){
    'use strict';
    var $this = this;

    $this.init = function(callback){
      $this.ajax('api.l10n', null, function(data){
        console.log(data);
        callback();
      });
    }

    $this.get = function(name){
      return $('#localization').find('[data-l10n="'+name.toLowerCase().toUpperCase()+'"]').text();
    }

});
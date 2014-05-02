$FamilyTreeTop.create("l10n", function($){
    'use strict';
    var $this = this;

    $this.init = function(){

    }

    $this.get = function(name){
      return $('#localization').find('[data-l10n="'+name.toLowerCase().toUpperCase()+'"]').text();
    }

});
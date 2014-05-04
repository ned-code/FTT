$FamilyTreeTop.create("l10n", function($){
    'use strict';
    var $this = this,
        pull = false;


    $this.init = function(data){
      pull = data;
    }

    $this.get = function(name){
      var name = name.toLowerCase().toUpperCase();
      return ("undefined"!==typeof(pull[name]))?pull[name]:"";
    }

    $this.parse = function(o){
      $(o).find('[data-l10n-id]').each(function(index, element){
        var name = element.dataset.l10nId;
        if("undefined" === typeof(name)) return true;
        $(element).text($this.get(name));
      });
      $(o).find('[data-l10n-placeholder]').each(function(index, element){
        var name = element.dataset.l10nPlaceholder;
        if("undefined" === typeof(name)) return true;
        $(element).attr('placeholder', $this.get(name));
      });
    }

});
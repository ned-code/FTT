$FamilyTreeTop.create("l10n", function($){
    'use strict';
    var $this = this,
        fn = {},
        pull = false;

    fn.setId = function(element){
      var el = (element instanceof jQuery)?element[0]:element;
      var name = el.dataset.l10nId;
      if("undefined" === typeof(name)) return true;
      $(element).text($this.get(name));
    };

    fn.setPlaceholder = function(element){
      var el = (element instanceof jQuery)?element[0]:element;
      var name = el.dataset.l10nPlaceholder;
      if("undefined" === typeof(name)) return true;
      $(element).attr('placeholder', $this.get(name));
    }

    fn.parse = function(obj){
      $(obj).find('[data-l10n-id]').each(function(index, element){
        fn.setId(element);
      });
      $(obj).find('[data-l10n-placeholder]').each(function(index, element){
        fn.setPlaceholder(element);
      });
    }

    $this.init = function(data){
      pull = data;
    }

    $this.get = function(name){
      var name = name.toLowerCase().toUpperCase();
      return ("undefined"!==typeof(pull[name]))?pull[name]:"";
    }

    $this.parse = function(obj){
      if((Object.prototype.toString.call( obj ) === '[object Array]')){
        obj.forEach(function(item){
          fn.setId(item);
          fn.setPlaceholder(item);
          fn.parse(item);
        });
      } else {
        fn.parse(obj);
      }
    }

});
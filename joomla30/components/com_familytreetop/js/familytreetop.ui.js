(function(w, undefined){
  'use strict';
  var $FTT = window.$FamilyTreeTop;
  $FTT.ui = {};

  $FTT.ui.modal = function(options){
    var
      $modal = false,
      settings = false,
      defaults = {
        attributes : {},
        data : {},
        title : false,
        header : false,
        body : false,
        footer : false,
        close : true,
        modalSettings : {
        },
        buttons : [],
        events : {
          'show' : $.noop,
          'shown' : $.noop,
          'hide' : $.noop,
          'hidden' : $.noop,
          'loaded' : $.noop,
          'onClose' : $.noop,
          'onButtonClick' : $.noop
        }
    };

    function uid(){
      var s4 = function(){return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
      return s4()+s4()+s4()+s4()+s4()+s4()+s4()+s4();
    }

    function get_id(selector){
      return ((!selector)? "" : "#" ) + 'familytreetop-modal-' + settings.data.id;
    }

    function set_data(){
      var data = settings.data;
      for(var key in data){
        if(!data.hasOwnProperty(key)) continue;
        $modal.attr('data-'+key, data[key]);
      }
    }

    $modal = $('#familytreetop-modal').clone();
    settings = $.extend(true, {}, defaults, options);
    settings.data.id = uid();

    set_data();

    $modal.attr(settings.attributes);
    $modal.attr('id', $modal.attr('id') + "-" + settings.data.id);

    (settings.title) ? $modal.find('.modal-title').append(settings.title) : "" ;
    (settings.header) ? $modal.find('.modal-header').append(settings.header) : "" ;
    (settings.body) ? $modal.find('.modal-body').append(settings.body) : "" ;
    (settings.footer) ? $modal.find('.modal-footer').append(settings.footer) : "" ;

    (!settings.close) ? $modal.find('.close').addClass('hidden') : "" ;
    $modal.find('.close').click(settings.events.onClose);

    settings.buttons.forEach(function(button){
      var btn = $(button);
      $(btn).click(settings.events.onButtonClick);
      $modal.find('.modal-footer').append(btn);
    });

    $modal.on('show.bs.modal', settings.events.show);
    $modal.on('shown.bs.modal', settings.events.shown);
    $modal.on('hide.bs.modal', settings.events.hide);
    $modal.on('hidden.bs.modal', settings.events.hudden);
    $modal.on('loaded.bs.modal', settings.events.loaded);

    $modal.addClass('hidden');
    $('body').append($modal);

    return {
      id : function(selector){
        return get_id(selector);
      },
      object : function(){
        return $($modal);
      },
      toggle : function(){
        $($modal).modal('toggle');
      },
      show : function(){
        $($modal).modal('show');
      },
      hide : function(){
        $($modal).modal('hide');
      },
      render : function(){
        if(!$modal.hasClass('hidden')) return false;
        $modal.removeClass('hidden');
        $($modal).modal(settings.modalSettings);
        return true;
      },
      remove : function(){
        $modal.remove();
      }
    };
  }


})(window);

(function(w, undefined){
  'use strict';
  var $FTT = window.$FamilyTreeTop;

  $FTT.ui = {};
  $FTT.ui.fn = {};

  $FTT.ui.fn.uid = function(){
    var s4 = function(){return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
    return s4()+s4()+s4()+s4()+s4()+s4()+s4()+s4();
  };

  $FTT.ui.fn.set_data = function(object, data){
    for(var key in data){
      if(!data.hasOwnProperty(key)) continue;
      object.attr('data-'+key, data[key]);
    }
  }

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

    function get_id(selector){
      return ((!selector)? "" : "#" ) + 'familytreetop-modal-' + settings.data.id;
    }

    $modal = $('#familytreetop-modal').clone();
    settings = $.extend(true, {}, defaults, options);
    settings.data.id = $FTT.ui.fn.uid();

    $FTT.ui.fn.set_data($modal, settings.data);

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
  };

  $FTT.ui.tabs = function(options){
    var
      $cont = $('<div></div>'),
      $tabs = false,
      pull = [],
      settings = {},
      defaults = {
        items : [],
        contAttributes : {

        },
        navAttributes : {
          class : "nav nav-tabs"
        },
        events : {
          onClick : $.noop
        }
    }

    settings = $.extend(true, {}, defaults, options);

    $cont.attr(settings.contAttributes);

    $tabs = $('<ul></ul>');
    $tabs.attr(settings.navAttributes);

    settings.items.forEach(function(item, index){
      var $toggle, $pane;
      if("object" === typeof(item.toggle)){
        var
          opt = $.extend(true, {}, {
          id : $FTT.ui.fn.uid(),
          attributes : {},
          href : false,
          text : false,
          active : false
        }, item.toggle);
        opt.href = (opt.href) ? opt.href + "-" : index + "-" ;
        opt.text = (opt.text) ? opt.text : "" ;

        $toggle = $('<li><a href="" data-toggle="tab"></a></li>');
        $toggle.attr(opt.attributes);

        (opt.active) ? $toggle.addClass('active') : "" ;
        $toggle.find('a').attr('href', opt.href + opt.id);
        $toggle.find('a').append(opt.text);
      } else {
        $toggle = $(item.toggle);
        $toggle.append(item.toggle);
      }
      $($toggle).find('a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
        settings.events.onClick.apply(this, arguments);
      });

      if("object" === typeof(item.pane)){
        var opt = $.extend(true, {}, {
          attributes : {
            class : "tab-pane"
          },
          text : ""
        }, item);
        $pane = $('<div></div>');
        $pane.attr(opt.attributes);
        $pane.append(opt.text);
      } else if("string" === typeof(item.pane)){
        $pane = $(item.pane);
      } else {
        $pane = $('<div class="tab-pane"></div>');
      }

      if($toggle.hasClass('active')) $pane.addClass('active');
      $pane.attr('id', $toggle.find('a').attr('href'));

      pull.push({ toggle : $toggle, pane : $pane });
    });

    $cont.append($tabs);
    pull.forEach(function(item){
      $tabs.append(item.toggle);
      $cont.append(item.pane);
    });

    return $cont;
  }

  $FTT.ui.formworker = function(){
    var
      defaults = {

      }

    return {

    };
  };


})(window);

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
    $modal.find('.close').click(function(){
      Array.prototype.unshift.call(arguments, this);
      return settings.events.onClose.apply($modal, arguments);
    });

    settings.buttons.forEach(function(button){
      var btn = $(button);
      $(btn).click(function(){
        Array.prototype.unshift.call(arguments, this);
        return settings.events.onButtonClick.apply($modal, arguments);
      });
      $modal.find('.modal-footer').append(btn);
    });

    $modal.on('show.bs.modal', function(){
      Array.prototype.unshift.call(arguments, this);
      settings.events.show.apply($modal, arguments);
    });
    $modal.on('shown.bs.modal', function(){
      Array.prototype.unshift.call(arguments, this);
      settings.events.shown.apply($modal, arguments);
    });
    $modal.on('hide.bs.modal', function(){
      Array.prototype.unshift.call(arguments, this);
      settings.events.hide.apply($modal, arguments);
    });
    $modal.on('hidden.bs.modal', function(){
      Array.prototype.unshift.call(arguments, this);
      settings.events.hidden.apply($modal, arguments);
    });
    $modal.on('loaded.bs.modal', function(){
      Array.prototype.unshift.call(arguments, this);
      settings.events.loaded.apply($modal, arguments);
    });

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
      $cont = false,
      $tabs = false,
      $tabsCont = false,
      pull = [],
      settings = {},
      defaults = {
        items : [],
        contAttributes : {
          class : "familytreetop-tab-box"
        },
        tabsAttributes : {
          class : "tab-content"
        },
        navsAttributes : {
          class : "nav nav-tabs"
        },
        events : {
          onClick : $.noop
        }
    }

    settings = $.extend(true, {}, defaults, options);

    $cont = $('<div></div>');
    $cont.attr(settings.contAttributes);

    $tabs = $('<ul></ul>');
    $tabs.attr(settings.navsAttributes);

    $tabsCont = $('<div></div>');
    $tabsCont.attr(settings.tabsAttributes);

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
        $toggle.find('a').attr('href', "#" + opt.href + opt.id);
        $toggle.find('a').append(opt.text);
      } else {
        $toggle = $(item.toggle);
        $toggle.append(item.toggle);
      }
      $($toggle).find('a').click(function(e){
        var el = this;
        e.preventDefault();
        $(el).tab('show');
        settings.events.onClick.apply(this, arguments);
      });

      if("object" === typeof(item.pane)){
        var opt = $.extend(true, {}, {
          attributes : {
            class : "tab-pane fade"
          },
          formworker : false,
          text : false,
          tpl : false,
          onLoad : $.noop
        }, item.pane);
        $pane = $('<div></div>');
        $pane.attr(opt.attributes);
        if(opt.text) {
          $pane.append(opt.text);
        } else if (opt.tpl){
          var url = $FTT.baseurl + '/components/com_familytreetop/tpl/' + opt.tpl;
          $pane.load( url , function(){
            $FamilyTreeTop.fn.mod('l10n').parse($pane);
            opt.onLoad($pane);
          } );
        }
      } else if("string" === typeof(item.pane)){
        $pane = $(item.pane);
      } else {
        $pane = $('<div class="tab-pane fade"></div>');
      }

      if($toggle.hasClass('active')) $pane.addClass('active').addClass('in');
      $pane.attr('id', $toggle.find('a').attr('href').slice(1));

      pull.push({ toggle : $toggle, pane : $pane });
    });

    $cont.append($tabs);
    $cont.append($tabsCont);
    pull.forEach(function(item){
      $tabs.append(item.toggle);
      $tabsCont.append(item.pane);
    });

    return $cont;
  }

  $FTT.ui.formworker = function(options){
    var
      fn = {},
      groups = {},
      settings = false,
      defaults = {
        $cont : false,
        $items : false,
        cont : false,
        pull : false,
        data : false,
        schema : false,
        submit : false,
        onSubmit : false
      };

    settings = $.extend(true, {}, defaults, options);
    if(!settings.cont) return false;

    fn.serialize = function(){
      var ser =  {};
      settings.pull.forEach(function(item, index){
        if("undefined" !== typeof item.dataset.formworkerGroup){
          var groupName = item.dataset.formworkerGroup;
          if("undefined" === typeof(groups[groupName])){
            groups[groupName] = [];
          }
          groups[groupName].push(item);
        } else {
          ser[item.name] = fn.getValue(item.el);
        }
      });
      fn.each(groups, function(group, name){
        var s = {};
        group.forEach(function(it){
          s[it.name] = fn.getValue(it.el);
        });
        ser[name] = s;
      });
      return ser;
    };

    fn.each = function(object, callback){
      for(var key in object){
        if(!object.hasOwnProperty(key)) continue;
        callback.call(object, object[key], key);
      }
    }

    fn.getValue = function(element){
      switch(element.tagName){
        case "INPUT":
            switch($(element).attr('type')){
              case "checkbox":
                if(element.checked) return true;
                return false;
                break;
              case "radio":
                if(element.checked) $(element).val();
                break;
              case "text":
                return $(element).val();
                break;
            }
          break;

        case "SELECT":
          return $(element).find('option:selected').val();
          break;

        case "TEXTAREA":
            return $(element).val();
          break;
      }
      return "undefined";
    };

    fn.setValue = function(element, value){
      switch(element.tagName){
        case "INPUT":
          switch($(element).attr('type')){
            case "checkbox":
              if(element.check != value) $(element).click();
              break;

            case "radio":
              if($(element).val() == value) $(element).click();
              break;

            case "text":
              $(element).val(value);
              break;

            case "submit": break;
          }
          break;

        case "SELECT":
          if((Object.prototype.toString.call( value ) === '[object Array]')){
            value.forEach(function(val){
              if("object" === typeof(val)){
                $(element).append('<option value="'+val.value+'">'+val.option+'</option>');
              } else {
                $(element).append('<option value="'+val+'">'+val+'</option>');
              }
            });
          } else {
            $(element).find('option[value="'+value+'"]').attr('selected', 'selected')
          }
          break;

        case "TEXTAREA":
          $(element).val(value);
          break;
      }
      return true;
    };

    settings.$cont = $(settings.cont);
    settings.$items = settings.$cont.find('input[name],select[name],textarea[name]');

    settings.pull = [];

    settings.$items.each(function(index, element){
      var object = {}, opts;

      object.el = element;
      object.$el = $(element);
      object.name = $(element).attr('name');
      object.dataset = element.dataset;
      object.def = fn.getValue(element);
      object.value = object.def;

      if("undefined" !== typeof(settings.schema[object.name])){
        opts = $.extend(true, {}, {
          attr : {},
          value : false,
          events : false
        }, settings.schema[object.name]);

        $(element).attr(opts.attr);

        if("function" === typeof(opts.value)){
          object.value = opts.value.call(element, settings.data[object.name]);
        } else if("undefined" !== typeof(settings.data[object.name])){
          object.value =  settings.data[object.name];
        } else if("undefined" !== typeof(opts.value)){
          object.value = opts.value;
        }
        fn.setValue(element, object.value);

        if(opts.events){
          fn.each(opts.events, function(fn, selector){
            $(element).bind(selector, fn);
          });
        }

      } else if("undefined" !== typeof(settings.data) && "undefined" !== typeof(settings.data[object.name])){
        object.value =  settings.data[object.name];
        fn.setValue(element, object.value);
      }
      settings.pull.push(object);
    });

    if(settings.submit){
      $(settings.submit).click(function(){
        if(!settings.onSubmit) return true;
        Array.prototype.unshift.call(arguments, fn.serialize());
        return settings.onSubmit.apply(this, arguments);
      });
    }

    return {
      get : fn.getValue,
      set : fn.setValue,
      ser : fn.serialize
    };
  };


})(window);

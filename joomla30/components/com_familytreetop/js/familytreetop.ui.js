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
          tplVars : {
            baseurl : $FamilyTreeTop.fn.url().current(true),
            template : $FamilyTreeTop.template
          },
          onLoad : $.noop
        }, item.pane);
        $pane = $('<div></div>');
        $pane.attr(opt.attributes);
        if(opt.text) {
          $pane.append(opt.text);
        } else if (opt.tpl){
          jQuery.ajax({
            url:"index.php?option=com_familytreetop&task=api.tpl",
            data:{ tpl : opt.tpl },
            type: "POST",
            dataType:"html",
            success : function(source){
              var template = Handlebars.compile(source);
              $pane.append(template(opt.tplVars));
              $FamilyTreeTop.fn.mod('l10n').parse($pane);
              opt.onLoad($pane);
            }
          });
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

    return {
      object : $cont,
      getActiveTab : function(){
        var $link = $cont.find('ul.nav.nav-tabs li.active a');
        var href = $link.attr('href');
        return $cont.find('.tab-content '+href);
      }
    };
  }

  $FTT.ui.formworker = function(options){
    var
      fn = {},
      defaults = false,
      settings = false,
      objects = false,
      itemOpts = false,
      $ = jQuery,
      $blocks = false,
      blocksPull = false,
      $items = false;

    defaults = {
      serialize : false,
      fill : false,
      except : false,
      $cont : false,
      groups : false,
      data : false,
      schema : false,
      onSerialize : $.noop,
      onFill : $.noop
    };

    itemOpts = {
      events : false,
      setValue : false,
      setRule : false,
      getValue : false,
      groupBy : false,
      range : false,
      value : false
    };

    settings = $.extend(true, {}, defaults, options);

    if(!settings.$cont) return false;

    fn.isNumber = function(n){
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    fn.inArray = function(needle, haystack) {
      var length = haystack.length;
      for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
      }
      return false;
    };

    fn.setRange = function(object, range){
      if(range.length == 2 && "number" === typeof(range[0]) && "number" === typeof(range[1])){
        for(var i = range[0] ; i <= range[1] ; i++){
          object.$el.append('<option value="'+i+'">'+i+'</option>');
        }
      } else {
        range.forEach(function(opt){
          if("object" === typeof(opt)){
            object.$el.append('<option value="'+opt.value+'">'+opt.text+'</option>');
          } else {
            opt = "" + opt;
            object.$el.append('<option value="'+opt.toLowerCase()+'">'+opt+'</option>');
          }

        });
      }
    }

    fn.setValue = function(object, val){
      var value = object.setValue(val);
      switch(object.el.tagName){
        case "INPUT":
          switch(object.$el.attr('type')){
            case "checkbox":
              if(object.el.checked != value) object.$el.click();
              break;

            case "radio":
              if(object.$el.val() == value) object.$el.click();
              break;

            case "text":
              object.$el.val(value);
              break;
          }
          break;

        case "SELECT":
          if((Object.prototype.toString.call( value ) === '[object Array]')){
            value.forEach(function(val){
              if("object" === typeof(val)){
                object.$el.append('<option value="'+val.value+'">'+val.option+'</option>');
              } else {
                object.$el.append('<option value="'+val+'">'+val+'</option>');
              }
            });
          } else {
            object.$el.find('option[value="'+value+'"]').attr('selected', 'selected');
            object.$el.change();
          }
          break;

        case "TEXTAREA":
          object.$el.val(value);
          break;
      }
      return true;
    };

    fn.getValue = function(object){
      switch(object.el.tagName){
        case "INPUT":
          switch(object.$el.attr('type')){
            case "checkbox":
              if(object.el.checked) return object.getValue({name: object.name, value: true});
              return false;
              break;
            case "radio":
              if(object.el.checked) return object.getValue({ name: object.name, value: object.$el.val()});
              break;
            case "text":
              return object.getValue({ name: object.name, value: object.$el.val()});
              break;
          }
          break;

        case "SELECT":
          return object.getValue({ name: object.name, value: object.$el.find('option:selected').val()});
          break;

        case "TEXTAREA":
          return object.getValue({ name: object.name, value: object.$el.val()});
          break;
      }
      return object.getValue({ name: "", value: "undefined"});
    };

    fn.serialize = function(){
      var res;
      if(blocksPull){
        res = [];
        blocksPull.forEach(function(objs){
          res.push(_(objs));
        });
      } else {
        res = _(objects);
      }
      settings.onSerialize.call(null, res);
      return res;
      function _(objs){
        var response = {}, grps = {};
        fn.each(objs, function(object){
          if(object.groupBy){
            if("undefined" === typeof(grps[object.groupBy])){
              grps[object.groupBy] = [];
            }
            grps[object.groupBy].push(object);
          } else {
            var val = fn.getValue(object);
            if(val.name != "") response[val.name] = val.value;
          }
        });
        fn.each(grps, function(grp, grpName){
          var val;
          if("undefined" !== typeof(settings.groups[grpName])){
            val = settings.groups[grpName].apply(null, grp);
            if(val.name != "") response[val.name] = val.value;
          } else {
            if("undefined" === typeof(response[grpName])){
              response[grpName] = {};
            }
            fn.each(grp, function(object){
              val = fn.getValue(object);
              if(val.name != "") response[grpName][val.name] = val.value;
            });
          }
        });
        return response;
      }
    };

    fn.fill = function(){
      _(objects);
      return true;
      function _(objs){
        var grps = {};
        if(!settings.data) return false;
        fn.each(objs, function(object){
          if(object.setRule){
            var parse = {}, side, parts, name, func, args;
            side = object.setRule.split('|');
            parts = ("undefined"!==typeof(side[1]))?side[1].split(':'):false;
            name = (side[0] != "")?side[0]:false;
            func = (parts && "undefined"!==typeof(parts[0]))?parts[0]:false;
            args = (parts && "undefined"!==typeof(parts[1]))?parts[1].split(','):[];

            if(name){
              if("undefined" === typeof(grps[name])){
                grps[name] = [];
              }
              grps[name].push({
                obj : object,
                name : name,
                func : func,
                args : args
              });
            } else {
              if("undefined" !== typeof(settings.data[func])){
                fn.setValue(object, settings.data[func].apply(null, args));
              }
            }
          } else {
            if("undefined" !== typeof(settings.data[object.name])) fn.setValue(object, settings.data[object.name]);
          }
        });
        fn.each(grps, function(grp, grpName){
          if("undefined"===typeof(settings.groups[grpName])) return false;
          var vars = [];
          grp.forEach(function(item){
            if("undefined" !== typeof(settings.data[item.func])){
              vars.push(settings.data[item.func].call(null, item.args));
            }
          });
          settings.groups[grpName].call(null, vars);
        });
        settings.onFill.call(null);
      }
    };

    fn.each = function(object, callback){
      for(var key in object){
        if(!object.hasOwnProperty(key)) continue;
        callback.call(object, object[key], key);
      }
    }

    fn.parseItems = function(its){
      var objs = [];
      its.each(function(index, element){
        var object = {}, opts = false;
        object.el = element;
        object.$el = $(element);
        object.name = $(element).attr('name');
        object.dataset = element.dataset;

        if(settings.except && fn.inArray(object.name, settings.except)) return true;

        object.setRule = false;
        object.groupBy = false;

        object.setValue = function(value){ return value; };
        object.getValue = function(value){ return value; };

        if(settings.schema && "undefined" !== typeof(settings.schema[object.name])){
          opts = $.extend(true, {}, itemOpts, settings.schema[object.name]);
          if( opts.events
            && "object" === typeof(opts.events)
            && (Object.prototype.toString.call( opts.events ) !== '[object Array]')){
            fn.each(opts.events, function(func, selector){
              object.$el.bind(selector, func);
            });
          };
          if(opts.setRule) object.setRule = opts.setRule;
          if(opts.groupBy) object.groupBy = opts.groupBy;
          if(opts.setValue) object.setValue = opts.setValue;
          if(opts.getValue) object.getValue = opts.getValue;

          if(opts.range
            && object.el.tagName == "SELECT"
            && (Object.prototype.toString.call( opts.range ) === '[object Array]')){
            fn.setRange(object, opts.range);
          }
        }

        if("undefined" !== typeof(object.dataset.formworkerSetRule)){
          object.setRule = object.dataset.formworkerSetRule;
        }

        if("undefined" !== typeof(object.dataset.formworkerGroupBy)){
          object.groupBy = object.dataset.formworkerGroupBy;
        }

        if(opts && opts.value) {
          fn.setValue(object, opts.value);
        }

        objs.push(object);
      });
      return objs;
    };

    settings.$cont = $(settings.$cont);
    $blocks = settings.$cont.find('[data-formworker-block]');
    if($blocks.length > 0){
      blocksPull = [];
      $blocks.each(function(index, block){
        var items = $(block).find('input[name],select[name],textarea[name]');
        blocksPull.push(fn.parseItems(items));
      });
    } else {
      $items = settings.$cont.find('input[name],select[name],textarea[name]');
      objects = fn.parseItems($items);
    }

    if(settings.fill) fn.fill.call(null);
    if(settings.serialize) fn.serialize.call(null);

    return {
      objects : objects,
      serialize : fn.serialize,
      fill : fn.fill
    };
  }

  /*
  $FTT.ui.formworker = function(options){
    var
      fn = {},
      fillData = {},
      settings = false,
      defaults = {
        $cont : false,
        $items : false,
        cont : false,
        groups : false,
        pull : false,
        data : false,
        schema : false,
        submit : false,
        onSubmit : false
      };

    settings = $.extend(true, {}, defaults, options);
    if(!settings.cont) return false;

    fn.serialize = function(){
      var ser =  {}, groups = {};
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

    fn.setFillItem = function(object, opts, rule){
      // GROUP_NAME | DATA.FN _ args1,args2,args3
      var sides = rule.split('|');
      var name = sides[0];
      var right = ("undefined"!==typeof(sides[1]))?sides[1].split(':'):false;
      var func = (right)?right[0]:false;
      var args = (right&&"undefined"!==typeof(right[1]))?right[1].split(','):false;

      if(func && "undefined" !== typeof(settings.data[func])){
        object.value = settings.data[func].apply(null, (args)?args:[]);
      } else {
        if(opts){
          if("function" === typeof(opts.value)){
            object.value = opts.value.call(element, settings.data[object.name]);
          } else if(opts && "undefined" !== typeof(opts.value)){
            object.value = opts.value;
          } else if("undefined" !== typeof(settings.data[object.name])){
            object.value =  settings.data[object.name];
          }
        } else {
          if("undefined" !== typeof(settings.data[object.name])){
            object.value =  settings.data[object.name];
          }
        }
      }
      if(opts && !opts.fillOnce){
        if("undefined"!==typeof(fillData[name])){
          fillData[name] = [];
        }
        fillData.push(object);
      } else {
        fn.setValue(object.el, object.value);
      }
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
          fillRule : false,
          fillOnce : false,
          value : false,
          events : false
        }, settings.schema[object.name]);

        $(element).attr(opts.attr);

        if(opts.fillRule){
          fn.setFillItem(object, opts, opts.fillRule);
        } else {
          if("function" === typeof(opts.value)){
            object.value = opts.value.call(element, settings.data[object.name]);
          } else if("undefined" !== typeof(settings.data[object.name])){
            object.value =  settings.data[object.name];
          } else if("undefined" !== typeof(opts.value)){
            object.value = opts.value;
          }
          fn.setValue(element, object.value);
        }

        if(opts.events){
          fn.each(opts.events, function(selector, fn){
            $(element).bind(selector, fn);
          });
        }

      } else if("undefined" !== typeof(settings.data)){
        if("undefined" !== typeof(object.dataset.formworkerFillRule)){
          fn.setFillItem(object, false, object.dataset.formworkerFillRule);
        } else if("undefined" != typeof(settings.data[object.name])){
          object.value =  settings.data[object.name];
          fn.setValue(element, object.value);
        }
      }
      settings.pull.push(object);
    });

    fn.each(fillData, function(item, name){
      if("undefined" !== typeof(settings.groups[name])){
        settings.groups[name].call(this, item);
      }
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
      ser : fn.serialize,
      fil : fn.fill

    };
  };
  */


})(window);

$FamilyTreeTop.create("editor", function($){
  var
    $this = this,
    $fn = {};


  $fn.createImageBox = function(media){
    var $div = $('<div class="familytreetop-editor-media-container img-thumbnail" data-model-cid="'+media.cid+'">'
                 + '<div class="familytreetop-editor-media-content"></div>'
                 + '<div class="familytreetop-editor-media-buttons">'
                    + '<button class="btn btn-primary"><i class="fa fa-check"></i>Avatar</button>'
                    + '<button class="btn btn-default">Avatar</button>'
                    + '<button class="btn btn-danger"><i class="fa fa-trash-o"></i></button>'
                 + '</div>'
                + '</div>'),
        $img  = $this.mod('usertree').getImage(media.get('gedcom_id'), ["100","100"], media, 'medias');
    if(media.get('role') == 'AVAT'){
      $($div).find('.btn-default').addClass('hidden');
    } else {
      $($div).find('.btn-primary').addClass('hidden');
    }
    $div.find('.btn-danger').on('click', media, $fn.onDeleteAvatar);
    $div.find('.btn-default').on('click', media, $fn.onSetAvatar);
    $div.find('.btn-primary').on('click', media, $fn.onUnsetAvatar);
    $div.find('.familytreetop-editor-media-content').append($img);
    return $div;
  };

  $fn.onSetAvatar = function(e){
    var model = e.data,
        medias = $this.mod('controller').instance('Medias'),
        ind = $this.mod('usertree').individual({ gedcom_id : model.get('gedcom_id') }),
        avatar, old, $div;

    avatar = medias.findWhere({ role : "AVAT" });
    if("undefined" !== typeof(avatar)){
      old = ind.read().fn.getModelByCID('medias', avatar.cid);
      old.save({ role : "IMAG" });

      avatar = $('.familytreetop-medias-container').find('[data-model-cid="'+old.cid+'"]').closest('.familytreetop-editor-media-container');
      avatar.find('.btn-default').removeClass('hidden');
      avatar.find('.btn-primary').addClass('hidden');
    }
    model.save({ role : "AVAT" });

    $div = $(this).closest('.familytreetop-editor-media-container');
    $div.find('.btn-default').addClass('hidden');
    $div.find('.btn-primary').removeClass('hidden');

    $('img[gedcom_id="'+model.get('gedcom_id')+'"]').each(function(index, image){
      //console.log(image);
      if($(image).attr('is') == "medias") return true;
      $(image).attr('src', model.get('thumbnail_url'));
    });


  };
  $fn.onUnsetAvatar = function(e){
    var model = e.data, avatar;
    model.save({ role : "IMAG" });
    avatar = $('.familytreetop-medias-container').find('[data-model-cid="'+model.cid+'"]').closest('.familytreetop-editor-media-container');
    avatar.find('.btn-default').addClass('hidden');
    avatar.find('.btn-primary').removeClass('hidden');
  };
  $fn.onDeleteAvatar = function(e){
    var target = this,
        $div = $(target).closest('.familytreetop-editor-media-container'),
        model = e.data;

    $div.remove();
    $this.mod('controller').instance('Medias').remove(model);
    model.destroy({
      url : model.get('delete_url')
    });
  };

  $this.render = function(options){
    var
      $tabs = false,
      $btns = false,
      modal = false,
      settings = false,
      user = false,
      defaults = {
        gedcom_id : false,
        active_tab : false
    }

    settings = $.extend(true, {}, defaults, options);

    if(!settings.gedcom_id) return false;

    //get user data
    user = $this.mod('usertree').user(settings.gedcom_id);

    $btns = [
      $('<button class="btn btn-default" data-familytreetop-button="close" data-l10n-id="TPL_FAMILYTREETOP_MODAL_CLOSE"></button>'),
      $('<button class="btn btn-primary" data-familytreetop-button="save" data-l10n-id="TPL_FAMILYTREETOP_MODAL_SAVE"></button>'),
      $('<button class="btn btn-primary" data-familytreetop-button="save_and_close" data-l10n-id="TPL_FAMILYTREETOP_MODAL_SAVE_AND_CLOSE"></button>')
    ];
    $this.mod('l10n').parse($btns);

    $tabs = $FamilyTreeTop.ui.tabs({
      items : [
        {
          toggle : {
            active : true,
            href : "profile",
            text : '<i class="fa fa-user spaced-right-md"></i><span class="hidden-xs">' + $this.l10n('tpl_familytreetop_editor_tabs_profile') + '</span>'
          },
          pane : {
            tpl : "editor.tabs.profile.html",
            onLoad : function($pane){
              $pane.find('[data-familytreetop-avatar]').append(user.avatar(['90','90']));
              $FamilyTreeTop.ui.formworker({
                $cont : $pane,
                schema : {
                  'living' : {
                    events : {
                      'change' : function(){
                        var row = $pane.find('.row.spaced-top-md');
                        if($(this).find('option:selected').val() == "true"){
                          $(row[3]).addClass('hidden');
                          $(row[4]).addClass('hidden');
                          $(row[5]).addClass('hidden');
                        } else {
                          $(row[3]).removeClass('hidden');
                          $(row[4]).removeClass('hidden');
                          $(row[5]).removeClass('hidden');
                        }
                      }
                    }
                  },
                  'start_day' : {
                    range : [1, 31]
                  },
                  'start_year' : {
                    setValue : function(v){
                      if(v == "0") return "";
                      return v;
                    }
                  }
                },
                fill : true,
                data : user
              });
            }
          }
        },
        {
          toggle : {
            href : "unions",
            text : '<i class="glyphicon glyphicon-link spaced-right-md"></i><span class="hidden-xs">' + $this.l10n('tpl_familytreetop_editor_tabs_unions') + '</span>'
          },
          pane : {
            tpl : "editor.tabs.unions.html",
            onLoad: function($pane){
              var
                families = $FamilyTreeTop.fn.mod('usertree').getFamilies(user.gedcom_id),
                $standart = $pane.find('[familytreetop="module"]');
              for(var family_id in families){
                if(!families.hasOwnProperty(family_id)) continue;
                var $box = $standart.clone(),
                    family = $FamilyTreeTop.fn.mod('usertree').family(family_id),
                    event = family.event();
                $box.find('[data-familytreetop-avatar]').each(function(index, div){
                  var gedcomId = (index)?family.husb:family.wife,
                      partner = $FamilyTreeTop.fn.mod('usertree').user(gedcomId);
                      $(div).append(partner.avatar(["90","90"]));
                });
                $box.find('[data-familytreetop-user-data]').each(function(index, div){
                  var gedcomId = (index)?family.husb:family.wife,
                    partner = $FamilyTreeTop.fn.mod('usertree').user(gedcomId);
                  $(div).append(partner.name());
                });
                $FamilyTreeTop.ui.formworker({
                  $cont : $box,
                  data : {
                    family_id: family_id,
                    start_month : event.date.start_month,
                    start_day : event.date.start_day,
                    start_year : event.date.start_year,
                    city : event.place.city,
                    state : event.place.state,
                    country : event.place.country
                  },
                  fill : true,
                  onFill : function(){
                    $box.removeClass('hidden');
                    $pane.append($box);
                  }
                });
              }
            }
          }
        },
        {
          toggle : {
            href : "media",
            text : '<i class="glyphicon glyphicon-camera spaced-right-md"></i><span class="hidden-xs">' + $this.l10n('tpl_familytreetop_editor_tabs_media') + '</span>'
          },
          pane : {
            tpl : "editor.tabs.media.html",
            onLoad: function($pane){
              var ind = $this.mod('usertree').individual({ gedcom_id : user.gedcom_id });
              var medias = ind.read().instances.medias;
              var $cont = $('<div class="familytreetop-medias-container"></div>');
              $pane.append($cont);
              _.map(medias, function(media){
                var $div = $fn.createImageBox(media);
                $cont.append($div);
                return media;
              });
              $($pane).fileupload({
                formData:{ gedcom_id: user.gedcom_id},
                done: function(event, object){
                  var response = object.jqXHR.responseJSON;
                  var files = response.files;
                  $(files).each(function(index, el){
                    ind.update({
                      Medias : { data : el }
                    });
                  });
                  $(object.context).each(function(index, el){
                    $(el).remove();
                  });
                  var media = _.last(ind.read().instances.medias);
                  var $div = $fn.createImageBox(media);
                  $cont.append($div);
                  return true;
                }
              });
            }
          }
        },
        {
          toggle : {
            href : "options",
            text : '<i class="fa fa-asterisk spaced-right-md"></i><span class="hidden-xs">' + $this.l10n('tpl_familytreetop_editor_tabs_options') + '</span>'
          },
          pane : {
            tpl : "editor.tabs.options.html",
            onLoad: function($pane){
            }
          }
        }
      ],
      events : {
        onClick : function(){
          var target = $(this).attr('href').slice(1).split('-')[0];
          switch(target){
            case "profile" :
            case "unions" :
              $btns[0].removeClass('hidden');
              $btns[1].removeClass('hidden');
              $btns[2].removeClass('hidden');
              break;
            case "media" :
            case "options" :
              $btns[0].addClass('hidden');
              $btns[1].addClass('hidden');
              $btns[2].addClass('hidden');
              break;
          }
          return false;
        }
      }
    });

    modal = $FamilyTreeTop.ui.modal({
      title : user.name(),
      body : $tabs.object,
      buttons : $btns,
      events : {
        hidden : function(){
          this.remove();
        },
        onButtonClick : function(button){
          var type = button.dataset.familytreetopButton, isClose = false;
          if("undefined" === typeof(type)) return false;
          switch(type){
            case "close" :
              modal.hide();
              break;
            case "save_and_close":
              isClose = true;
            case "save" :
              $FamilyTreeTop.ui.formworker({
                $cont : $tabs.getActiveTab(),
                serialize : true,
                onSerialize : function(data){
                  switch($(this).attr('id').split('-')[0]){
                    case "profile":
                        var ind = $this.mod('usertree').individual({ gedcom_id : user.gedcom_id });
                        ind.update({
                          Individual : { gender : data.gender },
                          Name : {
                            first_name : data.first_name,
                            middle_name : data.middle_name,
                            last_name : data.last_name,
                            know_as : data.know_as
                          },
                          Events : {
                            'BIRT' : data.birth,
                            'DEAT' : (data.living!="true")?data.death:false
                          }
                        });
                      break;
                    case "unions":
                      data = data.slice(1);
                      var ind = $this.mod('usertree').individual({ gedcom_id : user.gedcom_id });
                      ind.update({
                        Families : data
                      });
                      break;
                  }
                  if(isClose) modal.hide();
                }
              });
              break;
            default : return false;
          }
        }
      }
    });

    modal.render();

  };
});

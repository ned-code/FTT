(function($, $ftt){
    $ftt.module.create("MOD_QUICK_FACTS", function(name, parent, ajax, renderType, popup){
        var	module = this,
            settings = storage.settings,
            loggedByFamous = parseInt(jQuery(document.body).attr('_type')),
            alias = jQuery(document.body).attr('_alias'),
            message = {
                FTT_MOD_QUICK_FACTS_HEADER:"Quick Facts",
                FTT_MOD_QUICK_FACTS_NUMBER:"Number of family members",
                FTT_MOD_QUICK_FACTS_YOUNGEST:"Youngest",
                FTT_MOD_QUICK_FACTS_OLDEST:"Oldest",
                FTT_MOD_QUICK_FACTS_EARLIEST:"Earliest document",
                FTT_MOD_QUICK_FACTS_YEARS:"years",
                FTT_MOD_QUICK_FACTS_LIVING:"living",
                FTT_MOD_QUICK_FACTS_SHOW_MORE_STATS:"Show more stats"
            },
            json,
            cont,
            fn;

        fn = {
            ajax:function(func, params, callback){
                ajax.call("quick_facts", "JMBQuickFacts", func, params, function(res){
                    callback(res);
                })
            },
            getTurn:function(parse){
                return parse.turns != 0 ? parse.turns : 'unknown';
            },
            getNumberFamilyString:function(){
                var sb = storage.stringBuffer();
                sb._('<font style="color:green;">')._(json.count)._('</font> ( ');
                sb._(json.living)._(' ');
                sb._(message.FTT_MOD_QUICK_FACTS_LIVING)._(' )');
                return sb.result();
            },
            getYoungestMemberString:function(){
                if(json.youngest == null) return 'unknown';
                var sb = storage.stringBuffer(), parse = storage.usertree.parse(storage.usertree.pull[json.youngest.user.gedcom_id]);
                sb._('<font id="')._(parse.gedcom_id)._('" style="color:#');
                sb._(settings.colors[parse.gender])._(';">');
                sb._(parse.full_name);
                sb._('</font> ( ');
                sb._(fn.getTurn(parse))._(' ')
                sb._(message.FTT_MOD_QUICK_FACTS_YEARS)._(' )');
                return sb.result();
            },
            getOldestMemberString:function(){
                if(json.oldest == null) return 'unknown';
                var sb = storage.stringBuffer(), parse = storage.usertree.parse(storage.usertree.pull[json.oldest.user.gedcom_id]);
                sb._('<font id="')._(parse.gedcom_id)._('" style="color:#');
                sb._(settings.colors[parse.gender]);
                sb._(';">');
                sb._(parse.full_name);
                sb._('</font> ( ');
                sb._(fn.getTurn(parse))._(' ');
                sb._(message.FTT_MOD_QUICK_FACTS_YEARS)._(' )');
                return sb.result();
            },
            create:function(){
                var sb = storage.stringBuffer(),
                    htmlObject;
                sb._('<div class="jmb_qf_header" >');
                sb._('<span>')._(message.FTT_MOD_QUICK_FACTS_HEADER)._('</span>');
                sb._('</div>');
                sb._('<div class="jmb_qf_content">');
                sb._('<div id="number_family_members" class="jmb_qf_item">');
                sb._('<span class="jmb_qf_title">');
                sb._(message.FTT_MOD_QUICK_FACTS_NUMBER);
                sb._(':</span>');
                sb._('<span class="jmb_qf_text">')._(fn.getNumberFamilyString())._('</span>');
                sb._('</div>');
                sb._('<div id="youngest_living_member" class="jmb_qf_item">');
                sb._('<span class="jmb_qf_title">');
                sb._(message.FTT_MOD_QUICK_FACTS_YOUNGEST);
                sb._(':</span>');
                sb._('<span class="jmb_qf_text">')._(fn.getYoungestMemberString())._('</span>');
                sb._('</div>');
                sb._('<div id="oldest_living_member" class="jmb_qf_item">');
                sb._('<span class="jmb_qf_title">');
                sb._(message.FTT_MOD_QUICK_FACTS_OLDEST)
                sb._(':</span>');
                sb._('<span class="jmb_qf_text">')._(fn.getOldestMemberString())._('</span>');
                sb._('</div>');
                sb._('</div>');
                htmlObject = jQuery(sb.result());
                jQuery(parent).append(htmlObject);
                return htmlObject;
            },
            setMiniProfile:function(target, object){
                if(object == null) return false;
                storage.tooltip.render('view', {
                    gedcom_id:object.user.gedcom_id,
                    target:target,
                    afterEditorClose:function(){
                        storage.tooltip.update();
                    }
                });
            },
            init:function(callback){
                fn.ajax('get', null, function(res){
                    json = res;
                    if(!json) return false;
                    if(json.language){
                        message = json.language;
                    }
                    cont = fn.create();
                    fn.setMiniProfile(jQuery(cont).find('div#youngest_living_member'), json.youngest);
                    fn.setMiniProfile(jQuery(cont).find('div#oldest_living_member'), json.oldest);
                    storage.profile.bind("JMBQuickFactsObject", function(){
                        jQuery(cont).remove();
                        cont = fn.create();
                        fn.setMiniProfile(jQuery(cont).find('div#youngest_living_member'), json.youngest);
                        fn.setMiniProfile(jQuery(cont).find('div#oldest_living_member'), json.oldest);
                    });
                    callback();
                });
            }
        }

        fn.init(function(){
            storage.core.modulesPullObject.unset('JMBQuickFactsObject');
        });

        storage.family_line.bind('JMBQuickFactsObject', function(res){
            if(res._type != 'pencil') return false;
            var usertree = {}
            usertree[json.youngest.user.gedcom_id] = json.youngest;
            usertree[json.oldest.user.gedcom_id] = json.oldest;
            jQuery(cont).find('div#youngest_living_member font,div#oldest_living_member font').each(function(i, el){
                var type = 'is_'+res._line+'_line';
                var id = jQuery(el).attr('id');
                var user =  usertree[id].user;
                if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
                    var opt = storage.family_line.get.opt();
                    if(opt.mother.pencil&&opt.father.pencil){
                        jQuery(el).addClass('jmb-familiy-line-bg');
                    } else {
                        jQuery(el).removeClass('jmb-familiy-line-bg');
                        if(opt.mother.pencil||opt.father.pencil){
                            if(opt[res._line].pencil){
                                jQuery(el).css('background-color', opt[res._line].pencil);
                            } else {
                                jQuery(el).css('background-color', (opt.mother.pencil)?opt.mother.pencil:opt.father.pencil);
                            }
                        } else {
                            jQuery(el).css('background-color', 'white');
                        }
                    }
                } else {
                    if(parseInt(user[type])){
                        jQuery(el).css('background-color', res._background);
                    }
                }
            });
        });
        return this;
    });
})(jQuery, $FamilyTreeTop);


function JMBQuickFactsObject(object){
    $FamilyTreeTop.module.init("MOD_QUICK_FACTS", object, $FamilyTreeTop.fn.mod("ajax"), "desctop", popup);
}





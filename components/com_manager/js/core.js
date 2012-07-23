//globl object storage
storage = {};
storage.app = false;
//function
storage.alert = function(message, callback){
    if(!message){
        message = '';
    }

    jQuery('<div style="text-align: center;"></div>').text(message).dialog({
        width:350,
        minHeight:80,
        resizable: false,
        draggable: false,
        closeOnEscape: false,
        modal:true,
        close:callback
    });
}

storage.addEvent = function(pull, func){
	pull[pull.length] = {};
	pull[pull.length].click = func;
	pull.length++;
}
storage.createPull = function(o){
	o.clickPull = {}
	o.clickPull.length = 0;
	o.click = function(object){ 
		for(var i=0;i<o.clickPull.length;i++){
			o.clickPull[i].click(object);
		}
	}	
}
storage.clearPull = function(o){
	for(var i=0;i<o.clickPull.length;i++){
		delete o.clickPull[i];
	}	
	o.clickPull.length = 0;
}

//global varning
storage.url = "components/com_manager/";
storage.mediaTmpPath = "media/tmp/";
storage.fb = {};
storage.fb.appId = "184962764872486";
storage.fb.status = true;
storage.fb.cookie = true;
storage.fb.xfbml = true;
storage.iframe = jQuery('<iframe id="ftt_iframe" name="ftt_iframe" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">');
storage.settings = null;
storage.pages = null;

//modules
storage.login = {};
storage.header = {};
storage.media = {};
storage.invitation = {};
storage.tooltip = {};
storage.profile = {};
storage.family_line = {};
storage.progressbar = {};
storage.feedback = {};
storage.ntf = {};

//usertree
storage.usertree = {};
storage.usertree.user = null;
storage.usertree.friends = null;
storage.usertree.gedcom_id = null;
storage.usertree.facebook_id = null;
storage.usertree.tree_id = null;
storage.usertree.permission = null;
storage.usertree.users = null;
storage.usertree.pull = null;
storage.usertree.extend = function(def, sub){
	for (var key in sub){
		if(!def[key]){
			def[key] = sub[key];
		}
	}
}
storage.usertree.update = function(objects, save){
    var p = {};
    for(var key in objects) {
        var item = objects[key];
        if (item) {
            var gedcom_id = item.user.gedcom_id;
            if (gedcom_id != null) {
                if(save){
                    storage.usertree.pull[gedcom_id] = item;
                }
                p[gedcom_id] = item;
            }
        }
    }
    return p;
}
storage.usertree.deleted = function(objects){
    for(var key in objects) {
        var item = objects[key];
        if (item) {
            var gedcom_id = item.gedcom_id;
            if (gedcom_id != null) {
                delete storage.usertree.pull[gedcom_id];
            }
        }
    }
}
storage.usertree.parse = function(object){
	var	user = object.user,
		families = object.families,
		media = object.media,
		date_num = {"day":0,"month":1,"year":2},
		_month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	return {
		gedcom_id:user.gedcom_id,
		facebook_id:user.facebook_id,
		first_name:(user.first_name!=null)?user.first_name.replace('@P.N.', ''):'',
		middle_name:(user.middle_name!=null)?user.middle_name:'',
		last_name:(user.last_name!=null)?user.last_name.replace('@N.N.', ''):'',
		nick:(user.nick!=null)?user.nick:'',
		gender:user.gender,
		relation:(user.relation!=null)?user.relation:false,
		default_family:(user.default_family!='0')?user.default_family:false,
		avatar_id:(function(){
			var avatar = (media!=null)?media.avatar:null;
			if(avatar!=null){
				return avatar.media_id;
			}
			return 0;
		})(),
		getPhotoIndex:function(media_id){
			if(media==null) return false;
			for(var index in media.photos){
				if(media.photos[index].media_id == media_id){
					return index;
				}
			}
		},
		name:(function(){
            return getFullName(getFirstName(user), getLastName(user));
			function getName(u, t, r){
                if(u[t] != null && u[t].length != 0){
                    return user[t].replace(r, '');
                }
                return '';
            }
            function getFirstName(u){
                return getName(u, 'first_name', '@P.N.');
            }
            function getLastName(u){
                return getName(u, 'last_name', '@N.N.');
            }
            function getShortLastName(l){
                if(l.length <= 27) return l;
                var string = '';
                for(var i = 0 ; i <= 27 ; i++){
                    string += l[i];
                }
                string += '...';
                return string;
            }
            function getFullName(first, last){
                var fName = [first, last].join(' ');
                if(fName.length > 30){
                    return [(first.length!=0)?first[0]+'.':'', getShortLastName(last)].join('');
                } else {
                    return fName;
                }
            }
		})(),
		full_name:(function(){
            return getFullName(getFirstName(user), getMiddleName(user), getLastName(user));
            function getName(u, t, r){
                if(u[t] != null && u[t].length != 0){
                    if(r){
                        return user[t].replace(r, '');
                    } else {
                        return user[t];
                    }

                }
                return '';
            }
            function getFirstName(u){
               return getName(u, 'first_name', '@P.N.');
            }
            function getMiddleName(u){
                return getName(u, 'middle_name', false);
            }
            function getLastName(u){
                return getName(u, 'last_name', '@N.N.');
            }
            function getShortLastName(l){
                if(l.length <= 27) return l;
                var string = '';
                for(var i = 0 ; i <= 27 ; i++){
                    string += l[i];
                }
                string += '...';
                return string;
            }
            function getInitials(first, middle){
                var f = (first.length!=0)?first[0]+'.':'';
                var m = (middle.length!=0)?middle[0]+'.':'';
                return [f,m].join('');
            }
            function getFullName(first, middle, last){
                var fName = [first,middle,last].join(' ');
                if(fName.length > 30){
                    return [getInitials(first, middle), getShortLastName(last)].join('');
                } else {
                    return fName;
                }
            }
		})(),
		nick:(function(){
			var	nick = user.nick,
				first_name = user.first_name.replace('@P.N.', '');
				return (nick!=null)?nick:first_name;
		})(),
        is_editable:(user.facebook_id == '0' || user.gedcom_id == storage.usertree.gedcom_id),
        is_deletable:(user.creator == storage.usertree.gedcom_id || user.gedcom_id == storage.usertree.gedcom_id),
        is_birth:(function(){
            var event = user['birth'];
            if(event != null){
                var date = event.date;
                return ( date[0]!=null || date[1] != null || date[2] != null )?1:0;
            }
            return 0;
        })(),
        is_death:(function(){
            var event = user['death'];
            /*
            if(event!=null){
                var date = event.date;
                return ( date[0]!=null || date[1] != null || date[2] != null )?1:0;
            }
            return 0;
            */
            return (event!=null)?1:0;
        })(),
		is_alive:user.is_alive,
		is_married_event:function(id){
			return (families[id]&&families[id].marriage!=null)?1:0;
		},
        is_married_date_exist:function(id){
            var family = families[id];
            if(family&&family.marriage!=null){
                var date = family.marriage.date;
                return (date[0]!=null||date[1]!=null||date[2]!=null);
            }
            return false;
        },
		is_divorce_event:function(id){
			return (families[id]&&families[id].divorce!=null)?1:0;
		},
		marr:function(id, type, sub){
			var family = families[id];
            if(family){
                var event = family.marriage;
                if(event != null && type){
                    var evType = event[type];
                    if(evType){
                        if(!sub){
                            return evType;
                        } else{
                            switch(type){
                                case "date":
                                    return (evType[sub] != null) ? evType[sub] : '';
                                break;

                                case "place":
                                    return (evType[0]!= null && evType[0][sub] != null) ? evType[0][sub] : '';
                                break;
                            }
                        }
                    }
                }
            }
			return '';
		},
		divorce:function(id, type, sub){
            var family = families[id];
            if(family){
                var event = family.divorce;
                if(event != null && type){
                    var evType = event[type];
                    if(evType){
                        if(!sub){
                            return evType;
                        } else{
                            switch(type){
                                case "date":
                                    return evType[sub] != null ? evType[sub] : '';
                                    break;

                                case "place":
                                    return evType[0][sub] != null ? evType[0][sub] : '';
                                    break;
                            }
                        }
                    }
                }
            }
            return '';
		},
		birth:function(f){
			var event = user['birth'];
			if(event!=null){
				var date = event.date;
				if(f){
					return (date[date_num[f]]!=null)?date[date_num[f]]:'';
				}
				return date;
			}
			return '';
		},
		death:function(f){
			var event = user['death'];
			if(event!=null){
				var date = event.date;
				if(f){
					return (date[date_num[f]]!=null)?date[date_num[f]]:'';
				}
				return date;
			}
			return '';
		},
		turns:(function(){
			var event = user['birth'];
			if(event){
				var date = event.date;
				if(date&&date[2]!=null){
					return (new Date()).getFullYear() - date[2];
				}
			} 
			return 0;
		})(),
		date:function(event, sub){
			var 	event = user[event],
				date = (event!=null)?event.date:null;
			if(date!=null){
				if(sub){
					return (date[sub])?date[sub]:0;
				} else {
					return [date[0],_month[date[1]-1],date[2]].join(' ');
				}
			}
			return '';			
		},
		place:function(type, sub){
			var event = user[type];
			if(event!=null){
				var place = event.place;
				if(place!=null){
					return (!sub)?place[0]:((place[0][sub]!=null)?place[0][sub]:'');
				}
			}
			return '';
		},
        getPlaceName:function(type){
            var event = user[type];
            if(event != null){
                var place = (event.place != null && event.place.length != 0)?event.place[0]:null;
                if(place!= null){
                    var name = place.place_name;
                    if(name != null && name != ''){
                        return name;
                    }
                }
            }
            return '';
        },
        getPlaceString:function(type){
            var event = user[type];
            if(event != null){
                var place = (event.place != null && event.place.length != 0)?event.place[0]:null;
                if(place!= null){
                    var city = place.city;
                    var country = place.country;
                    if(city != null && country != null){
                        return '(' + city + ', ' + country + ')';
                    } else if(city != null || country != null){
                        return '(' + (city || country) + ')';
                    }
                }
            }
            return '';
        }
	}
}
storage.usertree.paths = {}
storage.usertree.paths.getMediaTmp = function(){
    return storage.baseurl + storage.url + storage.mediaTmpPath + storage.usertree.tree_id + '/';
}
storage.usertree.avatar = {}
storage.usertree.avatar._type = function(object){
    var media = object.media;
    if(media!=null){
        if(media.avatar!=null){
            return 'media';
        }
    }
    if(object.user.facebook_id != "0"){
        return 'facebook'
    }
    return 'default';
}
storage.usertree.avatar.def_image = function(settings, gender){
    var pathImage = [storage.baseurl,storage.url,'js/images/',(gender=="F")?"female_big.png":"male_big.png"].join("");
    var sb = host.stringBuffer();
    sb._('<img');
    sb._(' class="')._( (settings.cssClass)? settings.cssClass : '' )._('"');
    sb._(' src="')._(pathImage)._('"');
    sb._('width="')._(settings.width)._('px"');
    sb._('height="')._(settings.height)._('px"');
    sb._('>');
    return sb.result();
}
storage.usertree.avatar.def = function(settings, gender){
    if(!settings.object) return '';
    var stavObject = storage.usertree.avatar,
        object = settings.object,
        sb = host.stringBuffer();

    switch(stavObject._type(object)){
        case "facebook":
        case "media":
            sb._(storage.usertree.avatar.get(settings));
        break;

        default:
            sb._(storage.usertree.avatar.def_image(settings, gender));
        break;
    }
    return sb.result();
}
storage.usertree.avatar.get = function(settings){
    if(!settings.object) return '';
    var stavObject = storage.usertree.avatar,
        object = settings.object,
        sb = host.stringBuffer();
    switch(stavObject._type(object)){
        case "facebook":
            sb._('<img');
            sb._(' class="')._( (settings.cssClass)? settings.cssClass : '' )._('"');
            sb._(' src="index.php?option=com_manager&task=getResizeImage');
            sb._('&tree_id=')._(storage.usertree.tree_id);
            sb._('&fid=')._(object.user.facebook_id);
            sb._('&w=')._(settings.width);
            sb._('&h=')._(settings.height);
            sb._('"');
            sb._('>');
            break;

        case "media":
            var media = object.media,
                cache = media.cache,
                pathTmp = storage.usertree.paths.getMediaTmp(),
                cacheFileName = [settings.width, settings.height].join('_'),
                imgPull = media.avatar;
            sb._('<img');
            sb._(' class="')._( (settings.cssClass)? settings.cssClass : '' )._('" ');
            if(cache[imgPull.media_id]&&cache[imgPull.media_id][cacheFileName]){
                var filePath = pathTmp + cache[imgPull.media_id][cacheFileName];
                sb._(' src="')._(filePath)._('"');
                sb._(' width="')._(settings.width)._('px"');
                sb._(' height="')._(settings.height)._('px"');
            } else {
                sb._(' src="index.php?option=com_manager&task=getResizeImage');
                sb._('&tree_id=')._(storage.usertree.tree_id);
                sb._('&id=')._(imgPull.media_id);
                sb._('&w=')._(settings.width);
                sb._('&h=')._(settings.height);
                sb._('"');
            }
            sb._('>');
            break;

        default:
            var gender = object.user.gender;
            sb._(storage.usertree.avatar.def_image(settings, gender));
            break;

    }
    return sb.result();
}
storage.usertree.photos = {}
storage.usertree.photos.image = function(args){
    var sb = host.stringBuffer(),
        cache = args.cache,
        cacheName = [args.width, args.height].join("_"),
        pathTmp = storage.usertree.paths.getMediaTmp(),
        image = args.image;

    sb._('<img');
    sb._(' class="')._( (args.cssClass)? settings.cssClass : '' )._('" ');
    if(cache&&cache[image.media_id]&&cache[image.media_id][cacheName]){
        var filePath = pathTmp + cache[image.media_id][cacheName];
        sb._(' src="')._(filePath)._('"');
        sb._(' width="')._(args.width)._('px"');
        sb._(' height="')._(args.height)._('px"');
    } else {
        sb._(' src="index.php?option=com_manager&task=getResizeImage');
        sb._('&tree_id=')._(storage.usertree.tree_id);
        sb._('&id=')._(image.media_id);
        sb._('&w=')._(args.width);
        sb._('&h=')._(args.height);
        sb._('"');
    }
    sb._('>');
    return sb.result();
}
storage.usertree.photos.get = function(args){
    if(args.image==null) return '';
    var sb = host.stringBuffer(),
        stphObject = storage.usertree.photos;
    if(args.prettyPhoto){
        sb._('<a href="')._(storage.baseurl + args.image.path.substr(1))._('" rel="prettyPhoto[pp_gal]" title="">');
            sb._(stphObject.image(args));
        sb._('</a>');
    } else {
        sb._(stphObject.imagte(args));
    }
    return sb.result();
}
//form
storage.form = {
    dataTable:function(css, opt){
        var sb = host.stringBuffer();
        sb._('<table style="')._(css)._('" >');
            for(var key in opt){
                if (!opt.hasOwnProperty(key)) continue;
                var el = opt[key];
                sb._('<tr>');
                    sb._('<td><div class="title"><span>')._(el.name)._('</span>:</div></td>');
                    sb._('<td><div id="')._((el.id)?el.id:'')._('" style="')._((el.css)?el.css:'')._('" class="text"><span>')._((el.value)?el.value:'')._('</span></div>');
                sb._('</tr>');
            }
        sb._('</table>');
        return sb.result();
    }
}


//ajax request
storage.request = {};
storage.request.pull = {};
storage.request.pull.length = 0;
storage.request.key = function(){
	return (new Date()).valueOf();
}
storage.request.add = function(object, key){
	storage.request.pull[key] = object;
	storage.request.pull.length++;
}
storage.request.del = function(key){
	delete storage.request.pull[key];
	storage.request.pull.length--;
}
storage.request.cleaner = function(){
	var pull = storage.request.pull;
	if(pull.length!=0){
		for(var key in pull){
			if(key!='length'){
				pull[key].abort();
				delete pull[key];
			}
		}
	}
	storage.request.pull.length = 0;
}

storage.callMethod = function(module, classname, method, args, callback){
    var url = storage.baseurl+storage.url+'php/ajax.php';
    var key = storage.request.key();
    var xnr = jQuery.ajax({
        url: url,
        type: "POST",
        data: 'module='+module+'&class='+classname+'&method='+method+'&args='+args,
        dataType: "html",
        complete : function (req, err) {
            //storage.request.del(key);
            if(req.responseText.length!=0){
                callback(req);
            } else {
                callback(false);
            }
        }
    });
    storage.request.add(xnr, key);
    return xnr;
}
storage.getJSON = function(str){
    var json;
    try {
        json = jQuery.parseJSON(str);
    } catch (e) {
        return false;
    }
    return json;
}

storage.stringBuffer = function(){
    return (function(){
        var b = "";
        this.length = 0;
        return {
            _:function(s){
                if(arguments.length>1){
                    var tmp="", l=arguments.length;
                    switch(l){
                        case 9: tmp=""+arguments[8]+tmp;
                        case 8: tmp=""+arguments[7]+tmp;
                        case 7: tmp=""+arguments[6]+tmp;
                        case 6: tmp=""+arguments[5]+tmp;
                        case 5: tmp=""+arguments[4]+tmp;
                        case 4: tmp=""+arguments[3]+tmp;
                        case 3: tmp=""+arguments[2]+tmp;
                        case 2: {
                            b+=""+arguments[0]+arguments[1]+tmp;
                            break;
                        }
                        default: {
                            var i=0;
                            while(i<arguments.length){
                                tmp += arguments[i++];
                            }
                            b += tmp;
                        }
                    }
                } else {
                    b += s;
                }
                this.length = b.length;
                return this;
            },
            clear:function(){
                b = "";
                this.length = 0;
                return this;
            },
            result:function(){
                return b;
            }
        }
    }).call(this)
}

//tabs
storage.tabs = {};
storage.tabs.activeTab = null;
//storage.createPull(storage.tabs);
storage.tabs.clickPull = {};
storage.tabs.clickPull.length = 0;
storage.tabs.click = function(callback){ 
	for(var i=0;i<storage.tabs.clickPull.length;i++){
		storage.tabs.clickPull[i].click();
	}
	storage.tabs.cleaner();
	if(callback) callback();
}	
storage.tabs.cleaner = function(){
	storage.clearPull(storage.tabs);
	//storage.request.cleaner();
}
storage.timeout = function(){
	setInterval(function(){
		jQuery.ajax({
			url: 'index.php?option=com_manager&task=timeout',
			type: "POST",
			dataType: "json",
			complete : function (req, err) {}
		});
	}, 60000)

}
storage.timeout();

//core object
var date = new Date();
var id =  Math.floor(date.getTime() /1000);
var core = {};
storage.core = core;
core.appendFilesPull = {};

core.modal = function(){
	var modal_div = jQuery('<div class="jmb-core-overlay">&nbsp;</div>');
	var modal_active = false;
	return {
		isActive:function(){
			return modal_active;
		},
		on:function(div){
			var w = jQuery(div).width();
			var h = jQuery(div).height();
			jQuery(modal_div).css('width', w+'px').css('height', '400px');
			jQuery(div).append(modal_div);
			modal_active = true;
		},
		off:function(){
			jQuery(modal_div).remove();
			modal_active = false;
		}
	}
}
core.modulesPullFunc = function(){
	var core = this;
	var modal = core.modal();
	core.modulesPull = { length:0 };
    core.activeModule = null;
    core.pull = [];
	return {
        getActiveModule:function(){
            return core.activeModule;
        },
        bind:function(call){
            core.pull.push({
                id: (new Date()).valueOf(),
                callback: call
            });
        },
        finish:function(){
            for(var key in core.pull){
                if(core.pull.hasOwnProperty(key)){
                    core.pull[key].callback(core.pull[key]);
                    delete core.pull[key];
                }
            }
            core.pull = [];
        },
		insert:function(name){
            core.activeModule = name;
			core.modulesPull[name] = name;
			core.modulesPull.length++;
		},
		unset:function(name){
			if(core.modulesPull[name]){
				delete core.modulesPull[name];
				core.modulesPull.length--;
				if(core.modulesPull.length<0){
					core.modulesPull.length = 0;
				}
                if(core.modulesPull.length == 0){
                    this.finish();
                }
			}
		},
		clear:function(){
			var pull = this;
			for(var key in core.modulesPull){
				if(key!='length'){
					pull.unset(key);
				}
			}
            core.activeModule = null;
			modal.off();
		},
		init:function(div){
			var pull = this;
			pull.clear();
			modal.on(div);
			var it = 30;
			var interval_id = setInterval(function(){
				if(core.modulesPull.length==0){
					modal.off();
					clearInterval(interval_id);
				}
				if(it<=0){
					if(modal.isActive()){
						modal.off();
					}
					pull.clear();
					clearInterval(interval_id); 
				}
				it--;
			}, 1000);
		}
	}
}
core.modulesPullObject = core.modulesPullFunc();

core.destroy = {};
core.destroy.pull = false;
core.destroy.set = function(name, callback){
    core.destroy.pull = {
        name:name,
        callback:callback
    }
}
core.destroy.start = function(){
    if(core.destroy.pull){
        core.destroy.pull.callback();
        core.destroy.pull = false;
    }
}

core.createLayout = function(type){
	var layout_type = {'single':1,'double':2,'triple':3};
	var td_length = layout_type[type];
	var table = jQuery('<table style="table-layout:fixed;" id="jmb_page_layout_table"  width="100%" height="100%"></table>');
	var tr = jQuery('<tr class="jmb_layout_row"></tr>');
	jQuery(table).append(tr);
	for(var cell=1; cell<=td_length;cell++){
		var td = jQuery('<td style="width:auto;" class="jmb_layout_cell_single" id="jmb_page_layout_content_'+cell+'" valign="top"></td>');
		jQuery(tr).append(td);
	}
	return table;
}

core.appendFiles = function(module, type){
	var self = this;
	var url = jQuery('body').attr('_baseurl')+'components/com_manager/modules/'+module.info.name;
	var head = document.getElementsByTagName("head");
	var files = module.files[type];
	for(var i=0;i<files.length;i++){
		if(!core.appendFilesPull[files[i]]){
			switch(type){
				case "js":
					var script = document.createElement("script");
					script.src = url+'/'+type+'/'+files[i];
					script.type="text/javascript";
					head[0].appendChild(script);
				break;
				
				case "css":
					var link = document.createElement("link");
					link.href = url+'/'+type+'/'+files[i];
					link.rel="stylesheet";
					link.type="text/css";
					head[0].appendChild(link);
				break;
			}
			core.appendFilesPull[files[i]] = files[i];
		}
	}		
}

core.initModule = function(args){
	var self = this,
        object_name = args.name,
        div = args.cont,
        popup = args.popup;
    	if(typeof window[object_name]=='function'){
    		new window[object_name](div, popup);
    	}
        else {
        	setTimeout(function(){
        		self.initModule(args);
        	},1000);
        }
}
core.renderPage = function(args){
   	var self = this;
    var parent = args.selector;
    var page = args.page;
    var popup = args.popup;
	var grid = page.grid;
	var table = self.createLayout(page.page_info.layout_type);
	var tds = jQuery(table).find('td');
    storage.family_line.init(page);
    jQuery(parent).unbind();
	jQuery(parent).html('');

	for(var i = 0; i < grid.tdLength; i++){
		var td = tds[i];
		for(var j = 0; j < grid[i].divLength; j++){
			var module_id = grid[i][j].id; 
			var module = page.modules[module_id];
			//append js files;
			self.appendFiles(module, 'css');
			self.appendFiles(module, 'js');
			
			//append module div;
			var div = jQuery('<div id="'+module.container_id+'"></div>');
			jQuery(td).append(div);
			
			//init module;
			core.modulesPullObject.insert(module.object_name);
			//self.initModule(module.object_name, div, popup);
			self.initModule({
                name:module.object_name,
                cont:div,
                popup:popup
            });
		}
	}
    jQuery(parent).append(table);
}
core.renderTabs = function(args){
	var self = this;
    var parent = args.selector;
    var pages = args.pages;
	var ul = jQuery('<ul class="jmbtabs"></ul>'); 
    	var div = jQuery('<div class="tab_container"></div>');
    	
    	jQuery(parent).append(ul);
    	jQuery(parent).append(div);
    	
    	jQuery(pages).each(function(i,page){
            var title = page.page_info.title.toUpperCase().split(' ');
            var titleName = storage.langString['FTT_COMPONENT_'+title.join('_')];
    		var div = jQuery('<div id="'+(new Date()).valueOf()+'">'+titleName+'</div>');
    		var li = jQuery('<li name="" id="'+i+'"><a href="jmbtab_'+i+'" onclick="return false;"></a></li>');
    		jQuery(li).find('a').append(div);
    		jQuery(ul).append(li);
    	});
    	
    	var divs = jQuery('<div id="jmbtab" class="tab_content">&nbsp;</div>');	
    	jQuery(div).append(divs);
    	
    	//When page loads...
	jQuery(".tab_content").hide(); //Hide all content

    var loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
    var classByLogged = (loggedByFamous)? 'famous-family' : 'myfamily' ;
    jQuery('ul.jmbtabs').addClass(classByLogged);
    jQuery('.tab_content').addClass(classByLogged);
			
	//On Click Event
	jQuery("ul.jmbtabs li").click(function() {
		if(jQuery(this).hasClass('active')) return false;
		core.modulesPullObject.init(div);
        core.destroy.start();
		
		//cleaner objects
		storage.request.cleaner();
		storage.tooltip.cleaner();

		storage.tabs.activeTab = this;
		storage.tabs.click();
		
		jQuery("ul.jmbtabs li").removeClass("active"); //Remove any "active" class
		jQuery(this).addClass("active"); //Add "active" class to selected tab
		jQuery(divs).hide(); //Hide all tab content
	
		var id = jQuery(this).attr('id');
		var page = pages[id];
		
		//self.renderPage('#jmbtab', page, false);
		self.renderPage({
            selector:"#jmbtab",
            page:page,
            popup:false
        });
		jQuery(divs).show(); //Hide all tab content
		return false;
	});
    if(storage.activeTab == ''){
        jQuery("ul.jmbtabs li:first").click(); //click first
    } else {
        jQuery('ul.jmbtabs li#2').click();
    }

}

core.load = function(pages){
	var self = this;
	jQuery('body').ready(function(){
        host = new Host();
		storage.baseurl = jQuery('body').attr('_baseurl');
		jQuery(document.body).append(storage.iframe);
		//init global modules
		storage.header = new JMBHeader();
		storage.overlay = new JMBOverlay();
		storage.login = new JMBLogin();
		storage.profile = new JMBProfile();
		storage.media = new JMBMediaManager();
		storage.invitation = new JMBInvitation();
		storage.tooltip = new JMBTooltip();
		storage.topmenubar = new JMBTopMenuBar();
		storage.family_line = new JMBFamilyLine();
        storage.progressbar = new JMBProgressbarObject();
        storage.feedback = new JMBFeedback();
        storage.ntf = new JMBNotifications();
		
		//init top menu bar
        storage.topmenubar.init();

		//set width
		var mode = (window != window.top)?'facebook':'standalone';
		var cont = jQuery("div.content");
		if(mode == 'facebook'){
			jQuery(cont).css('max-width', '760px');
			jQuery(cont).find('div.right').remove();
		} else if(mode == 'standalone'){
			jQuery(cont).css('max-width', '920px');
			//jQuery(cont).find('div.footer').remove();
		}

        //set object to pages variable
        if(typeof(pages) == "object"){
            storage.login.init(function(){
                storage.ntf.init();
                storage.profile.init();
                storage.tooltip.init();
                storage.feedback.init();
                storage.pages = pages;
                if(storage.pages.length==1){
                    self.renderPage({
                        selector:"#page",
                        page:storage.pages[0],
                        popup:false
                    });
                } else {
                    self.renderTabs({
                        selector:"#container",
                        pages:storage.pages
                    });
                }
            });
        }

        //set string to pages variable
        if(typeof(pages) == "string"){
            jQuery.ajax({
                url:'index.php?option=com_manager&task=getPageInfo&ids='+pages,
                type:'GET',
                complete:function(req, err){
                    storage.login.init(function(){
                        if(err=='success'){
                            storage.ntf.init();
                            storage.profile.init();
                            storage.tooltip.init();
                            storage.feedback.init();
                            var json = jQuery.parseJSON(req.responseText);
                            storage.pages = json.pages;
                            if(json.pages.length==1){
                                self.renderPage({
                                    selector:"#page",
                                    page:json.pages[0],
                                    popup:false
                                });
                            } else {
                                self.renderTabs({
                                    selector:"#container",
                                    pages:json.pages
                                });
                            }
                        }
                    });
                }
            });
        }
	});
}

//globl object storage
storage = {};
//function
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
storage.session = id;
storage.fb = {};
storage.fb.appId = "184962764872486";
storage.fb.status = true;
storage.fb.cookie = true;
storage.fb.xfbml = true;
storage.iframe = jQuery('<iframe id="ftt_iframe" name="ftt_iframe" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">');
storage.login = {};
//storage.language = {};
storage.media = {};
storage.invitation = {};
storage.tooltip = {};
storage.profile = {};

//usertree
storage.usertree = {};
storage.usertree.pull = null;
storage.usertree.extend = function(def, sub){
	for (var key in sub){
		if(!def[key]){
			def[key] = sub[key];
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
		first_name:(user.first_name!=null)?user.first_name:'',
		middle_name:(user.middle_name!=null)?user.middle_name:'',
		last_name:(user.last_name!=null)?user.last_name:'',
		nick:(user.nick!=null)?user.nick:'',
		gender:user.gender,
		relation:(user.relation!=null)?user.relation:false,
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
			return [user.first_name,user.last_name].join(' ');
		})(),
		full_name:(function(){
			var	first_name = user.first_name,
				middle_name = user.middle_name,
				last_name = user.last_name;
				
			return [first_name, middle_name, last_name].join(' ');
		})(),
		nick:(function(){
			var	nick = user.nick,
				first_name = user.first_name;
				return (nick!=null)?nick:first_name;
		})(),
		is_death:(function(){
			return (user.is_alive)?0:1;
		})(),
		is_alive:user.is_alive,
		is_birth:(function(){
			var event = user['birth'], date;
			if(event!=null){
				date = event.date;
				return ( date[0]!=null || date[1] != null || date[2] != null )?1:0;
			}
			return 0;
		})(),
		is_married_event:function(id){
			return (families[id]&&families[id].marriage!=null)?1:0;
		},
		is_divorce_event:function(id){
			return (families[id]&&families[id].divorce!=null)?1:0;
		},
		is_death:(function(){
			var event = user['death'], date;
			if(event!=null){
				date = event.date;
				return ( date[0]!=null || date[1] != null || date[2] != null )?1:0;
			}
			return 0;
		})(),
		marr:function(id, type, sub){
			var	family = families[id],
				event = (family)?family.marriage:false;
			if(event){
				if(event[type]!=null){
					if(sub){
					 	return (event[type][sub]!=null)?event[type][sub]:'';
					} else {
						return event[type];
					}
				}	
			}
			return '';
		},
		divorce:function(id, type, sub){
			var	family = families[id],
				event = (family)?family.divorce:false;
			if(event){
				if(event[type]!=null){
					if(sub){
					 	return (event[type][sub]!=null)?event[type][sub]:'';
					} else {
						return event[type];
					}
				}
			}
			return '';
		},
		birth:function(f){
			var event, date;
			event = user['birth'];
			if(event!=null){
				date = event.date;
				if(f){
					return (date[date_num[f]]!=null)?date[date_num[f]]:'';
				}
				return date;
			}
			return '';
		},
		death:function(f){
			var event, date;
			event = user['death'];
			if(event!=null){
				date = event.date;
				if(f){
					return (date[date_num[f]]!=null)?date[date_num[f]]:'';
				}
				return date;
			}
			return '';
		},
		turns:(function(){
			var	event = user['birth'];
			if(event){
				date = event.date;
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
			var	event, place;
			event = user[type];
			if(event!=null){
				place = event.place;
				if(place!=null){
					return (!sub)?place[0]:((place[0][sub]!=null)?place[0][sub]:'');
				}
			}
			return '';
		}
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
	return {
		insert:function(name){
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
			}
		},
		clear:function(){
			var pull = this;
			for(var key in core.modulesPull){
				if(key!='length'){
					pull.unset(key);
				}
			}
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

core.createLayout = function(type){
	var layout_type = {'single':1,'double':2,'triple':3};
	var td_length = layout_type[type];
	var table = jQuery('<table style="table-layout:fixed;" id="jmb_page_layout_table"  width="100%" height="100%"></table>');
	var tr = jQuery('<tr class="jmb_layout_row"></tr>');
	jQuery(table).append(tr);
	for(var cell=1; cell<=td_length;cell++){
		var td = jQuery('<td class="jmb_layout_cell_single" id="jmb_page_layout_content_'+cell+'" valign="top"></td>');
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

core.initModule = function(object_name, div){
	var self = this;
    	if(typeof window[object_name]=='function'){
    		new window[object_name](div);
    		
    	}
        else {
        	setTimeout(function(){
        		self.initModule(object_name, div);
        	},1000);
        }
}

core.renderPage = function(parent, page){
	storage.family_line.init(page);
	var self = this;
	var grid = page.grid;
	var table = self.createLayout(page.page_info.layout_type);
	var tds = jQuery(table).find('td');
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
			self.initModule(module.object_name, div);
			core.modulesPullObject.insert(module.object_name);
		}
	}	
	jQuery(parent).empty();
	jQuery(parent).append(table);
}
core.renderTabs = function(parent, pages){
	var self = this;
	var ul = jQuery('<ul class="jmbtabs"></ul>'); 
    	var div = jQuery('<div class="tab_container"></div>');
    	
    	jQuery(parent).append(ul);
    	jQuery(parent).append(div);
    	
    	jQuery(pages).each(function(i,page){
    		var div = jQuery('<div id="'+(new Date()).valueOf()+'">'+page.page_info.title+'</div>');
    		var li = jQuery('<li id="'+i+'"><a href="jmbtab_'+i+'" onclick="return false;"></a></li>');
    		jQuery(li).find('a').append(div);
    		jQuery(ul).append(li);
    	});
    	
    	var divs = jQuery('<div id="jmbtab" class="tab_content">&nbsp;</div>');	
    	jQuery(div).append(divs);
    	
    	//When page loads...
	jQuery(".tab_content").hide(); //Hide all content
			
	//On Click Event
	jQuery("ul.jmbtabs li").click(function() {
		if(jQuery(this).hasClass('active')) return false;
		core.modulesPullObject.init(div);
		
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
		
		self.renderPage('#jmbtab', page);
		jQuery(divs).show(); //Hide all tab content
		return false;
	});	
	jQuery("ul.jmbtabs li:first").click(); //click first	
}
core.load = function(pages){
	var self = this;
	//var pages = '1,2,6,8,7,10';
	jQuery(document.body).ready(function(){
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
		
		//init top menu bar
		storage.topmenubar.init();
		jQuery.ajax({
			url:'index.php?option=com_manager&task=getPageInfo&ids='+pages,
			type:'GET',
			complete:function(req, err){
				storage.login.init(function(){
					if(err=='success'){
						var json = jQuery.parseJSON(req.responseText);
						self.path = json.path;
						if(json.pages.length==1){
							self.renderPage('#page', json.pages[0])
						} else {
							self.renderTabs('#container', json.pages);
						}
					}
				});
			}
		});
	});
}

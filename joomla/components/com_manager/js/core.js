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
storage.header = {};
storage.media = {};
storage.invitation = {};
storage.tooltip = {};
storage.profile = {};
storage.family_line = {};

//usertree
storage.usertree = {};
storage.usertree.user = null;
storage.usertree.members = null;
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
			var event = user['birth'];
			if(event!=null){
				var date = event.date;
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
			var event = user['death'];
			if(event!=null){
				var date = event.date;
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
		}
	}
}

storage.notifications = {};
storage.notifications.is_not_confirmed = false;
storage.notifications.is_accepted = false;
storage.notifications.is_denied = false;
storage.notifications.pull = [];
storage.notifications.confirmed = {};
storage.notifications.denied = {};
storage.notifications.not_confirmed = {};
storage.notifications.manager = function(){
	var 	ntf = storage.notifications,
		dialog_box = jQuery('<div class="notifications_manager"></div>'),
		cont = null,
		settings = null,
		create_conteiner = function(){},
		parse = function(){},
		active = function(){},
		user_box = function(){},
		parent_box = function(){},
		place = function(){},
		click_item = function(){},
		menu = function(){};
		
	settings = {
		width:600,
		height:400,
		title: 'Invitations to Join Family Tree',
		resizable: false,
		draggable: false,
		position: "top",
		closeOnEscape: false,
		modal:true,
		close:function(){
			
		}	
	}
	//
	create_conteiner = function(){
		var sb = host.stringBuffer();
		sb._('<table class="container">');
			sb._('<tr>');
				sb._('<td style="width:120px;" valign="top"><div class="menu">');
					sb._('<div id="not_confirmed"><span>Not Confirmed</span></div>');
					//sb._('<div id="confirmed"><span>Waiting for Link</span></div>');
					//sb._('<div id="denied"><span>Denied</span></div>');
				sb._('</div></td>');
				sb._('<td valign="top"><div class="data"></div></td>')
			sb._('</tr>');
		sb._('</table>');	
		return jQuery(sb.result());
	}
	// parse current notification
	parse = function(arg){
		return (arg&&arg.data)?jQuery.parseJSON(arg.data):false;
	}
	//
	active = function(e){
		if(jQuery(e.currentTarget).hasClass('active')) return false;
		var id = jQuery(e.currentTarget).attr('id');
		jQuery(cont).find('div.menu div').removeClass('active');
		jQuery(e.currentTarget).addClass('active');
		menu(id);	
	}
	user_box = function(args, facebook_id, link){
		var sb = host.stringBuffer();
		sb._('<div class="user_box">');
			sb._('<table>');
				sb._('<tr>');
					sb._('<td valign="top">');
						sb._('<div class="avatar"><img src="index.php?option=com_manager&task=getResizeImage&fid=')._(facebook_id)._('&w=72&h=80"></div>');
					sb._('</td>');
					sb._('<td>');
						sb._('<table>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Name:</span></div></td>');
								sb._('<td><div class="text"><span>')._(args.name)._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Know as:</span></div></td>');
								sb._('<td><div class="text"><span>')._(args.nick)._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Born:</span></div></td>');
								sb._('<td><div class="text"><span>')._(place(args))._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td colspan="2"><div class="link"><a href="')._(link)._('">www.facebook.com/')._(args.name)._('</a></div></td>');
							sb._('</tr>');
						sb._('</table>');
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
		sb._('</div>');
		return sb.result();
	}
	parent_box = function(name, args){
		var sb = host.stringBuffer();
		sb._('<div class="parent_box">');
			sb._('<table>');
				sb._('<tr>');
					sb._('<td>')._(name)._(':</td>');
					sb._('<td><div class="text"><span>')._(args.name)._('</span></div></td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td>Born:</td>');
					sb._('<td><div class="text">')._(place(args))._('</div></td>');
				sb._('</tr>');
			sb._('</table>');
		sb._('</div>');
		return sb.result();
	}
	place = function(args){
		var year = (args.b_year!='')?'<span class="year">'+args.b_year+'</span>':'';
		var place = (args.b_place!='')?'in <span class="place">'+args.b_place+'</span>':'';
		return [year,place].join(' ');
	}
	click_item = function(el, pull){
		jQuery(cont).find('div.data div.users').hide();
		jQuery(cont).find('div.menu').parent().hide();
		var id = jQuery(el).attr('id');
		var object = pull[id];
		var sb = host.stringBuffer();
		var json = parse(object);
		var html;
		sb._('<div class="status"><span class="title">Status:</span><span class="value">Action Required</span></div>');
		sb._('<div class="prefix">')._(json.user_info.name)._(' is claiming to be your ')._(json.relation)._(' and would like to join your family tree.')._('</div>');
		sb._('<div class="info">');
			sb._('<table>');
				sb._('<tr>');
					sb._('<td>');
						sb._(user_box(json.user_info, json.me.id, json.me.link));
					sb._('</td>');
					sb._('<td>');
						sb._(parent_box('Father', json.father_info));
						sb._(parent_box('Mother', json.mother_info));
					sb._('</td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td colspan="2">');
						sb._('<div class="message_title">')._(json.user_info.name)._(' writes:</div>');
						sb._('<div class="message_text">')._(json.message)._('</div>');
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
		sb._('</div>');
		sb._('<div class="click_items">');
			sb._('<div id="accept" class="button"><div>Accept</div><div>Add ')._(json.user_info.name)._(' to my Family Tree</div></div>');
			sb._('<div id="deny" class="button"><div>Deny</div><div>Do not add ')._(json.user_info.name)._(' to my Family Tree</div></div>');
		sb._('</div>');
		html = jQuery(sb.result());
		jQuery(html).find('div#accept,div#deny').click(function(){
			var status = jQuery(this).attr('id');
			jQuery.ajax({
				url:'index.php?option=com_manager&task=notifications&type=request&status='+status+'&id='+id,
				type:'GET',
				complete:function(req, err){
					if(!ntf.is_accepted){
						ntf.is_accepted = true;
					}
					delete ntf.not_confirmed[id];
					ntf.confirmed[id] = object;
					jQuery(dialog_box).dialog('close');
				}
			});
		});
		jQuery(cont).find('div.data').append(html);
	}
	//
	menu = function(id){
		var pull = ntf[id], sb = host.stringBuffer(), html;
		sb._('<div class="users">');
			for(var key in pull){
				var json = parse(pull[key]);
				sb._('<div id="')._(key)._('" class="')._(json.me.gender)._('"><span>')._(json.me.name)._('</span>')._((json.user_info.b_year!=''?'('+json.user_info.b_year+')':''))._('</div>');
			}
		sb._('</div>');
		html = jQuery(sb.result());
		jQuery(html).find('div').click(function(){ click_item(this, pull); });
		jQuery(cont).find('div.data').html('').append(html);
	}
	
	// create dialog manager
	jQuery(dialog_box).dialog(settings);
	jQuery(dialog_box).parent().addClass('notifications');
	jQuery(dialog_box).parent().css('top', '20px');
	
	cont = create_conteiner();
	jQuery(dialog_box).append(cont);
	
	jQuery(cont).find('div.menu div').click(active);
	
	
	
	
	
}
storage.notifications.init = function(notifications){
	var	ntf = storage.notifications,
		alias = jQuery(document.body).attr('_alias'),
		type = jQuery(document.body).attr('_type'),
		check = function(){},
		view_alert = function(){};

	ntf.pull = notifications;
	
	// sort notifications
	sort = function(args){
		for(var key in notifications){
			var object = notifications[key];
			if(object&&object.status == 0){
				if(!ntf.is_not_confirmed){
					ntf.is_not_confirmed = true;
				}
				ntf.not_confirmed[object.id] = object;		
			} else if(object&&object.status == 1) {
				if(!ntf.is_accepted){
					ntf.is_accepted = true;
				}
				ntf.confirmed[object.id] = object;	
			} else if(object&&object.status == 2){
				if(!ntf.is_denied){
					ntf.is_denied = true;
				}
				ntf.denied[object.id] = object;	
			}
		}	
	}
	// view alert about not confirmed notification
	view_alert = function(pull){
		var html, sb = host.stringBuffer();
		sb._('<div class="ftt_notifications_alert">');
			sb._('<div class="message"><div>You have Invitation Request</div><div class="button">Click here to view it</div></div>');
		sb._('</div>');
		html = jQuery(sb.result());
		jQuery(html).find('div.button').click(function(){
			ntf.manager();
		});
		jQuery('div.main').append(html);
	}
	
	
	sort(notifications);
	
	if(ntf.is_not_confirmed&&alias=='myfamily'&&type!='famous_family'){
		view_alert(ntf.not_confirmed);
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
	var table = jQuery('<table style="table-layout:fixed;width:760px;" id="jmb_page_layout_table"  width="100%" height="100%"></table>');
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
					script.src = url+'/'+type+'/'+files[i]+'?111';
					script.type="text/javascript";
					head[0].appendChild(script);
				break;
				
				case "css":
					var link = document.createElement("link");
					link.href = url+'/'+type+'/'+files[i]+'?111';
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
		
		var mode = (window != window.top)?'facebook':'standalone';
		var cont = jQuery("div.content");
		if(mode == 'facebook'){
			jQuery(cont).css('max-width', '760px');
			jQuery(cont).find('div.right').remove();
		} else if(mode == 'standalone'){
			jQuery(cont).css('max-width', '920px');
			jQuery(cont).find('div.footer').remove();
		}
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

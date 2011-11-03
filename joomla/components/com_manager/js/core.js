//globl object storage
storage = {};

storage.login = {};
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
//ajax request
storage.request = {};
storage.request.length = 0;
storage.request.add = function(object){
	var r = storage.request;
	r[r.length] = object;
	r.length++;
}
storage.request.cleaner = function(){
	var r = storage.request;
	for(var i=0;i<r.length;i++){
		r[i].abort();
		delete r[i];
	}
	r.length = 0;
}
//header
storage.header = {};
storage.header.activeButton = null;
storage.header.block = false;
storage.createPull(storage.header);
/*
storage.header.famLine = (function(){
	var self = this;
	return {
		click:function(object){
			jQuery(this.buttons).removeClass('active').removeClass('click');
			var id = jQuery(object).attr('id');
			switch(id){
				case 'mother':
				case 'father':
					jQuery(object).addClass('active');
				break;
			
				case 'both':
					jQuery(this.buttons).addClass('active');
				break;
			}
			jQuery(object).addClass('click');
			storage.header.activeButton = object;
		},
		hide:function(){
			jQuery(this.obj).hide();
		},
		show:function(){
			jQuery(this.obj).show();
		},
		mode:function(settings){
			//set function
			var self = this;
			var set_class = function(set, cl){
				if(set[cl]){
					if(set[cl]=='all'){
						jQuery(self.buttons).addClass(cl);
					} else {
						jQuery(set[cl]).each(function(i,e){
							jQuery(self.buttons).parent().find('#'+e).addClass(cl)
						});
					}
				}
			}
			
			//set params
			if(!settings) settings = {};
			var config = jQuery.extend({enabled:'all', active:'all'}, settings);
			
			jQuery(this.buttons).removeClass('enabled').removeClass('active').unbind();

			set_class(config, 'enabled');//set class 'enabled'
			set_class(config, 'active')//set class 'active'
			
			//set click events handlaer	
			jQuery(this.buttons).parent().find('.enabled').click(function(){
				if(jQuery(this).hasClass('click')) return false;
				self.click(this); 
				storage.header.click();
				return false;
			});
			
			if(config.click)jQuery(this.buttons).parent().find('#'+config.click).click();		
			if(config.event) config.event();
		},
		init:function(cont, callback){
			var famLine = this;
			jQuery(document).ready(function(){
				famLine.obj = jQuery(cont);
				famLine.buttons = jQuery(famLine.obj).find('.jmb_header_fam_line_content div');	
				callback.call(famLine);
			});
		}
	}
}).call(storage.header.famLine)
storage.header.famLine.init('.jmb_header_fam_line_container', function(){
	this.mode('both');
});
*/

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
	storage.clearPull(storage.header);
	//storage.request.cleaner();
}

storage.topMenuBar = {};
storage.topMenuBar.init = function(){
	var top_menu_bar = jQuery('.jmb-top-menu-bar');
	if(jQuery(top_menu_bar).length==0) return false;
	jQuery(top_menu_bar).find('.jmb-top-menu-bar-item').click(function(){
		var id = jQuery(this).attr('id');
		jQuery.ajax({
			url: 'index.php?option=com_manager&task=setLocation&alias='+id,
			type: "POST",
			dataType: "json",
			complete : function (req, err) {
				window.location.reload();
			}
		});
	});
}

storage.deleteButton = {};
storage.deleteButton.init = function(container){
	var fid = jQuery('body').attr('fid');
	if(fid!='100000657385590'||fid!='100001614066938') return false;
	jQuery('.tab_container').append(container);
	var d_button = jQuery(container).find('div#delete');
	var d_object = new JMBDelete(d_button);
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
//iframe check
storage.inIframe = function(){
	var in_iframe = (window!=window.top);
	var url = (in_iframe)?'http://apps.facebook.com/fmybranches/':'http://www.familytreetop.com/';
	var base_url = jQuery('body').attr('_baseurl');
	var a_href = (in_iframe)?base_url:'http://apps.facebook.com/fmybranches/';
	var img_name = (in_iframe)?'to_facebook.gif':'to_fmb.gif';
	var content_width = (in_iframe)?760:980;
	var main_td_width = (in_iframe)?760:820;
	jQuery('div#_content').css('max-width',content_width+'px');
	jQuery('td#_main').css('width', main_td_width+'px');
	var a = jQuery('<a href="'+a_href+'" target="_top"><img src="'+base_url+'templates/fmb/images/'+img_name+'?111" width="32px" height="32px"></a>')
	jQuery('div.jmb_header_expand').append(a);
	if(in_iframe){
		jQuery('td#_right').hide();
		jQuery('div.jmb-top-menu-bar').hide();
	} else {
		jQuery('div#_bottom').hide();
	}
}


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
		on:function(){
			//jQuery(document.body).append(modal_div);
			modal_active = true;
		},
		off:function(){
			//jQuery(modal_div).remove();
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
				pull.unset(key);
			}
			modal.off();
		},
		init:function(){
			var pull = this;
			pull.clear();
			modal.on();
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
    		var li = jQuery('<li id="'+i+'"><a href="jmbtab_'+i+'"></a></li>');
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
		core.modulesPullObject.init();

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
		storage.login = new JMBLogin(jQuery('#jmb_header_profile_box'));
		storage.language = new JMBLanguage();
		storage.topMenuBar.init();
		storage.inIframe();
		jQuery.ajax({
			url:'index.php?option=com_manager&task=getPageInfo&ids='+pages,
			type:'GET',
			complete:function(req, err){
				if(err=='success'){
					var json = jQuery.parseJSON(req.responseText);
					self.path = json.path;
					if(json.pages.length==1){
						self.renderPage('#page', json.pages[0])
					} else {
						self.renderTabs('#container', json.pages);
					}
				}
			}
		});
	});
}
/*
core.load = function(pages){
	var self = this;
	jQuery(document).ready(function() {
	    host = new Host();
	    storage.login = new JMBLogin('jmb_header_profile_box');
	    storage.topMenuBar.init();
	    storage.inIframe();
	    var manager = new MyBranchesManager();
	    jQuery.ajax({
		url: 'index.php?option=com_manager&task=getXML&f=pages&pages='+pages,
		type: "GET",
		dataType: "xml",
		complete : function (req, err) {
		    var layout_type, title, id;
		    var elems = req.responseXML;
		    if(elems.childNodes[0].nodeName=='xml')
			elems = elems.childNodes[1];
		    else
			elems = elems.childNodes[0];
		    if(elems.childNodes.length){
			title = elems.childNodes[0].attributes[1].value;
			id = elems.childNodes[0].attributes[0].value;
			layout_type = elems.childNodes[0].attributes[2].value;
			self.loadPage('#page', id, layout_type, function(){})
		    }
		}
	
	    });
	});		
}


core.loadPage = function(div, id, layout, callback){
    var manager = new MyBranchesManager();
    var path = manager.getLayoutUrl(layout);
    jQuery.ajax({
        url: path,
        type: "GET",
        //dataType: "html",
        complete : function (req, err) {
            jQuery(div).html(req.responseText);
            jQuery.ajax({
                url: 'index.php?option=com_manager&task=loadPage&page_id='+id,
                type: "GET",
                dataType: "html",
                complete : function (req, err) {
                    var string = jQuery.trim(req.responseText);
                    if(string != ""){
                       	var obj = jQuery.parseJSON(string)
                        var manager = new MyBranchesManager();
                        manager.renderPage(div, obj);
                        callback();
                    }
                }
            });
        }
    });
}

core.loadTabs = function(pages){
    var self = this; 
    jQuery(document).ready(function() {
    	var manager, parent, ul, div;
    	host = new Host(); 
    	manager = new MyBranchesManager(); 
    	storage.topMenuBar.init();
    	storage.inIframe();
    	ul = jQuery('<ul class="jmbtabs"></ul>'); 
    	div = jQuery('<div class="tab_container"></div>');
    	parent = jQuery('#container');
    	jQuery(parent).append(ul);
    	jQuery(parent).append(div);
    	jQuery.ajax({
    		url: 'index.php?option=com_manager&task=getXML&f=pages&pages='+pages,
    		type: "GET",
    		dataType: "xml",
    		complete : function (req, err) {
    			var elems = req.responseXML;
    			if(elems.childNodes[0].nodeName=='xml')
    				elems = elems.childNodes[1];
    			else
    				elems = elems.childNodes[0];
    			var count = 1;
    			for(var i=0; i < elems.childNodes.length; i++){
    				var e, id, title, title_id, layout_type, li, divs;
    				e = elems.childNodes[i];
    				id = jQuery(e).attr('id');
    				title_id = (new Date).valueOf();
    				title = jQuery('<div id="'+title_id+'">'+jQuery(e).attr('title')+'</div>');
    				layout_type = jQuery(e).attr('layout_type');

    				li = jQuery('<li id="'+id+'" layout="'+layout_type+'"><a href="jmbtab'+count+'"></a></li>');
    				jQuery(li).find('a').append(title);
    				jQuery(ul).append(li);
    				count++;
    			}
    			 
			var fid = jQuery('body').attr('fid');
			if(fid=='100001614066938'||fid=='100000634347185'||fid=='1202995371'||fid=='100000657385590'){
				var title, li;
				title = jQuery('<div id="'+((new Date).valueOf())+'">Parser</div>');
				li = jQuery('<li id="7" layout="'+layout_type+'"><a href="jmbtab'+count+'"></a></li>');
				jQuery(li).find('a').append(title);
				jQuery(ul).append(li);
			}    			
    			
    			var divs = jQuery('<div id="jmbtab" class="tab_content">&nbsp;</div>');	
    			jQuery(div).append(divs);
    			
    			var buttons = jQuery('<div class="buttons"><div id="delete"><span> - Delete Tree</span></div></div>');
        			
    			//When page loads...
			jQuery(".tab_content").hide(); //Hide all content
			//jQuery("ul.jmbtabs li:first").addClass("active").show(); //Activate first tab
			
			//On Click Event
			jQuery("ul.jmbtabs li").click(function() {
				if(jQuery(this).hasClass('active')) return false;
				self.modal(true);
				jQuery("ul.jmbtabs li").removeClass("active"); //Remove any "active" class
				jQuery(this).addClass("active"); //Add "active" class to selected tab
				jQuery(".tab_content").hide(); //Hide all tab content
		
				//var activeTab = '#'+jQuery(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
				var id = jQuery(this).attr('id');
				var layout = jQuery(this).attr('layout');
				jQuery(divs).fadeOut(1000, function(){
					self.loadPage(divs, id, layout, function(){
						jQuery(divs).fadeIn(); //Fade in the active ID content
						self.modal(false);
					});
				});
				storage.tabs.activeTab = this;
				storage.tabs.click(this);	
				return false;
			});	
			
			jQuery("ul.jmbtabs li:first").click(); //click first
			storage.deleteButton.init(buttons);
			storage.login = new JMBLogin('jmb_header_profile_box');
			new JMBLanguage();
    		}
    	});
    });
}
*/


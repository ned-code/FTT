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


//tabs
storage.tabs = {};
storage.tabs.activeTab = null;
//storage.createPull(storage.tabs);
storage.tabs.clickPull = {};
storage.tabs.clickPull.length = 0;
storage.tabs.click = function(){ 
	for(var i=0;i<storage.tabs.clickPull.length;i++){
		storage.tabs.clickPull[i].click();
	}
	storage.tabs.cleaner();
}	
storage.tabs.cleaner = function(){
	storage.clearPull(storage.tabs);
	storage.clearPull(storage.header);
	storage.request.cleaner();
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
core.modalWindow = jQuery('<div class="jmb-core-overlay">&nbsp;</div>')

core.loadPage = function(div, id, layout, callback){
    var manager = new MyBranchesManager();
    var path = manager.getLayoutUrl(layout);
    jQuery.ajax({
        url: path,
        type: "GET",
        dataType: "html",
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

core.modal = function(arg){
	var div = jQuery('div.tab_container');
	var overlay = this.modalWindow;
	jQuery(overlay).css('width',jQuery(div).width()+'px').css('height',jQuery(div).height()+'px');
	return (arg)?jQuery(div).append(overlay):jQuery(overlay).remove();
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


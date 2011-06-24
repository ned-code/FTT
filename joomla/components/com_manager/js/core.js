storage = {};
storage.url = "components/com_manager/";
storage.session = id;
storage.fb = {};
storage.fb.appId = "184962764872486";
storage.fb.status = true;
storage.fb.cookie = true;
storage.fb.xfbml = true;

var date = new Date();
var id =  Math.floor(date.getTime() /1000);
var core = {};
storage.core = core;

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
                       //var obj = eval( '(' + string + ')' );
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
	    var manager = new MyBranchesManager();
	    jQuery.ajax({
		//url: (manager.getPageListUrl()+'&pages='+pages),
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

core.loadTabs = function(pages){
    var self = this; 
    jQuery(document).ready(function() {
    	var manager, parent, ul, div;
    	host = new Host(); 
    	manager = new MyBranchesManager(); 
    	ul = jQuery('<ul class="jmbtabs"></ul>'); 
    	div = jQuery('<div class="tab_container"></div>');
    	parent = jQuery('#container');
    	jQuery(parent).append(ul);
    	jQuery(parent).append(div);
    	jQuery.ajax({
    		//url: (manager.getPageListUrl()+'&pages='+pages),
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
    			
    			divs = jQuery('<div id="jmbtab" class="tab_content">&nbsp;</div>');	
    			jQuery(div).append(divs);
    			
    			//When page loads...
			jQuery(".tab_content").hide(); //Hide all content
			jQuery("ul.jmbtabs li:first").addClass("active").show(); //Activate first tab
			
			//On Click Event
			jQuery("ul.jmbtabs li").click(function() {
				jQuery("ul.jmbtabs li").removeClass("active"); //Remove any "active" class
				jQuery(this).addClass("active"); //Add "active" class to selected tab
				jQuery(".tab_content").hide(); //Hide all tab content
		
				//var activeTab = '#'+jQuery(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
				var id = jQuery(this).attr('id');
				var layout = jQuery(this).attr('layout');
				jQuery(divs).fadeOut(1000, function(){
					self.loadPage(divs, id, layout, function(){
						jQuery(divs).fadeIn(); //Fade in the active ID content
					});
				});
				return false;
			});	
			
			jQuery("ul.jmbtabs li:first").click(); //click first
    		}
    	});
    });
}

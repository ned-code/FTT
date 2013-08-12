
function setWordSearch(w)
{
	//document.getElementById('key_search').value = w
	btnSearch_click();
}

var Search = {
	forum_id 		: 0,
	tab 			: null ,
	falcon 			: null,
	tSearch			: null,
	iTop			: 0,
	searchHeight	: 0,
	iIdeaCount		: 0,
	isDisplayFalcon	: false,
	bSearch			: null,
	
	init: function()
	{
		forum_id 	= getForumId();
		//this.tab = 0;		
		this.tab 			= document.getElementById('idea_result');
		this.tSearch		= document.getElementById('key_search'); // text box search
		this.falcon 		= document.getElementById('falcon_container');
		
		this.bSearch			= document.getElementById('button_search');
		//alert($$('#button_search'))
		
		this.displayFalcon(false)	
		document.addEvent('mouseup',
			function(evt)
			{			
				
				var pos = Search.getPosition(document.getElementById('falcon_container'))				
				var id = (evt.target || evt.srcElement).id
				if(id == 'key_search')
					return;
				// if mouse click out of 'falcon' or click on an item, we need close it
				if(Search.isDisplayFalcon)
				{
					if(
						curPos[0]<pos[0] || 
						curPos[1]<pos[1] || 
						curPos[0]>(pos[2]) || 
						curPos[1]>(pos[3]) ||
						(evt.target || evt.srcElement).hasClass('idea-title')
					)
						Search.displayFalcon(false)
				}
			}
		)
		
		//$$('#falcon_container').setStyle('width',parseInt(this.tSearch.getStyle("width"))+6+'px')
		$$('#falcon_container').setStyle('width',parseInt(document.getElementById('key_search').offsetWidth)-2+'px')
		$$('#button_search')
			.setStyle("height",parseInt(document.getElementById('key_search').offsetHeight)+'px')	
			.addEvent('click',
				function(){btnSearch_click()}
			)
		
		$$('#key_search')
			.setProperty("autocomplete","off")
			.addEvent("keyup",
				function(evt){
					if(evt.keyCode == 13)	
					{
						//Search.displayFalcon(false)
						//btnSearch_click()
						return;
					}
					Search.startSearch()
				}
			)	
	},
	displayFalcon_: function(d)
	{
		var timer = null;
		var inc = 20;
		var height = parseInt(this.falcon.getStyle("height"))
		if(!d)
		{
			if(height>0)
				height = (height-inc>=0) ? height-inc : height
				
			if(height == 0)
				this.falcon.setStyle("display", "none")
			else
				this.falcon.setStyle("height", height+"px")		
		}
		else
		{
			this.falcon.setStyle("display", "block")
					
			if(height<220)			
				height = (height+inc<=220) ? height+inc:height					
			this.falcon.setStyle("height", height+"px")										
		}
		if(height==0||height==220)
		{
			clearTimeout(timer)
			if(d)
			{
				$ES("div", 'falcon_container').each(
					function(el)
					{
						el.setStyle("display", "block")
					}
				)
			}
			return;
		}
		var timer = setTimeout('Search.displayFalcon_('+d+')',1)		
		
	},
	displayFalcon: function(display)
	{
		if(!display)
		{
			$ES("div", 'falcon_container').each(
				function(el)
				{
					el.setStyle("display", "none")
				}
			)
		}
		
		Search.displayFalcon_(display)
		Search.isDisplayFalcon = display
	},
	startSearch: function(keyword)
	{
		var key = null;
		if(typeof(keyword) != 'undefined')
			key = keyword;
		else
			key = this.tSearch.value;	
		key = key.trim()
		if(key.length<2) // we should search if length of keysearch larger than 2 chars
		{
			this.tab.innerHTML = '<div style="text-align:center;margin:60px auto;">Key length must be lager than 2 character</div>';
			return;
		}
		else
			if(this.tab.innerHTML!='<div class="ajax-loading" style="margin:60px auto;"></div>')
				this.tab.innerHTML = '<div class="ajax-loading" style="margin:60px auto;"></div>';
		var url = "index.php?option=com_obsuggest&controller=idea&task=falconSearch&forum="+forum_id+"&key="+key+"&format=raw";	
		//alert(url)
		var req = new Ajax(url,{
			method: 'post',
			onComplete: function(txt){							
				
				Search.tab.innerHTML = txt;
				//alert(Search.tab.innerHTML)
				if(!Search.isDisplayFalcon)
					Search.displayFalcon(true)
				//tab.scrollTo(0,0)
				Search.iIdeaCount = ($ES('#idea_result div.idea-title').length)
				Search.iTop=0;
				Search.setupControl();
				if(Search.iIdeaCount == 0)
				{					
					Search.tab.innerHTML = '<div class="idea-notfound">No idea found!<div>';					
				}								
			}
		}).request();		
	},
	scroll: function(inc, amount, start, dir)
	{
		//alert('hahaha')
		var timer = null;
		inc+=2;
		if(inc>amount)
			inc=amount
		if(dir==0)
			this.tab.scrollTo(0, start+inc)	
		else
			this.tab.scrollTo(0, start-inc)	
		if(inc==amount)
		{
			Search.setupControl();
			clearTimeout(timer)
			return
		}
		timer = setTimeout('Search.scroll('+inc+','+amount+','+start+','+dir+')',20)
	},
	up: function()
	{
		if(!Search.canScroll('up'))
			return;
		var start = $ES('#idea_result div.idea-title')[Search.iTop].offsetTop;
		Search.iTop++;
		var end = $ES('#idea_result div.idea-title')[Search.iTop].offsetTop;
		//Search.iTop++;
		var amount = end-start
		
		var inc = 0;
		//var timer = setTimeout(function(){inc++; alert(inc);if(inc==2) {clearTimeout(timer);alert('hahaha')}},1000);//tab.scrollTo(0, $ES('#idea_result div.idea-title')[Search.iTop].offsetTop)	
		Search.scroll(inc, amount, start, 0);
		
	},
	canScroll: function(type) 
	{
		var size = Search.tab.getSize()
		if(Search.iIdeaCount == 0)
			return false;
		return type=='up' ? (size['scrollSize']['y']-size['scroll']['y']>=130)||(Search.iIdeaCount>10 && Search.iTop==0) : Search.iTop>0
	},
	down: function()
	{
		if(!Search.canScroll('down'))
			return;
			
		var start = $ES('#idea_result div.idea-title')[Search.iTop].offsetTop;
		Search.iTop--;
		var end = $ES('#idea_result div.idea-title')[Search.iTop].offsetTop;
		//Search.iTop++;
		var amount = Math.abs(end-start)
		
		var inc = 0;	
		Search.scroll(inc, amount, start, 1);
		//Search.iTop--;
		//tab.scrollTo(0, $ES('#idea_result div.idea-title')[Search.iTop].offsetTop)	
		//Search.setupControl();
	},
	setupControl: function()
	{
		if(!Search.canScroll('down'))	
			$ES('#search_control a')[0].className = 'down_disabled';	
		else
			$ES('#search_control a')[0].className = 'down';	
		if(!Search.canScroll('up'))	
			$ES('#search_control a')[1].className = 'up_disabled';
		else	
			$ES('#search_control a')[1].className = 'up';
	},
	getPosition: function(obj) 
	{
		var curleft = curtop = 0;
		if (obj.offsetParent) 
		{
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
	
	
		}
		// return array [left, top, right, bottom] of an object
		return [curleft, curtop, curleft + parseInt(this.falcon.getStyle("width")), curtop+parseInt(this.falcon.getStyle("height"))];
	}
}

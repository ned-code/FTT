<?php
/**
 * @version		$Id: default_page_layout.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div>
<div class="spin" id="spin_page_list" style="width:750px;border:0px solid #999999;overflow:hidden;">
	<div class="spin-control">
		<input type="button" value="<" class="previous">
		<div class="spin-title">------</div>
		<input type="button" value=">" class="next">
	</div>
    <div class="spin-contents">
        <div class="content">
        	<div style="" id="default_layout">
            <?php 
            	$layouts = Themes::getLayouts("default", "default");
				foreach($layouts as $layout){
			?>
            	<div class="default_layout_<?php echo $layout?>"></div>
            <?php 
				}
			?>
                            
            </div>
            <div style="padding:3px;">
           	<input type="button" value="Save" onclick="saveLayout('default', 'default');" />
            </div>
        </div>
        <div class="content">
        	<div style="" id="comment_layout">
			<?php 
            $layouts = Themes::getLayouts("default", "comment");
				foreach($layouts as $layout){
			?>
            	<div class="comment_layout_<?php echo $layout?>"></div>
            <?php 
				}
			?>         
            </div>  
            <div style="padding:3px;">
           	<input type="button" value="Save" onclick="saveLayout('default', 'comment');" />
            </div>
        </div>
        <div class="content">
        	<div style="" id="activity_layout">
            <?php 
            $layouts = Themes::getLayouts("default", "activity");
			//print_r($layouts);	
				foreach($layouts as $layout){
			?>
            	<div class="activity_layout_<?php echo $layout?>"></div>
            <?php 
				}
			?>         
            </div>  
            <div style="padding:3px;">
           	<input type="button" value="Save" onclick="saveLayout('default', 'activity');" />
            </div>
        </div>
    </div>
</div>

<div style="clear:both;"></div>
</div>
<script>

function saveLayout(theme, name){
	var str_layouts = "";	
//	var layouts = $ES("#" + name + "_layout div");
	var layouts = $$("#" + name + "_layout div");
	for(var i=0; i<layouts.length; i++){
		var className = layouts[i].className.replace("selected", "")
		str_layouts+=className.substr(className.lastIndexOf("_")+1)+":"
	}		
	var url = "index.php?option=com_obsuggest&controller=themes&task=saveLayout&format=raw&theme="+theme+"&name="+name+"&layouts="+str_layouts;	
	var req = new Ajax(url,{
		method: 'get',
		onComplete: function(){
			alert(name+" layout has been save!");
		}
	}).request();
}
var Spin = new Class({
	panel: null,
	spin_previous: null,
	spin_next: null,
	items: 0,
	current_item: 0,
	titles: ["Default layout","Comment layout","Activity layout"],
	initialize: function(id){
		var p = this;
		this.panel = $(id);//document.getElementById(id)
		this.spin_previous = this.panel.getElementsByClassName("previous")[0];
		this.spin_previous.addEvent("click",
			function(evt){
				if(p.current_item <= 0) 
					p.selectItem(p.items-1)
				else
					p.selectItem(p.current_item-1)
			}
		)		
		this.spin_next = this.panel.getElementsByClassName("next")[0];
		this.spin_next.addEvent("click",
			function(evt){			
				if(p.current_item >= p.items-1)
					p.selectItem(0)
				else
					p.selectItem(p.current_item+1)
			}
		)
		this.items = this.titles.length;//$ES("div.spin div.spin-contents div.title").length
		if(this.items>0){
			this.selectItem(0)
		}
	},
	selectItem: function(index){
		if(this.current_item!=-1) {
			var last_item = this.getItemAt(this.current_item)
			with(last_item){
				setStyle("border-color", "#cccccc");
				setStyle("display", "none")
			}
		}	
		this.setTitle(this.titles[index])
		var current_item = this.getItemAt(index)
		with(current_item){
			setStyle("border-color", "#ff0000");
			setStyle("display", "block")
		}	
		this.current_item = index
	},
	abc:function(){
		if(this.current_item!=-1) {
			var last_item = this.getItemAt(this.current_item)
			with(last_item){
				setStyle("border-color", "#cccccc");
				setStyle("display", "none")
			}
		}	
		this.setTitle(this.titles[index])

		var current_item = this.getItemAt(index)
		with(current_item){
			setStyle("border-color", "#ff0000");
			setStyle("display", "block")
		}	
		this.current_item = index
	},
	moveRight: function(){
		if(this.current_item==-1) return
		var item = this.getItemAt(this.current_item)
		var left = parseInt(item.getStyle("left"))
		item.setStyle("left",(left-100)+"px")
		var p=this;
		var timer = setTimeout(function(){p.moveRight()},100)
		item.setHTML(left)
		if(left<-500){
			clearTimeout(timer)
			this.abc()
		}	
	},
	setTitle: function(title){
//		$$("div.spin-control div.spin-title").getLast().setHTML(title);
		$$("div.spin-control div.spin-title").getLast().innerHTML = title;
	},
	getAllItems: function(){
//		return $ES("div.spin div.spin-contents div.content");
		return $$("div.spin div.spin-contents div.content");
	},
	getItemAt: function(index){
		return this.getAllItems()[index]
	},
	prepareMove: function(leftOrRight){
		var next_index = -1;
		var next_item = null
		if(this.items == 1) return;
		if(!$defined(leftOrRight)) leftOrRight = true;
		if(leftOrRight){
			if(this.current_item == this.items-1)
				next_index = 0;
			else
				next_index = this.current_item + 1
			next_item = this.getItemAt(next_index)	
			if(this.current_item==(this.items-1) && this.current_item>-1) next_item.injectAfter(this.getItemAt(this.items-1))
			with(next_item){
				setStyle("display", "block");
			}
		}
	}
})

var spin = null;
</script>
<script type="text/javascript" language="javascript">

Array.extend({
	makeSortable: function(options){
		var Sortable = new Sortables(this, options);
		this.each(function(el){
			el.style.cursor = 'move';
			el.extend(Sortable);
		})
	}
});
//spin = new Spin("spin_page_list");
var current_block = null;
window.addEvent("domready", function() {
	//alert(spin);
//	var list = ($ES('#default_layout div'))
	var list = ($$('#default_layout div'));
	var Sortable = new Sortables('default_layout');
	spin = new Spin("spin_page_list");
	
	list.each(function(el){
		el.style.cursor = 'move';
		el.title = "Click and Drag to move this block up or down";			
		el.addEvent("mousedown",
			function(){
				if(current_block) current_block.removeClass("selected")
				this.addClass("selected")
				current_block = this;
			}
		);
	});
	
//	list = ($ES('#comment_layout div'));
	list = ($$('#comment_layout div'));
	new Sortables('comment_layout');
	list.each(function(el){
		el.style.cursor = 'move';
		el.title = "Click and Drag to move this block up or down";
		el.addEvent("mousedown",
			function(){
				if(current_block) current_block.removeClass("selected")
				this.addClass("selected")
				current_block = this;
			}
		);
	});
	
//	list = ($ES('#activity_layout div'));
	list = ($$('#activity_layout div'));
	new Sortables('activity_layout');
	list.each(function(el){
		el.style.cursor = 'move';
		el.title = "Click and Drag to move this block up or down";
		el.addEvent("mousedown",
			function(){
				if(current_block) current_block.removeClass("selected")
				this.addClass("selected")
				current_block = this;
			}
		)
		
	})
});

</script>


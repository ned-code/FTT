function DescendantTree(obj, priviewObject){
	var self = this;
	var dhxLayout;//, dhxTree;
	
	// set css style
	jQuery(obj).css('height', '500px');
	jQuery(obj).css('width', '100%');
	jQuery(obj).css('position', 'relative');
	
	// set main dhxmlx Layout
	dhxLayout = new dhtmlXLayoutObject("descendant_tree", "2U");
	dhxLayout.cells("a").hideHeader();
	dhxLayout.cells("b").hideHeader();
	dhxLayout.cells("a").setWidth(420);
	dhxLayout.cells("a").fixSize(true);
	
	// set layout in left side[layout.cells('a')]
	dhxTree = dhxLayout.cells("a").attachTree();
        
	dhxTree.setIconSize("16","16")
	dhxTree.setSkin('dhx_skyblue');
	dhxTree.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
        
        host.callMethod('descendant_tree', '', 'getTree', '', function(req){
           
            dhxTree.loadXMLString(req.responseText);
            
        });
        dhxLayout.cells("b").attachObject(document.getElementById('persons_info'));
        
	//dhxTree.loadXML("components/com_manager/modules/descendant_tree/php/tree.php");
	dhxTree.attachEvent("onXLE", function(tree,id){
		var items = this.getSubItems(0).split(",");
                
                for (var key in this._idpull) {
                   if(key.substr(0,1)=='F') 
                   this._idpull[key].htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].style.width = '35px';
                }
                if(items.length > 0)
                    //selecting person on node 1
                    self.click(0, jQuery('div[name=descendant-node]').first());
                
                jQuery('div[name=descendant-node]').each(function(index, element){
			self.each(index, element);
		});

                var list = tree.getAllSubItems(tree.getItemIdByIndex(0,0));
                list = list.split(',');
                for(var i=0; i<list.length; i++){
                    if((0+tree.getLevel(list[i])<3))
                        tree.openItem(list[i]);
                }

	});
        var profile = new Profile('persons_info');
        jQuery('#profile_edit_dialog').bind( "dialogclose", function(event, ui) {
            DescendantTree.prototype.get();
        });

	this.dhxTree = dhxTree;
	this.selectDiv = null;


	return this;
}

DescendantTree.prototype = {

	/**
	* select div and view user info.
	*/
	click:function(id, e){
		var self = this;
		
		if(this.selectDiv) jQuery(this.selectDiv).css('background', 'none');
		jQuery(e).css('background', 'yellow');
		this.selectDiv = e;
	
                profile_object.personId=jQuery(e).attr('indkey');
                profile_object.personFam=jQuery(e).attr('famkey');
                profile_object.refresh();
		
	},
	each:function(i,e){
		var self = this;
		jQuery(e).click(function(){
			self.click(i, e);
		});
	},
        insertTextField:function(table, title, value){
            var row = table.insertRow(-1);
            var cell = row.insertCell(0);
            var text = document.createTextNode(title);
            cell.appendChild(text);

            cell = row.insertCell(1);
            text = document.createTextNode(value);
            cell.appendChild(text);
        },

        get:function(){
            dhxTree.deleteChildItems('0');
            dhxTree.deleteItem('0');
            host.callMethod('descendant_tree', '', 'getTree', '', function(req){

                dhxTree.loadXMLString(req.responseText);

            });
        }
       
}

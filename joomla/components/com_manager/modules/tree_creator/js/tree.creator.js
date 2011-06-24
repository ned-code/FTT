function JMBTreeCreator(obj){
	var self = this;
	
	html = "<div>";
		html += "<div class='jmb-tree-creator-header'>Welcome to Family Tree Top</div>";
		html += "<div class='jmb-tree-creator-fieldset'><fieldset><legend>What is Family TreeTop?</legend></fieldset></div>";
		html += "<div class='jmb-tree-creator-button'>Create your own Family Tree</div>";
		html += "<div class='jmb-tree-creator-buttons'>";
			html += "<span>Help and FAQs</span>";
			html += "<span>Contact Us</span>";
		html += "</div>";
	html += "</div>";
	jQuery(obj).html(html);
	jQuery(obj).find(".jmb-tree-creator-button").click(function(){
		self.createOwnFamilyTree();
	})
}

JMBTreeCreator.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("tree_creator", "TreeCreator", func, params, function(req){
				callback(req);
		})
	},
	createOwnFamilyTree:function(){
		location.href = "index.php?option=com_manager&view=single&id=5&jmb_type=register";
	}
}





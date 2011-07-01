function FamousFamilyTrees(obj){
	obj = jQuery('#'+obj);
	html = "<div>";
		html += "<div class='jmb-famous-family-tree-header'>Famous Family Trees</div>";
		html += "<div class='jmb-famous-family-tree-body'>";
			html += "<div>Prince Charles</div>";
			html += "<div>Elvis Presley</div>";
			html += "<div>Mahatma Gandi</div>";
			html += "<div>Martin Sheen</div>";
			html += "<div>Oprah Winfrey</div>";
			html += "<div>Jakson Family</div>";
		html += "</div>";
	html += "</div>"
	jQuery(obj).html(html);
}

FamousFamilyTrees.FamousFamilyTrees = {

}




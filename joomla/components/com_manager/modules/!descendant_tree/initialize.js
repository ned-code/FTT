var descendant = document.getElementById('descendant_tree');
if(descendant){
	/*
	// vars
	var dhxLayoutParent, dhxLayout
	// get global object from storage
	dhxLayoutParent = storage.obj.dhxLayoutParent;
	dhxLayout = storage.obj.dhxLayout;
	//detach old object and attach new
	dhxLayoutParent.cells('a').detachObject();
	dhxLayoutParent.cells('a').attachObject(descendant);

	// create descendant tree
	var descendantTree = new DescendantTree(descendant, dhxLayout);
	*/
	
	var descendantTree = new DescendantTree(descendant);
}
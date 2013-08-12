CKEDITOR.plugins.add('jhtmlencode',   
{    

     beforeInit:  function(editor)
	 {
		var element = editor.element;
		
		if(element.is('textarea'))
		{			  
			var data = element.getText();
			
			var div = new CKEDITOR.dom.element( 'div' );
			div.setHtml( data );
			data = div.getHtml();
			data = CKEDITOR.tools.htmlEncode(data);
			element.setHtml(data);
			
			delete div;
		}
	 },
	 	 
	 init:function(editor) 
	 {
		//Nothing to do	 
	 }
	  
});
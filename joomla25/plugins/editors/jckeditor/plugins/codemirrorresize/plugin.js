CKEDITOR.plugins.add('codemirrorresize',   
{    

	init:function(editor) 
	{
       // Do Nothing
	},
	  
	afterInit: function (editor) 
	{
	
		var hasDragHandler = false;
		
		function dragHandler( evt )
		{
			if(editor.mode != 'wysiwyg' && editor.plugins.codemirror)
			{
			  var codemirrorEditor = editor.textarea.getNext();
			  if(CKEDITOR.env.ie)
				editor.textarea.hide();
			  codemirrorEditor.hide();
			}
		
		}
		
		function dragEndHandler(evt)
		{
			if(editor.mode != 'wysiwyg' && editor.plugins.codemirror)
			{	
				var codemirrorEditor = editor.textarea.getNext();
				codemirrorEditor.show();
				CKEDITOR.document.removeListener( 'mousemove', dragHandler );
				CKEDITOR.document.removeListener( 'mouseup', dragEndHandler );
				}

		}
		
				
		editor.on('mode', function(evt)
		{
			var editor = evt.editor;
			if(editor.plugins.resize)
			{
				var resizer = editor.getThemeSpace('bottom').getLast();
				resizer.on('mousedown', function()
				{
					if( editor.mode != 'wysiwyg' && editor.plugins.codemirror)
					{
						CKEDITOR.document.on('mousemove', dragHandler); 
						CKEDITOR.document.on('mouseup', dragEndHandler);
					}
				});
			}	
		});	
		editor.on( 'resize', function(evt)
		{
			
			var editor = evt.editor;
			
			if(editor.mode != 'wysiwyg' && editor.plugins.codemirror)
			{
				var resizable = editor.getResizable();
				var width = resizable.getStyle('width');
				var codemirrorEditor = editor.textarea.getNext();
				var contents = CKEDITOR.document.getById( 'cke_contents_' + editor.name )
				var height = contents.getStyle('height');
				codemirrorEditor.setStyle('height',height);
				codemirrorEditor.setStyle('width',width);
			}
		});
	}

});
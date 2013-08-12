CKEDITOR.plugins.add('ietoolbarcollasperfix',   
{    

    
	init:function(editor) 
	{
       // Do Nothing
	},
	  
	afterInit: function (editor) 
	{
    
		editor.on( 'themeSpace', function( event )
		{
			if ( event.data.space == editor.config.toolbarLocation )
			{
				
				var collapserId = 'cke_' + (CKEDITOR.tools.getNextNumber()-1);
			
				editor.addCommand( 'toolbarCollapse',
				{
					exec : function( editor )
					{
						
										
						var collapser = CKEDITOR.document.getById( collapserId ),
							toolbox = collapser.getPrevious(),
							contents = editor.getThemeSpace( 'contents' ),
							toolboxContainer = toolbox.getParent(),
							contentHeight = parseInt( contents.$.style.height, 10 ),
							previousHeight = toolboxContainer.$.offsetHeight,
							collapsed = !toolbox.isVisible();
			
						if ( !collapsed )
						{
							toolbox.hide();
							collapser.addClass( 'cke_toolbox_collapser_min' );
							collapser.setAttribute( 'title', editor.lang.toolbarExpand );
						}
						else
						{
							toolbox.show();
							collapser.removeClass( 'cke_toolbox_collapser_min' );
							collapser.setAttribute( 'title', editor.lang.toolbarCollapse );
						}
		
						// Update collapser symbol.
						collapser.getFirst().setText( collapsed ?
							'\u25B2' :		// BLACK UP-POINTING TRIANGLE
							'\u25C0' );		// BLACK LEFT-POINTING TRIANGLE
		
						var dy = toolboxContainer.$.offsetHeight - previousHeight;
						contents.setStyle( 'height', ( contentHeight - dy ) + 'px' );
		
						editor.fire( 'resize' );
						
						if(editor.plugins.codemirror && CKEDITOR.env.ie)
						{
							
							editor.textarea.hide();
							var holderElement = editor.textarea.getParent();
                            var holderHeight = contents.getStyle('height');
							var codemirrorEditor = editor.textarea.getNext();
							codemirrorEditor.setStyle('height',holderHeight);
						}
					},
		
					modes : { wysiwyg : 1, source : 1 }
				} );
			}
		});
	}

});
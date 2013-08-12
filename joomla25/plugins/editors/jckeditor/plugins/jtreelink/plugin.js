(function ()
{
	
	var pluginName = 'jtreelink';
	
	CKEDITOR.plugins.add( pluginName,
	{
		
		requires : [ 'link' ],
		lang : ['en','fi','de','fr','es','it','ru','nl'],
		
		
		beforeInit : function ( editor)
		{
			var head = CKEDITOR.document.getHead();
			head.append(
					CKEDITOR.document.createElement( 'link',
						{
							attributes :
								{
									type : 'text/css',
									rel : 'stylesheet',	
									href : editor.config.baseHref + 'media/system/css/mootree.css'
								}
						})
				);
			
			head.append(
					CKEDITOR.document.createElement( 'script',
						{
							attributes :
								{
									type : 'text/javascript',
									src : editor.config.baseHref + 'media/system/js/mootree.js'
								}
						})
			 );
		},		
		init : function( editor )
		{
			// Add the relatedcontent button.
			editor.addCommand( pluginName, new CKEDITOR.dialogCommand( pluginName ) );
			editor.ui.addButton( 'JTreeLink',
				{
					label : editor.lang.jtreelink.toolbar,
					command : pluginName,
					icon : this.path + 'images/' + pluginName + '.png'
				} );
		
	
			CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/' + pluginName + '.js' );
	
			
			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems )
			{
				editor.addMenuItems(
					{
						jtreelink :
						{
							label : editor.lang.jtreelink.menu,
							command : pluginName,
							icon: this.path + 'images/' + pluginName + '.png',
							group : 'link'
						}
					});
			}
			
			editor.on( 'doubleclick', function( evt )
			{
				var element = CKEDITOR.plugins.link.getSelectedLink( editor ) || evt.data.element;

				if ( !element.isReadOnly() )
				{
					if ( element.is( 'a' ) && element.getAttribute( 'href' ) && element.getAttribute( 'href' ).substring(0,5) == 'index'  )
						evt.data.dialog =  'jtreelink';
			
				}
			});
			
			
			if ( editor.contextMenu )
			{
				editor.contextMenu.addListener( function( element, selection )
					{
						
						if ( !element || element.isReadOnly() )
							return null;
							
						var isAnchor = ( element.is( 'img' ) && element.getAttribute( '_cke_real_element_type' ) == 'anchor' )
						if(isAnchor)
							return null;
	
						if ( !( element = CKEDITOR.plugins.link.getSelectedLink( editor ) ) )
							return null;
							
						isJoomlaLink = ( element.getAttribute( 'href' ) && element.getAttribute( 'href' ).substring(0,5) == 'index' );
						
						return !isJoomlaLink ? null :
								{ jtreelink : CKEDITOR.TRISTATE_OFF};
					});
			}		
			
		}
		  
	} );

CKEDITOR.tools.extend( CKEDITOR.config,
{
	jtreelinkShowAdvancedTab : true,
	jtreelinkShowTargetTab : true
} );
})();
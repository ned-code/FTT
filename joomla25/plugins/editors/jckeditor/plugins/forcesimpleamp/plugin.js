CKEDITOR.plugins.add('forcesimpleamp',   
{    

     init:function(editor) 
	 {
		//Nothing to do	 
	 },
	  
	afterInit: function (editor) 
	{
            
			var dataProcessor = editor.dataProcessor,
                 htmlFilter = dataProcessor && dataProcessor.htmlFilter;
          
            if (htmlFilter)
			{
                htmlFilter.addRules(
				{
                    
										
					elements: 
					{
                        a : function (element) 
						{
							if(element.attributes._cke_saved_href)
							{
								var href = element.attributes._cke_saved_href;
								if(editor.config.forcesimpleAmpersand  && href.test(/&amp;/)) 
								{
									href = href.replace( /&amp;/g, '&' );
									element.attributes._cke_saved_href = href;
								}
							}
		
							return element
                        }
                    },
										
					text : function( content)
					{
						if(editor.config.forcesimpleAmpersand  && content.test(/&amp;/))
							content = content.replace( /&amp;/g, '&' );
						return content;		
					}
					
			    });
            }
			
        }

});
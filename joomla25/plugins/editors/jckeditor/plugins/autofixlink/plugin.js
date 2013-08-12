CKEDITOR.plugins.add('autofixlink',   
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
							
	                       	if (element.attributes._cke_saved_href ) 
							{
								var href = element.attributes._cke_saved_href;
								if(href.indexOf('www.') != -1 && !href.match(/^http/))
								{
									element.attributes._cke_saved_href = 'http://' + href;
								}
							}
							
							return element
                        }
                    }
			    });
            }
			
        }

});
CKEDITOR.plugins.add('ieelementpathfix',   
{    

     init:function(editor) 
	 {
		//Nothing to do	 
	 },
	  
	afterInit: function (editor) 
	{
            
			var dataProcessor = editor.dataProcessor,
                 htmlFilter = dataProcessor && dataProcessor.htmlFilter;
				
			var dataFilter = dataProcessor && dataProcessor.dataFilter;
          
            if (htmlFilter)
			{
                htmlFilter.addRules(
				{
                    
										
					elements: 
					{
                        img : function (element) 
						{
							var baseHref = editor.config.client ? editor.config.baseHref +'administrator/' :  editor.config.baseHref;
						
							baseHref = baseHref.replace(/\s+/g,'%20').replace(/~/,'%7E');	
											
							if(CKEDITOR.env.ie)
							{
								if(element.attributes.src)
								{
									
									if(element.attributes.src.indexOf(baseHref) != -1 && element.attributes.src.indexOf('//') != -1 )
									{
										var path = element.attributes.src.replace(baseHref,'');
										element.attributes.src = path;
									}	
								}
								
								if(element.attributes._cke_saved_src)
								{
									if(element.attributes._cke_saved_src.indexOf(baseHref) != -1 && element.attributes._cke_saved_src.indexOf('//') != -1 )
									{
										var path = element.attributes._cke_saved_src.replace(baseHref,'');
										element.attributes._cke_saved_src = path;
									}
								}
												
							}
							return element;
                        },
						 a : function (element) 
						{
								
								var baseHref = editor.config.client ? editor.config.baseHref +'administrator/' :  editor.config.baseHref;
								
								baseHref = baseHref.replace(/\s+/g,'%20').replace(/~/,'%7E');		
								
								if(CKEDITOR.env.ie)
								{
									
									if(element.attributes.href)
									{
										
										element.attributes.href.replace('%7','~')
										if(element.attributes.href.indexOf(baseHref) != -1 && element.attributes.href.indexOf('//') != -1 )
										{
											var path = element.attributes.href.replace(baseHref,'');
											element.attributes.href = path;
										}
									}
									
									
									if(element.attributes._cke_saved_href)
									{
										if(element.attributes._cke_saved_href.indexOf(baseHref) != -1 && element.attributes._cke_saved_href.indexOf('//') != -1 )
										{
											var path = element.attributes._cke_saved_href.replace(baseHref,'');
											element.attributes._cke_saved_href = path;
										}
									}
								}
							return element;	
						}
					 }
           		});
			}
			
			if (dataFilter)
			{
                dataFilter.addRules(
				{
                    
										
					elements: 
					{
                        img : function (element) 
						{
							var baseHref = editor.config.baseHref +'administrator/';
						
							baseHref = baseHref.replace(/\s+/g,'%20').replace(/~/,'%7E');	
							
							if(CKEDITOR.env.ie)
							{
								if(element.attributes.src)
								{
									
									if(element.attributes.src.indexOf(baseHref) != -1 && element.attributes.src.indexOf('//') != -1 )
									{
										var path = element.attributes.src.replace(baseHref,'');
										element.attributes.src = path;
									}	
								}
								
								if(element.attributes._cke_saved_src)
								{
									
									var baseHref = editor.config.baseHref +'administrator/';
									
									baseHref = baseHref.replace(/\s+/g,'%20').replace(/~/,'%7E');	
									
									if(element.attributes._cke_saved_src.indexOf(baseHref) != -1 && element.attributes._cke_saved_src.indexOf('//') != -1 )
									{
										var path = element.attributes._cke_saved_src.replace(baseHref,'');
										element.attributes._cke_saved_src = path;
									}
								}
												
							}
							return element;
                        },
						 a : function (element) 
						{
								
								var baseHref = editor.config.baseHref +'administrator/';
								
								baseHref = baseHref.replace(/\s+/g,'%20').replace(/~/,'%7E');		
								
								if(CKEDITOR.env.ie8 || CKEDITOR.env.ie7Compat)
								{
									
									if(element.attributes.href)
									{
										if(element.attributes.href.indexOf(baseHref) != -1 && element.attributes.href.indexOf('//') != -1 )
										{
											var path = element.attributes.href.replace(baseHref,'');
											element.attributes.href = path;
										}
									}
												
									
									if(element.attributes._cke_saved_href)
									{
										if(element.attributes._cke_saved_href.indexOf(baseHref) != -1 && element.attributes._cke_saved_href.indexOf('//') != -1 )
										{
											var path = element.attributes._cke_saved_href.replace(baseHref,'');
											element.attributes._cke_saved_href = path;
										}
									}
								}
							return element;	
							
						}
					 }
           		});
			}
			
			
      }
});
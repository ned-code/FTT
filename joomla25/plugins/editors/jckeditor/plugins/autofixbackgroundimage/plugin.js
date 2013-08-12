(function() 
{
	CKEDITOR.plugins.add('autofixbackgroundimage',   
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
							table : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							
							tr : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							
							td : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							div : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							span : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							li : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							ul : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							},
							a : function (element) 
							{
								
								if (element.attributes.style) 
								{
									var style = element.attributes.style;
									style = fixBackgroundImage(style);								
									element.attributes.style = style;
								}
								
								return element;
							}
													
							
						}
					});
				}
				
			}
	
	});
		
	function fixBackgroundImage(style)
	{
		if(style.indexOf('url(&quot;') != -1)
		{
			style = style.replace(/url\(&quot;(.*)&quot;\)/,"url($1)");
		}
	
      return style;
	}

})();
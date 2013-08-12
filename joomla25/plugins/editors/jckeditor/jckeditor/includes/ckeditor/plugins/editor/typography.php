<?php


defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgEditorTypography extends JPlugin 
{
		
  	function plgEditorTypography(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function beforeLoad(&$params)
	{
		
		//lets create JS object
		$javascript = new JCKJavascript();
				
		$css = $params->get('jcktypography',false);
			
		if(!$css)
			return;
				
		$stylesheet =  str_replace("administrator","",JURI::base()) . "plugins/editors/jckeditor/typography/typography.php";
		$javascript->addScriptDeclaration(
			"editor.on( 'configLoaded', function()
			{
				if(editor.config.contentsCss instanceof Array)
					editor.config.contentsCss.unshift('".$stylesheet."');
				else	
				editor.config.contentsCss = ['".$stylesheet."',editor.config.contentsCss];
			});"	
		);
		return $javascript->toRaw();
		
	}

}
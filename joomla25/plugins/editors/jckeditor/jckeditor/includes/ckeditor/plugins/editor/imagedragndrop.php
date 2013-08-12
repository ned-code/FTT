<?php


defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgEditorImageDragNDrop extends JPlugin 
{
		
  	function plgEditorImageDragNDrop(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function beforeLoad(&$params)
	{
		//lets create JS object
		$javascript = new JCKJavascript();
		
		$EnableImageDragndrop = $params->get('EnableImageDragndrop',1);
		
		$javascript->addScriptDeclaration(
			"editor.on( 'configLoaded', function()
			{
				editor.config.EnableImageDragndrop = ". (int) $EnableImageDragndrop.";
			});"	
		);
		
		return $javascript->toRaw();
		
	}

}
<?php


defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgEditorUIColor extends JPlugin 
{
		
  	function plgEditorUIColor(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function beforeLoad(&$params)
	{
		//lets create JS object
		$javascript = new JCKJavascript();
		
		$defaultColor = $params->get('uicolor','#D6E6F4');
		
		$user = JFactory::getUser();
		
		$color = $user->getParam('jckuicolor',$defaultColor);
			
		if($color == $defaultColor) //already set so just exit
			return;
		
		$javascript->addScriptDeclaration(
			"editor.on( 'configLoaded', function()
			{
				editor.config.uiColor = '".$color."';
			});"	
		);
		
		return $javascript->toRaw();
		
	}

}
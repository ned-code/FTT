<?php


defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgEditorDefaultFont extends JPlugin 
{
		
  	function plgEditorDefaultFont(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function beforeLoad(&$params)
	{
		
		//lets create JS object
		$javascript = new JCKJavascript();
				
		$ftfamily = $params->get('ftfamily','');
		$ftsize = $params->get('ftsize','');
	
		if($ftsize)
			$ftsize .= ( strpos($ftsize ,'px') ? '' : 'px');
		
		$script = '';
		
		$script .=  ( $ftfamily ? "editor.addCss( 'body { font-family: ". $ftfamily."; }' );" : "");
		$script .=  ( $ftsize ? "editor.addCss( 'body { font-size: ". $ftsize."; }' );" : "");
	
		$javascript->addScriptDeclaration($script);
		return $javascript->toRaw();
		
	}

}
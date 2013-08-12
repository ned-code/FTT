<?php


defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgStylesheetJCKtypography extends JPlugin 
{
		
  	function plgStylesheetJCKtypography(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function load(&$params)
	{
		
		//lets create JS object
		$javascript = new JCKJavascript();
				
		$css = $params->get('jcktypography',false);
		$cssContent = $params->get('jcktypographycontent','');
	
		if(!$css)
			return false;

		return htmlspecialchars_decode($cssContent, ENT_COMPAT);
		
	}

}
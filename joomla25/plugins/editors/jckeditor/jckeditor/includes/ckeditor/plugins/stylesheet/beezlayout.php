<?php

defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgStylesheetBeezLayout extends JPlugin 
{
		
  	function plgStylesheetBeezPersonal(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function load(&$params)
	{
		
		$template = $params->get('default_beez_template',false);
				
		if(!$template)
			return false;
		
		$stylesheet = JPATH_SITE.'/templates/'. $template.'/css/layout.css';
        if(!file_exists($stylesheet))
            return false;  
		$cssContent = file_get_contents($stylesheet);
		return htmlspecialchars_decode($cssContent, ENT_COMPAT);
			
	}

}
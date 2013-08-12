<?php


defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.event.plugin');
jckimport('ckeditor.htmlwriter.javascript');


class plgEditorDefaultBeezTypography extends JPlugin 
{
		
  	function plgEditorDefaultBeezTypography(& $subject, $config) 
	{
		parent::__construct($subject, $config);
	}

	function beforeLoad(&$params)
	{
		//lets create JS object
		
		$version = new JVersion();
		
		if( !version_compare( $version->getShortVersion(), '1.6', 'gt' ) )
		 	return false;
		
		$javascript = new JCKJavascript();
				
		$db = JFactory::getDBO();
		
		$query	= $db->getQuery(true);

		$query->select('template');
		$query->from('#__template_styles');
		$query->where('client_id=0 AND home=1');

		$db->setQuery( $query );
		$template = $db->loadResult();
		
		$base  = str_replace("administrator","",JURI::base()).'templates/'.$template .'/css/';
		
		$templates =  array(
			//$base.'position.css',
			$base.'layout.css',
			$base.'personal.css'							
		);	
	
		$javascript->addScriptDeclaration(
			"editor.on( 'configLoaded', function()
			{
				if(editor.config.contentsCss instanceof Array)
					editor.config.contentsCss.push('".implode("','",$templates)."');
				else
					editor.config.contentsCss = [editor.config.contentsCss,'".implode("','",$templates)."'];
			});"	
		);
		return $javascript->toRaw();
		
	}

}
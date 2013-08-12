<?php
/**
 * @version		$Id: themes.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
define('FOLDER_THEMES', 'themes');
define('PATH_THEMES', str_replace(DS."administrator","",JPATH_COMPONENT.DS.'themes'));
define('URL_THEMES', str_replace('/administrator','',JURI::base())."/components/".$option.'/themes');

class Themes{
	function __construct(){
	
	}
	function getLayouts($theme = 'default',$name = 'default'){
		
		$path = PATH_THEMES.DS.$theme.DS.$name."_layout.php";		
		return parse_ini_file($path);
	}
	function setTheme()
	{
		$document = & JFactory::getDocument();
	
		$info = $this->getThemesActive();
		$paths = $this->themeToPath($info);
		
		if(count($paths))
		{
			foreach ($paths as $path)
			{
				if($path['ext']=='js')
					$document->addScript($path['name']);
				elseif($path['ext']=='css')	
				{
					$document->addStyleSheet($path['name']);
				}
			}
		}
		$document->addStyleSheet(URL_THEMES."/".$info['theme_name']."/".'schema_'.$info['schema_name']."/".$info['schema_name'].".css");
	}
	public function getListThemes()
	{
		$path_themes = str_replace(DS."administrator","",JPATH_COMPONENT.DS.'themes'.DS);
		$themes = JFolder::folders($path_themes);
		$ret	= null;
		foreach ($themes as $theme)
		{
			if($theme=='default')
			{
				$ret[] = array('name'=>$theme, 'url'=>URL_THEMES, 'dir'=>PATH_THEMES);
				break;
			}
		}
		foreach ($themes as $theme)
		{
			if($theme!='theme_default')
				$ret[] = array('name'=>$theme, 'url'=>URL_THEMES, 'dir'=>PATH_THEMES);
		}
		return $ret;
	}
	public function getListSchemas($theme_name)
	{
		
		$themes = $this->getListThemes();
	
		$ret = null;
		foreach ($themes as $theme)
		{
			if($theme['name'] == $theme_name)
			{
				$files = JFolder::folders($theme['dir'] .DS. $theme_name);
				//echo "[".$theme['dir'] .DS. $theme_name."]";
				
				if(count($files)>0)
				{
					foreach ($files as $file)
					{
						if(strpos($file, 'schema_')===false)
							continue;
						if($file=='schema_default')
						{
							$ret[] = array(	'name'=>str_replace('schema_','',$file), 
											'url'=>$theme['url']."/".$theme_name,
											'dir'=>$theme['dir'].'/'.$theme_name
										  );
							break;										  
						}
					}
					foreach ($files as $file)
					{
						if(strpos($file, 'schema_')===false)
							continue;
						if($file!='schema_default')
						{
							$ret[] = array(	'name'=>str_replace('schema_','',$file), 
											'url'=>$theme['url']."/".$theme_name,
											'dir'=>$theme['dir'].'/'.$theme_name
										  );
						}
					}
				}
				break;
			}
		}
		return $ret;
	}
	function getThemesActive()
	{
		$path_inf = str_replace(DS."administrator","",JPATH_COMPONENT.DS.'themes'.DS.'config.inf');
		
		return parse_ini_file($path_inf);
		
	}
	function themeToPath($info, $type = 'all')
	{
		$path_theme = PATH_THEMES.DS.$info['theme_name'];
		$path_schema = $path_theme .DS. 'schema_'.$info['schema_name'];
		$url_theme = URL_THEMES."/".$info['theme_name']."/";
		$url_schema = $url_theme."/".'schema_'.$info['schema_name']."/";
		
		$files = JFolder::files($path_theme);
		$ret = array();
		$ext = '';
		if(is_array($type))
		{
			foreach ($files as $file)
			{		
				$ext = JFile::getExt($file);	
				if(in_array($ext,$type)	)	
				{
					$ret[] = array('name'=>$url_theme.$file, 'ext'=>$ext);
				}
			}
		}
		else 
		{			
			foreach ($files as $file)
			{
				$ext = JFile::getExt($file);	
				if($type=='all' || $type==$ext)		
				{
					$ret[] = array('name'=>$url_theme.$file, 'ext'=>$ext);
				}
			}
		}
		return $ret;
	}
	function getHTML($theme, $schema)
	{
		$path = PATH_THEMES.DS.$theme.DS.'html.php';
		$content = '';
		ob_start();
		include_once($path);
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}
	function saveSchema($theme, $schema, $pros)
	{
		$path = PATH_THEMES.DS.$theme.DS.'schema_'.$schema.DS.$schema.'.css';
		
		$search = "[php],[/php],[n],[t],\\";
		$search = explode(",", $search);
		
		$replace = "<?,?>,\n,\t,";
		$replace = explode(",", $replace);
		
		$pros = str_replace($search, $replace, $pros);
		
		$pros = "/* schema $schema */\n" . $pros;
		JFile::write($path, $pros);

	}
	function loadSchema($theme, $schema)
	{
		$path = PATH_THEMES.DS.$theme.DS.'schema_'.$schema.DS.$schema.'.css';
		if(!JFile::exists($path))
			return ;
			
		//echo $path;
		$content = JFile::read($path);
		$content = explode("\n", $content);
		$ret = null;
		if(count($content))
		{
			$ret = array();
			foreach ($content as $pro)
			{
				$pro_ = explode('=', $pro);
				//$ret[trim($pro_[0])] = trim($pro_[1]);
			}
		}
		return $ret;
	}
	function saveTheme($theme, $theme_content, $theme_preview){
		$path = PATH_THEMES.DS.$theme.DS.'default_box.php';
		$search = "[php],[/php],[n],[t],\\";
		$search = explode(",", $search);
		
		$replace = "<?,?>,\n,\t,";
		$replace = explode(",", $replace);
		
		$theme_content = str_replace($search, $replace, $theme_content);
		
		JFile::write($path, $theme_content);
		
		$search = "[n],[t],\\";
		$search = explode(",", $search);
		
		$replace = "\n,\t,";
		$replace = explode(",", $replace);
		
		$theme_preview = str_replace($search, $replace, $theme_preview);
		$path = PATH_THEMES.DS.$theme.DS.'preview.xml';
		JFile::write($path, $theme_preview);
		
		if($theme!='default'){
			// copy all file is used for all themes
			JFolder::copy(PATH_THEMES.DS.'default'.DS.'images',PATH_THEMES.DS.$theme.DS.'images');
			JFile::copy(PATH_THEMES.DS.'default'.DS.'style.css', PATH_THEMES.DS.$theme.DS.'style.css');
		}
	}
	function loadPreviewTheme($theme = 'default'){
		$path = PATH_THEMES.DS.$theme.DS.'preview.xml';
		global $obIsJ15;
		if (!$obIsJ15) {
			$xml = JFactory::getXMLParser('Simple');
		} else {
			$xml = new JSimpleXML;
		}
 		$xml->loadFile($path);
 		
 		$document =& $xml->document;
	 	if ($document == NULL) {	 		
	 		return null;
	 	}
	 	
	 	$children = $document->children();	
	 	
	 	$lines = $document->getElementByPath('lines');
	 	
	 	// list of tables
	 	$list_lines = & $lines->line;
	 	$scrtip = '
	 		window.addEvent("domready",
	 			function(){
	 				theme
	 	';		
	 	for ($i = 0, $c = count($list_lines); $i < $c; $i ++ ) {	
	 		$line = ($list_lines[$i]);
	 			
			$boxes = $line->getElementByPath("boxes");

			$boxes = & $boxes->box;
			
			$scrtip.='.addNewLine()';
			
			//print_r($boxes);
			for($j=0, $cj = count($boxes); $j < $cj ; $j++)
	 		{
	 			$float = $boxes[$j]->getElementByPath("float");	 			
	 			//print_r($float->data());
	 			$type = $boxes[$j]->getElementByPath("type");	
	 			//print_r($type->data());
	 			$custom = '';
	 			if($type->data()=='NONE')
	 			{
	 				$custom = $boxes[$j]->getElementByPath("custom");
	 				
	 				$custom = $custom ? $custom->data() : "";
	 				
	 				$search = '[php],[/php],\,"';
					$search = explode(",", $search);
					
					$replace = '<?,?>,\\,\"';
					$replace = explode(",", $replace);
					
					$custom = str_replace($search, $replace, $custom);
					
	 				
	 				$scrtip.='.addNewBox(null,{float:"'.$float->data().'",type:"'.$type->data().'",custom:"'.$custom.'"})';
	 			}else{
	 				$scrtip.='.addNewBox(null,{float:"'.$float->data().'",type:"'.$type->data().'"})';
	 			}
	 		}
	 	}
	 	$scrtip.='
	 			}
	 		)	 	
	 	';
	 	return $scrtip;
	}
	function savePartSchema($theme, $schema, $part, $pros){
		$path = PATH_THEMES.DS.$theme.DS.'schema_'.$schema.DS.$schema.'.part.'.$part.'.prt';
		
		$search = "[php],[/php],[n],[t],\\";
		$search = explode(",", $search);
		
		$replace = "<?,?>,\n,\t,";
		$replace = explode(",", $replace);
		
		$pros = str_replace($search, $replace, $pros);
		
		//$pros = "/* schema $schema */\n" . $pros;
		JFile::write($path, $pros);
	}
	function saveSchemaFromParts($theme = 'default', $schema = 'default', $parts = 0){
		if($parts == 0) return ;
		$content = "/* schema $schema */\n";
		$content .= "/* warning : this file was created by theme generator, don't repair it if you are not sure */\n";
		$content .= "/* created : " . date("h:i:s d-m-Y") . " */\n";
		for( $i=1 ; $i <= $parts ; $i++ ){
			$path = PATH_THEMES.DS.$theme.DS.'schema_'.$schema.DS.$schema.'.part.'.$i.'.prt';
			
			if(!JFile::exists($path)) continue;
			
			$content .= JFile::read($path);		

			JFile::delete($path);		
		}
		$path = PATH_THEMES.DS.$theme.DS.'schema_'.$schema.DS.$schema.'.css';
		JFile::write($path, $content);
	}
	function saveLayout($theme = 'default', $name='default', $layouts){
		$path = PATH_THEMES.DS.$theme.DS.$name."_layout.php";
		$layouts = explode(":", $layouts);
		$i = 0;
		$out = "";
		foreach($layouts as $layout){
			if($layout=="") continue;
			$i++;
			$out .= $i . "\t= " . $layout."\n";
		}
		JFile::write($path, $out);
	}
}
?>

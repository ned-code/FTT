<?php

defined('JPATH_PLATFORM') or die;

class JCKConfigHandlerFilebrowsers 
{

	function getOptions($key,$value,$default,$node,$params,$pluginName)
	{
		$options = '';  
        $manifest = '';

        if($value == 'jfilebrowser')
            $manifest = JFactory::getXML(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_jckman'.DS.'editor'.DS.'plugins'.DS.'jfilebrowser.xml');
        else
			 $manifest = JFactory::getXML(JPATH_PLUGINS.DS.'editors'.DS.'jckeditor'.DS.'plugins'.DS.$value.DS.$value.'.xml');

		
        
        $browseUrl = '';
		$imageBrowseUrl = '';
		$flashBrowseUrl = '';
			
		if(isset($manifest->browseUrl));
           $browseUrl = (string) $manifest->browseUrl;
           
   
		
		if(isset($manifest->imageBrowseUrl))	
		  $imageBrowseUrl =  $manifest->imageBrowseUrl; 	
		
		if(isset($manifest->flashBrowseUrl))	
		  $flashBrowseUrl =  $manifest->flashBrowseUrl; 

		
		if(!$browseUrl && $value == 'jckexplorer')
		{
			 $browseUrl = 'index.php?editor=ckeditor';
			 $imageBrowseUrl = 'index.php?editor=ckeditor&filter=image';
			 $flashBrowseUrl = 'index.php?editor=ckeditor&filter=flash';
		}
		
		if(!$browseUrl)
			return false;
		
		$pluginName = ucfirst($pluginName);
           
		if($pluginName == 'Image' && $imageBrowseUrl)
			$options .= "\"filebrowserImageBrowseUrl='".JURI::root()."plugins/editors/jckeditor/plugins/".$value."/".$imageBrowseUrl."'\",";  
		elseif($pluginName == 'Flash' && $flashBrowseUrl)
			$options .= "\"filebrowserFlashBrowseUrl='".JURI::root()."plugins/editors/jckeditor/plugins/".$value."/".$flashBrowseUrl."'\",";  
		else		
			$options .= "\"filebrowser".$pluginName."BrowseUrl='".JURI::root()."plugins/editors/jckeditor/plugins/".$value."/".$browseUrl."'\",";  
		
		return $options;
	}
}




















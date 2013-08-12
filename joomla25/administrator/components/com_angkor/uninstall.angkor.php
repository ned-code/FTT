<?php
function com_uninstall()
{
	$value = false;
	Jimport('joomla.filesystem.folder');
	Jimport('joomla.filesystem.file');
	$hack_path = JPATH_SITE.DS.'administrator'.DS.'components'.DS.'com_angkor'.DS.'patched_files';
	$backup_path = JPATH_SITE.DS.'images'.DS.'angkor_backup';
	
	if(!JFolder::exists($backup_path))
		JFolder::create($backup_path);
		
	$app = JFactory::getApplication();
	
	$hacked_files = JFolder::files($hack_path,'.',true,true);
	$backup_files = array();
	$copy_to_files = array();
	foreach($hacked_files as $hacked_file)
	{
		$backup_files[] = str_replace($hack_path,$backup_path,$hacked_file);
		$copy_to_files[] = str_replace(DS.'administrator'.DS.'components'.DS.'com_angkor'.DS.'patched_files','',$hacked_file);
	}
	
	$msg ='';
	
	$value= true;	
	foreach($backup_files as $key=>$backup_file)
	{
		$folder_name = dirname($backup_file);

		if(isset($copy_to_files[$key])) //Restore file
		{
			$from = $backup_file;
			$to = $copy_to_files[$key];				
			
			if(JFile::copy($from,$to)) // Restore file
			{
				$msg .= str_replace(JPATH_SITE.DS,'',"file <b>'{$to}'</b> restored <span style=\"color:green\">successfully</span>.<br />");
				JFile::delete($from); // remove backup file
			}
			else
			{
				$msg .= str_replace(JPATH_SITE.DS,'',"Restore file  <span style=\"color:red\">failed</span><br /> Please manually restore file from '{$from}' to '{$to}'<br /> ");						
				$value= false;					
			}
		}
	}	
	echo $msg;		
	return $value;
}
?>
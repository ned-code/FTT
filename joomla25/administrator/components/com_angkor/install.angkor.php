<?php
function com_install()
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
		$copy_to_files[] = str_replace(DS . 'administrator'.DS.'components'.DS.'com_angkor'.DS.'patched_files','',$hacked_file);
	}
	//echo '<pre>';print_r($hacked_files);echo '</pre>';	
	//echo '<br /><br /><pre>';print_r($backup_files);echo '</pre>';	
	//echo '<br /><br /><pre>';print_r($copy_to_files);echo '</pre>';
	$all_folders_writable = false;
	
	$folder_msg = array();
	if(!$app->getCfg('ftp_enable'))
	{
		$all_folders_writable = true;
		//------------ Check folder to copy to
			foreach($copy_to_files as $file)
			{
				$folder_name = dirname($file);
				if(!is_writable($folder_name))
				{
					$all_folders_writable = false;
					$folder_msg[$folder_name]=false;
				}				
			}
		//------------ Check backup folder
			if(JFolder::exists($backup_path))
			{
				if(!is_writable($backup_path))
				{
					$all_folders_writable = false;
					$folder_msg[$backup_path]=false;
				}
			}	
			
			foreach($backup_files as $backup_file)
			{
				$folder_name = dirname($backup_file);
				if(JFolder::exists($folder_name))
				{
					if(!is_writable($folder_name))
					{
						$all_folders_writable = false;
						$folder_msg[$folder_name]=false;
					}
				}				
			}			
	}
	$msg ='';
	if($app->getCfg('ftp_enable') OR $all_folders_writable == true)
	{
		foreach($backup_files as $key=>$backup_file)
		{
			$folder_name = dirname($backup_file);
			if(!JFolder::exists($folder_name))
				JFolder::create($folder_name);		

			if(isset($copy_to_files[$key])) //Backup file
			{
				$backup = false;
				$from = $copy_to_files[$key];
				$to = $backup_file;
				if(file_exists($to))
					$backup = true;
				else
					$backup = JFile::copy($from,$to);
				if($backup) // Backup success
				{
					// Replace current file with hacked file
					$from = $hacked_files[$key];
					$to = $copy_to_files[$key];
					if(JFile::exists($to))
					{
						JFile::delete($to);
						if(!JFile::copy($from,$to))// Copy hacked file to right place
							$msg .= str_replace(JPATH_SITE.DS,'',"Update file  <span style=\"color:red\">failed</span> : Please manually copy file from '{$from}' to '{$to}'<br />");
						else
							$msg .= str_replace(JPATH_SITE.DS,'',"file <b>'{$to}'</b> updated <span style=\"color:green\">successfully</span>.<br />");
					}
				}
				else
				{
					$msg .= str_replace(JPATH_SITE.DS,'',"Backup file  <span style=\"color:red\">failed</span><br /> Please manually backup file from '{$from}' to '{$to}'<br /> ");
					
					$from = $hacked_files[$key];
					$to = $copy_to_files[$key];
					$msg .= str_replace(JPATH_SITE.DS,''," AND manually copy file from '{$from}' to '{$to}'<br /><br />");
					
				}
			}
		}	
		echo $msg;
		$value= true;	
	}
	else
	{
		$db=JFactory::getDBO();
		$query="Delete 
				From `#__extensions` 
				Where `name`='com_angkor'";
		$db->Execute($query);
		
		$query="Delete 
				From `#__assets` 
				Where `name`='com_angkor'";
		$db->Execute($query);
		
		$query="Delete 
				From `#__menu` 
				Where `link` LIKE '%com_angkor%'";
		$db->Execute($query);
		
					
		$msg = 'This Component can only be installed if the ftp layer is enabled<br>';
		$msg .= "OR<br> The following folders need to be writable for the Angkor Email Editor to be installed<br>";
		foreach($folder_msg as $folder_name=>$writable)
		{
			$msg .= '&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;' . str_replace(JPATH_SITE.DS,'',$folder_name) . '<br />';	
		}
		$value= false;	
		$installer =& JInstaller::getInstance();
		$installer->abort($msg . '<br />');
		//array_pop($installer->_stepStack);
	}
	return $value;
}		
?>
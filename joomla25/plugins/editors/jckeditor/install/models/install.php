<?php

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport('joomla.application.component.model');

/**
 * Install Model
 *
 * @package    JCK Editor
 * @subpackage JCK.install Wizard
 */
class InstallModelInstall extends JModel
{
	
	private $_permission;
	
	private $_folderPermission;
	
	private $_files;
	
	private $_folders;
	
	private $_imageFolders;
	
	
	public function getPermission()
	{
		return $this->_permission;
	}
	
	public function getFolderPermission()
	{
		return $this->_folderPermission;
	}
	
	public function __construct($config = array())
	{
		
		
		$path = JPATH_PLUGINS.DS.'editors'.DS.'jckeditor';
		
		$files = JFolder::files($path, $filter = '\.php$', true, true);
	
		$permisson  = fileperms(JPATH_CONFIGURATION.DS.'index.php');
		$permisson = (decoct($permisson & 0777));	
		
		$folderPermisson  = fileperms(JPATH_CONFIGURATION.DS.'components');
		$folderPermisson = (decoct($folderPermisson & 0777));
		
		$files = JFolder::files($path, $filter = '\.php$', true, true,array('.svn', 'CVS','.DS_Store','__MACOSX','install'));	
		$folders = JFolder::folders($path, $filter = '.', true, true,array('.svn', 'CVS','.DS_Store','__MACOSX','install'));
		
		$path = JPATH_CONFIGURATION.DS.'images';
		
		$imageFolders = JFolder::folders($path, $filter = '.', true, true);
		array_unshift( $imageFolders, $path );	
		
		
		$this->_permission = $permisson;
		$this->_folderPermission = $folderPermisson;
		$this->_files = $files;
		$this->_folders = $folders;
		$this->_imageFolders = $imageFolders;				
		
		parent::__construct($config);
	}
	
	public function getNonExecutableFilesTotal()
	{
	    $count = 0;

		foreach($this->_files as $file)
		{
			
			$fpermisson  = fileperms($file);
			$fpermisson = (decoct($fpermisson & 0777));
			
			if(!is_executable($file) && $fpermisson < $this->_permission)
				$count++;
		}
	   return $count;
	
	}
	
	public function getIncorrectChmodFilesTotal()
	{
	    $count = 0;
		
		foreach($this->_files as $file)
		{
			
			$fpermisson  = fileperms($file);
			$fpermisson = (decoct($fpermisson & 0777));
			if($fpermisson != $this->_permission )
				$count++;
		}
	   return $count;
	} 
	   
	public function getIncorrectChmodFoldersTotal()
	{
	    $count = 0;
		
		foreach($this->_folders as $folder)
		{
			
			$fpermisson  = fileperms($folder);
			$fpermisson = (decoct($fpermisson & 0777));
			
			if($fpermisson != $this->_folderPermission )
				$count++;
		}
	   return $count;  

	}
	
	public function getNonWritableImageFolderTotal()
	{
	    $count = 0;

		foreach($this->_imageFolders as $folder)
		{
			
			if(!is_writable($folder))
				$count++;
		}
	   return $count;
	}
	
	
	
	public function changeExecutablePermission()     
	{
		foreach($this->_files as $file)
		{
			if (!@ chmod($file, octdec((string)$this->_permission)))
				return false;
		}
	
		return true;	
	}	
		
	public function changeFilesPermission()
	{
		foreach($this->_files as $file)
		{
			if (!@ chmod($file, octdec((string)$this->_permission)))
				return false;
		}
	
		return true;
	}	
	
	public function changeFoldersPermission()   
	{
	
		foreach($this->_folders as $folder)
		{
			if (!@ chmod($folder, octdec((string)$this->_folderPermission)))
				return false;
		}
		return true;
	
	
	}
	
	public function changeImageFoldersWritablePermission()     
	{
		foreach($this->_imageFolders as $folder)
		{
			if (!@ chmod($folder, octdec((string)$this->_folderPermission)))
				return false;
		}
	
		return true;	
	}	
	
	

}

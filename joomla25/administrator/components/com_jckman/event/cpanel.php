<?php
/**
**/

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

jimport( 'joomla.event.event' );

/**
 * JCKListControllerListener extends JEvent
 *
 */
class JCKCpanelControllerListener extends JEvent
{
	/**
	 * A JParameter object holding the parameters for the plugin
	 *
	 * @var		A JParameter object
	 * @access	public
	 * @since	1.5
	 */
	 
	 public function onCheck()
	 {
		
		$mainframe = JFactory::getApplication();	
		
		
		//Check System requirements for the editor 
		define('JCK_BASE',JPATH_CONFIGURATION .DS.'plugins'.DS.'editors'.DS.'jckeditor');
			
		if(!JFolder::exists(JCK_BASE))
			return;
	
		
		$perms  = fileperms(JPATH_CONFIGURATION.DS.'index.php');
		$perms = (decoct($perms & 0777));
			
		$default_fperms = '0644';
		$default_dperms = '0755'; 
			
		if($perms == 777 || $perms == 666)
		{
			$default_fperms = '0666';
			$default_dperms = '0777'; 
		}
		
		$fperms = JCK_BASE.DS.'config.js';
		
		if(!stristr(PHP_OS,'WIN') && JPath::canChmod(JCK_BASE)  && $perms != decoct(fileperms($fperms) & 0777))
		{
			
		  $path = JCK_BASE.DS.'plugins';
		 
		  if(!JPath::setPermissions($path,$default_fperms,$default_dperms))
		  {
			$mainframe->enqueueMessage( JText::_('Auto correction failed for incorrect file permissions for the JCK Editor'),'error'  );
		  }
		}
	 		
		$mainframe->enqueueMessage( JText::_('System checked and updated'));
		
	}//end function onCheck	

	
	public function onExport()
	{
		
        require(JPATH_COMPONENT.'/helpers/archive.php');
		
		//copy XML file
		jimport('joomla.filesystem.file');
			
		$src 	= JPATH_PLUGINS.DS.'editors'.DS.'jckeditor'.DS.'jckeditor.xml';
		$dest 	= JPATH_ADMINISTRATOR.DS.'components' .DS. 'com_jckman' .DS. 'editor'.DS.'plugins'.DS.'jckeditor.xml';
		
		if( !JFile::copy( $src, $dest) ){
			$mainframe->enqueueMessage( JText::_('Unable to copy JCK Editor\'s Manifest file') );
		}
		//process SQL
		if($this->_createSQL())
		{
		
			// Create a new gzip file test.tgz in htdocs/test
			$backup_file_name = 'bak_jckeditor'.date('dmyHis') . '.tar.gz';
			
      		$tgz = new gzip_file($backup_file_name);
			$tgz->set_options(array('basedir' => JPATH_COMPONENT."/editor", 'overwrite' =>1,'inmemory'=>1,level=>5));
            $tgz->add_files(array('plugins','import.xml'));
			$tgz->create_archive();
			$tgz->download_file();
			exit;
     	}
		else
		{
			JError::raiseWarning( 100, "Could not create SQL file");
		}
	
	}//end function onSync
	
	private function _createSQL()
	{
		
		$tables = array('#__jckplugins','#__jcktoolbars','#__jcktoolbarplugins');
	
		$db = JFactory::getDBO();
	
		$sql = array();
	
		foreach($tables as $table)
		{
			 $sql[] = 'DROP TABLE IF EXISTS '. $table.';'.chr(13);
			 $query = 'SHOW CREATE TABLE '. $table;
			 $db->setQuery($query);
       		 $row = $db->loadRow();
 			 $struct = str_replace($db->getPrefix(),'#__',$row[1]);
			 $sql[] = $struct.';'.chr(13);
			 $query = 'SELECT * FROM '. $table;
			 $db->setQuery($query);
			 $rows = $db-> loadRowList();
	
			if(!empty($rows))
			{
				
				$sql[] = 'INSERT INTO '. $table. ' VALUES ';
				
				$fieldcount = count($rows[0]);
				$rowcount = count($rows);
				$fieldcount--;
				$rowcount--;
				foreach($rows as $k=>$row)
				{
					if(!$row[$fieldcount])
						$row[$fieldcount] = 'NULL';
					if(!$row[$fieldcount-2])
						$row[$fieldcount-2] = 'NULL';	
						
					if($k < $rowcount)	
						$tupples =	"('".implode("','",$row)."'),";
					else
						$tupples =	"('".implode("','",$row)."');";
					$tupples = str_replace("'NULL'","NULL",$tupples);
					$sql[] = $tupples;
				}
				$sql[] = chr(13);
			}
		}
		
		$query = "SELECT params FROM #__extensions WHERE folder='editors' AND element = 'jckeditor'";
		$db->setQuery($query);
		$result = $db-> loadResult();
		
		$sql[] = "UPDATE #__extensions";
		$sql[] = "SET params = '".$db->escape($result)."'";
		$sql[] = "WHERE folder='editors' AND element = 'jckeditor'";
		$sql[] = chr(13);	
		
		$buffer = implode(chr(13),$sql);
		$file = JPATH_COMPONENT.'/editor/plugins/sql.sql';
		return JFile::write($file, $buffer);
	}
	
}//end class
<?php
 
 /*
 * Modified for use as the J plugin installer
 * AW
 */


// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

define( 'JCK_PATH', JPATH_PLUGINS.DS.'editors'.DS.'jckeditor' );
define( 'JCK_PLUGINS', JCK_PATH.DS.'plugins' );

require_once( JPATH_COMPONENT .DS. 'tables' .DS. 'plugin.php' );
require_once(CKEDITOR_LIBRARY.DS . 'toolbar.php');

jckimport('helper');


/**
 * Plugin installer
 *
 * @package		Joomla.Framework
 * @subpackage	Installer
 * @since		1.5
 * Renamed JInstallerPlugin to JCKInstallerPlugin
 */
  
  
 
class JCKInstallerPlugin extends JObject
{
	/**
	 * Constructor
	 *
	 * @access	protected
	 * @param	object	$parent	Parent object [JInstaller instance]
	 * @return	void
	 * @since	1.5
	 */
	 
	 
	 
	 
	
	function __construct(&$parent)
	{
		$this->parent =& $parent;
	}
	
	/**
	 * Custom install method
	 *
	 * @access	public
	 * @return	boolean	True on success
	 * @since	1.5
	 * Minor alteration - see below
	 */
	function install()
	{
		// Get a database connector object
		$db =& $this->parent->getDBO();

		// Get the extension manifest object
		
	
					
		$manifest =& $this->parent->getManifest();
		$this->manifest =&  $manifest;//$manifest->document;
		
		/**
		 * ---------------------------------------------------------------------------------------------
		 * Manifest Document Setup Section
		 * ---------------------------------------------------------------------------------------------
		 */
			 

		// Set the component name
		$name = '';
				
		if($this->manifest->name)
		{
			$name = $this->manifest->name;
			$this->set('name', $name->data());
		}
		else
			$this->set('name','');
		
		// Get the component description
		$description = & $this->manifest->description;
		if (is_a($description, 'JXMLElement')) {
			$this->parent->set('message', $description->data());
		} else {
			$this->parent->set('message', '' );
		}
		
		$element =& $this->manifest->files;

		// Plugin name is specified
		$pname  = (string) $this->manifest->attributes()->plugin;
		
		
		//Get type
		$type  = $this->manifest->attributes()->group;
		
		if (!empty ($pname)) {
			// ^ Use JCK_PLUGINS defined path
			$this->parent->setPath('extension_root', JCK_PLUGINS .DS. $pname);
		} else {
			$this->parent->abort('Extension Install: '.JText::_('No plugin specified'));
			return false;
		}
		
		
		if ((string)$manifest->scriptfile)
		{
			$manifestScript = (string)$manifest->scriptfile;
			$manifestScriptFile = $this->parent->getPath('source').DS.$manifestScript;
			if (is_file($manifestScriptFile))
			{
				// load the file
				include_once $manifestScriptFile;
			}
			// Set the class name
			$classname = 'plgJCK'.$pname.'InstallerScript';
			
			if (class_exists($classname))
			{
				// create a new instance
				$this->parent->manifestClass = new $classname($this);
				// and set this so we can copy it later
				$this->set('manifest_script', $manifestScript);
				// Note: if we don't find the class, don't bother to copy the file
			}
				
			// run preflight if possible 
			ob_start();
			ob_implicit_flush(false);
			if ($this->parent->manifestClass && method_exists($this->parent->manifestClass,'preflight'))
			{
				if($this->parent->manifestClass->preflight('install', $this) === false)
				{
					// Install failed, rollback changes
					$this->parent->abort(JText::_('Installer abort for custom plugin install script'));
					return false;
				}
			}
			ob_end_clean();
		}
		
		/**
		 * ---------------------------------------------------------------------------------------------
		 * Filesystem Processing Section
		 * ---------------------------------------------------------------------------------------------
		 */

		// If the extension directory does not exist, lets create it
		$created = false;
		if (!file_exists($this->parent->getPath('extension_root'))) {
			if (!$created = JFolder::create($this->parent->getPath('extension_root'))) {
				$this->parent->abort('Plugin Install: '.JText::_('Failed to create directory').': "'.$this->parent->getPath('extension_root').'"');
				return false;
			}
		}

		/*
		 * If we created the extension directory and will want to remove it if we
		 * have to roll back the installation, lets add it to the installation
		 * step stack
		 */
		if ($created) {
			$this->parent->pushStep(array ('type' => 'folder', 'path' => $this->parent->getPath('extension_root')));
		}

		// Copy all necessary files
		if ($this->parent->parseFiles($element, -1) === false) {
			// Install failed, roll back changes
			$this->parent->abort();
			return false;
		}
	
		
		// Parse optional tags -- language files for plugins
		$this->parent->parseLanguages($this->manifest->languages, 0);
		
		// If there is an install file, lets copy it.
		$installScriptElement =& $this->manifest->installfile;
		if (is_a($installScriptElement, 'JXMLElement')) {
			// Make sure it hasn't already been copied (this would be an error in the xml install file)
			if (!file_exists($this->parent->getPath('extension_root').DS.$installScriptElement->data()))
			{
				$path['src']	= $this->parent->getPath('source').DS.$installScriptElement->data();
				$path['dest']	= $this->parent->getPath('extension_root').DS.$installScriptElement->data();
				if (!$this->parent->copyFiles(array ($path))) {
					// Install failed, rollback changes
					$this->parent->abort(JText::_('Component').' '.JText::_('Install').': '.JText::_('Could not copy PHP install file.'));
					return false;
				}
			}
			$this->set('install.script', $installScriptElement->data());
		}

		// If there is an uninstall file, lets copy it.
		$uninstallScriptElement =& $this->manifest->uninstallfile;
		if (is_a($uninstallScriptElement, 'JXMLElement')) {
			// Make sure it hasn't already been copied (this would be an error in the xml install file)
			if (!file_exists($this->parent->getPath('extension_root').DS.$uninstallScriptElement->data()))
			{
				$path['src']	= $this->parent->getPath('source').DS.$uninstallScriptElpement->data();
				$path['dest']	= $this->parent->getPath('extension_root').DS.$uninstallScriptElement->data();
				if (!$this->parent->copyFiles(array ($path))) {
					// Install failed, rollback changes
					$this->parent->abort(JText::_('Component').' '.JText::_('Install').': '.JText::_('Could not copy PHP uninstall file.'));
					return false;
				}
			}
		}

			/**
		 * ---------------------------------------------------------------------------------------------
		 * Database Processing Section
		 * ---------------------------------------------------------------------------------------------
		 */

		$type = (isset($type) ? (string)$type : 'plugin'); //Add group processimg 
		
		// Check to see if a plugin by the same name is already installed
		// ^ Altered db query for #__JCK_PLUGINS
		$query = 'SELECT `id`' .
				' FROM `#__jckplugins`' .
				' WHERE name = '.$db->Quote($pname);
		$db->setQuery($query);
		if (!$db->Query()) {
			// Install failed, roll back changes
			$this->parent->abort('Plugin Install: '.$db->stderr(true));
			return false;
		}
		$id = $db->loadResult();

		// Was there a module already installed with the same name?
		if ($id) {
			
			if (!$this->parent->getOverwrite())
			{
				// Install failed, roll back changes
				$this->parent->abort('Plugin Install: '.JText::_('Plugin').' "'.$pname.'" '.JText::_('already exists!'));
				return false;
			}
			
			$row =& JTable::getInstance('plugin', 'JCKTable');
			$row->type = $type;
			$row->load($id);
			
				
			
		} else {
			
			$icon 		= $this->manifest->icon;
	
			// ^ Changes to plugin parameters. Use JCK Plugins Table class. 
			$row =& JTable::getInstance('plugin', 'JCKTable');
			$row->title 		= $this->get('name');
			$row->name			= $pname;
			$row->type 			= $type;
			$row->row	 		= 4;
			$row->published 	= 1;
			$row->editable 		= 1;
			$row->icon 			= ($icon ? $icon->data() : '');
			$row->iscore 		= 0;
			$row->params 		= $this->parent->getParams();
				
			
			if($this->manifest->attributes()->parent)
			{
				$parentName = (string) $this->manifest->attributes()->parent;
				$row->setParent($parentName);
			}
				

			if (!$row->store()) {
				// Install failed, roll back changes
				$this->parent->abort('Plugin Install: '.$db->stderr(true));
				return false;
			}
						
			// Since we have created a plugin item, we add it to the installation step stack
			// so that if we have to rollback the changes we can undo it.
			$this->parent->pushStep(array ('type' => 'plugin', 'id' => $row->id));
		}
		
		
		
		/* -------------------------------------------------------------------------------------------
		 * update editor plugin config file    AW 
		 * -------------------------------------------------------------------------------------------
		*/ 
		  
		  $config = &	JCKHelper::getEditorPluginConfig();
		  
		  $config->setValue($pname,1);
		  
	  
		  $cfgFile = CKEDITOR_LIBRARY.DS . 'plugins' . DS . 'toolbarplugins.php'; 
		  
		 // Get the config registry in PHP class format and write it to configuation.php
		 if (!JFile::write($cfgFile, $config->toString('PHP',array('class' => 'JCKToolbarPlugins extends JCKPlugins')))) { 	  
		 		  	
		 	  JError::raiseWarning(100,'Failed to publish '. $pname. ' jckeditor plugin');
		 } 	  
		 
		 
	 	/**
		  *-------------------------------------------------------------------------------------------
		  * Add plugin to toolbars
		  *-------------------------------------------------------------------------------------------
		*/
		
			$CKfolder =  CKEDITOR_LIBRARY.DS . 'toolbar'; 
		
		     //$toolbarnames =& JCKHelper::getEditorToolbars();
			 
			 $toolbarnames = JRequest::getVar('selections',array());
			 
			if(!empty( $toolbarnames) && $row->icon)
			{
				$values = array();
				foreach($toolbarnames as $toolbarname)
				{
					$tmpfilename = $CKfolder.DS.$toolbarname.'.php';
		
					require($tmpfilename);
					
					$classname = 'JCK'. ucfirst($toolbarname);
					
					$toolbar = new $classname();
					
					$pluginTitle =  str_replace(' ','',$row->title);
					$pluginTitle = $pluginTitle;
					if(isset($toolbar->$pluginTitle)) continue;
					
					//fix toolbar values or they will get wiped out
					foreach (get_object_vars( $toolbar ) as $k => $v)
					{
															
						if(is_null($v))
						{
							$toolbar->$k = ''; 
						}
						
						if($k[0] == '_')
							$toolbar->$k = NULL;
					}
								
					$toolbar->$pluginTitle = '';
									
					$toolbarConfig = new JRegistry('toolbar');
				
					$toolbarConfig->loadObject($toolbar);		
					
					// Get the config registry in PHP class format and write it to configuation.php
					if (!JFile::write($tmpfilename, $toolbarConfig->toString('PHP', array('class' => $classname . ' extends JCKToolbar')))) { 	  
								
						JError::raiseWarning(100,'Failed to add '. $pname. 'plugin to  ' . $classname .' toolbar');
					} 	  
				 
					//layout stuff
					$query = 'SELECT id'
					. ' FROM #__jcktoolbars'
					. ' WHERE name = "'. $toolbarname .'"';
					$db->setQuery( $query );
					$toolbarid = $db->loadResult();
					
										
					$rowDetail = JCKHelper::getNextLayoutRow($toolbarid);
					
					
					$values[] = '('.$toolbarid.','. $row->id.','.$rowDetail->rowid.','.$rowDetail->rowordering.',1)';
						 
				}
				
			 
				 //insert into layout table
				if(!empty($values))
				{
					
					//Now delete dependencies
					$query = 'DELETE FROM #__jcktoolbarplugins'
						. ' WHERE pluginid ='. $row->id;
					$db->setQuery( $query );
					if (!$db->query()) {
						JError::raiseWarning(100, $db->getErrorMsg() );
					}

					
					$query = 'INSERT INTO #__jcktoolbarplugins(toolbarid,pluginid,row,ordering,state) VALUES ' . implode(',',$values);
					$db->setQuery( $query );
					if(!$db->query()) 
					{
						JError::raiseWarning( 100, $db->getErrorMsg() );
					}
				}
		
			}	
		/**
		 * ---------------------------------------------------------------------------------------------
		 * Custom Installation Script Section
		 * ---------------------------------------------------------------------------------------------
		 */

		/*
		 * If we have an install script, lets include it, execute the custom
		 * install method, and append the return value from the custom install
		 * method to the installation message.
		 */
		if ($this->get('install.script')) {
			if (is_file($this->parent->getPath('extension_root').DS.$this->get('install.script'))) {
				ob_start();
				ob_implicit_flush(false);
				require_once ($this->parent->getPath('extension_root').DS.$this->get('install.script'));
				if (function_exists('com_install')) {
					if (com_install() === false) {
						$this->parent->abort(JText::_('Plugin').' '.JText::_('Install').': '.JText::_('Custom install routine failure'));
						return false;
					}
				}
				$msg = ob_get_contents();
				ob_end_clean();
				if ($msg != '') {
					$this->parent->set('extension.message', $msg);
				}
			}
		}
		/**
		 * ---------------------------------------------------------------------------------------------
		 * Finalization and Cleanup Section
		 * ---------------------------------------------------------------------------------------------
		 */

		// Lastly, we will copy the manifest file to its appropriate place.
		if (!$this->parent->copyManifest(-1)) {
			// Install failed, rollback changes
			$this->parent->abort('Plugin Install: '.JText::_('Could not copy setup file'));
			return false;
		}
        
        
        //make a copy of the plugin
		$src = 	$this->parent->getPath('extension_root');
		$dest = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_jckman'.DS.'editor'.DS.'plugins'.DS.$pname;
		
		if (!JFolder::copy( $src, $dest,null,true)) {
			// Install failed, roll back changes
			$this->parent->abort();
			return false;
		}
    
		
		// And now we run the postflight
		ob_start();
		ob_implicit_flush(false);
		if ($this->parent->manifestClass && method_exists($this->parent->manifestClass,'postflight'))
		{
			$this->parent->manifestClass->postflight('install', $this);
		}
		ob_end_clean();
	
		return true;
	}

	/**
	 * Custom uninstall method
	 *
	 * @access	public
	 * @param	int		$cid	The id of the plugin to uninstall
	 * @param	int		$clientId	The id of the client (unused)
	 * @return	boolean	True on success
	 * @since	1.5
	 */
	function uninstall($id)
	{
		// Initialize variables
		$row	= null;
		$retval = true;
		$db		=& $this->parent->getDBO();
		
		// First order of business will be to load the module object table from the database.
		// This should give us the necessary information to proceed.

		// ^ Changes to plugin parameters. Use JCK Plugins Table class. 
		$row =& JTable::getInstance('plugin', 'JCKTable');
		$row->load((int) $id);
	
			// Is the plugin we are trying to uninstall a core one?
		// Because that is not a good idea...
		if ($row->iscore) {
			JError::raiseWarning(100, 'Plugin Uninstall: '.JText::sprintf('WARNCOREPLUGIN', $row->title)."<br />".JText::_('WARNCOREPLUGIN2'));
			return false;
		}

		// Get the plugin folder so we can properly build the plugin path
		if (trim($row->name) == '') {
			JError::raiseWarning(100, 'Plugin Uninstall: '.JText::_('Plugin field empty, cannot remove files'));
			return false;
		}
		
		//Now delete dependencies
		$query = 'DELETE FROM #__jcktoolbarplugins'
			. ' WHERE pluginid ='. $row->id;
		$db->setQuery( $query );
		if (!$db->query()) {
			JError::raiseWarning(100, $db->getErrorMsg() );
		}
		
		

		// Set the plugin root path
		$this->parent->setPath('extension_root', JCK_PLUGINS . DS . $row->name);
		
		$manifestFile = $this->parent->getPath('extension_root') . DS . $row->name . '.xml';
		
	

		if (file_exists($manifestFile))
		{
	
			// If we cannot load the xml file return null
			if (!($xml =& JFactory::getXML($manifestFile))) {
				JError::raiseWarning(100, 'Plugin Uninstall: '.JText::_('Could not load manifest file'));
				return false;
			}
			
			
			$pname = (string) $xml->attributes()->plugin;
			
			if ((string)$xml->scriptfile)
			{
				$manifestScript = (string)$xml->scriptfile;
				$manifestScriptFile = $this->parent->getPath('extension_root').DS.$manifestScript;
				if (is_file($manifestScriptFile))
				{
					// load the file
					include_once $manifestScriptFile;
				}
				// Set the class name
				$classname = 'plgJCK'.$pname.'InstallerScript';
				
				if (class_exists($classname))
				{
					// create a new instance
					$this->parent->manifestClass = new $classname($this);
					// and set this so we can copy it later
					$this->set('manifest_script', $manifestScript);
					// Note: if we don't find the class, don't bother to copy the file
				}
					
				// run preflight if possible 
				ob_start();
				ob_implicit_flush(false);
				if ($this->parent->manifestClass && method_exists($this->parent->manifestClass,'preflight'))
				{
					if($this->parent->manifestClass->preflight('unistall', $this) === false)
					{
						// Install failed, rollback changes
						$this->parent->abort(JText::_('Installer abort for custom plugin install script'));
						return false;
					}
				}
				ob_end_clean();
				
				
				ob_start();
				ob_implicit_flush(false);
				if ($this->parent->manifestClass && method_exists($this->parent->manifestClass,'uninstall'))
				{
					$this->parent->manifestClass->uninstall($this);
				}
				$msg = ob_get_contents(); // append messages
				ob_end_clean();
			}
		
			/**  
			 *
			 * Remove plugin from toolbars file  AW
			 *
			 */
			 			
			$CKfolder =  CKEDITOR_LIBRARY.DS . 'toolbar'; 
		
		     $toolbarnames =& JCKHelper::getEditorToolbars();
			 
			 foreach($toolbarnames as $toolbarname)
			 {
			 	$tmpfilename = $CKfolder.DS.$toolbarname.'.php';
				
				require_once($tmpfilename);
				
				$classname = 'JCK'. ucfirst($toolbarname);
				
				$toolbar = new $classname();
				
				$pluginTitle =  str_replace(' ','',$row->title);
				$pluginTitle = ucfirst($pluginTitle);
				if(!isset($toolbar->$pluginTitle)) continue;
				//fix toolbar values or they will get wiped out
						
				foreach (get_object_vars( $toolbar ) as $k => $v)
				{
					
					if(is_null($v))
					{
						$toolbar->$k = ''; 
					}
					
					if($k[0] == '_')
					$toolbar->$k = NULL;
					
				}
				
				
				$toolbar->$pluginTitle = NULL;
								
				$toolbarConfig = new JRegistry('toolbar');
			
				$toolbarConfig->loadObject($toolbar);		
				
				// Get the config registry in PHP class format and write it to configuation.php
				if (!JFile::write($tmpfilename, $toolbarConfig->toString('PHP', array('class' => $classname . ' extends JCKToolbar')))) { 	  
							
					JError::raiseWarning(100,'Failed to remove '. $row->name. 'plugin from  ' . $classname .' toolbar');
				} 	  
			 
			 
			 }
												
			 /**
			  *
			  * Remove plugin from config file  AW
			  *
			  */
			 
			 $config = &	JCKHelper::getEditorPluginConfig();
			  
			 $config->setValue($row->name,NULL); // remove value from output
			  
		  
			 $cfgFile = CKEDITOR_LIBRARY.DS . 'plugins' . DS . 'toolbarplugins.php'; 
			  
			 // Get the config registry in PHP class format and write it to configuation.php
			 if (!JFile::write($cfgFile, $config->toString('PHP', array('class' => 'JCKToolbarPlugins extends JCKPlugins')))) { 	  
						
				  JError::raiseWarning(100,'Failed to remove '. $pname .' jckeditor plugin from config file');
			 } 	  
		
			/*
			 * Check for a valid XML root tag.
			 * @todo: Remove backwards compatability in a future version
			 * Should be 'install', but for backward compatability we will accept 'mosinstall'.
			 */
			$root =& $xml;
		
			if ($root->getName() != 'extension' && $root->getName() != 'install') {
				JError::raiseWarning(100, 'Plugin Uninstall: '.JText::_('Invalid manifest file'));
				return false;
			}
			
			
			// Remove the plugin files
			$this->parent->removeFiles($root->files, -1);
			JFile::delete($manifestFile);

			// Remove all media and languages as well
			$this->parent->removeFiles($root->languages, 0);
			
			/**
			 * ---------------------------------------------------------------------------------------------
			 * Custom Uninstallation Script Section
			 * ---------------------------------------------------------------------------------------------
			 */
	
			// Now lets load the uninstall file if there is one and execute the uninstall function if it exists.
			$uninstallfileElement =& $root->uninstallfile;
			if (is_a($uninstallfileElement, 'JXMLElement')) {
				// Element exists, does the file exist?
				if (is_file($this->parent->getPath('extension_root').DS.$uninstallfileElement->data())) {
					ob_start();
					ob_implicit_flush(false);
					require_once ($this->parent->getPath('extension_root').DS.$uninstallfileElement->data());
					if (function_exists('com_uninstall')) {
						if (com_uninstall() === false) {
							JError::raiseWarning(100, JText::_('Plugin').' '.JText::_('Uninstall').': '.JText::_('Custom Uninstall script unsuccessful'));
							$retval = false;
						}
					}
					$msg = ob_get_contents();
					ob_end_clean();
					if ($msg != '') {
						$this->parent->set('extension.message', $msg);
					}
				}
			}
			
								
		} else {
			JError::raiseWarning(100, 'Plugin Uninstall: Manifest File invalid or not found. Plugin entry removed from database.');
			
			$row->delete($row->id);
			unset ($row);
			$retval = false;
		}
		
			

		// Now we will no longer need the plugin object, so lets delete it
		$row->delete($row->id);
		unset ($row);

		// If the folder is empty, let's delete it
		$files = JFolder::files($this->parent->getPath('extension_root'));
		if (!count($files)) {
			JFolder::delete($this->parent->getPath('extension_root'));
		}

		
		//Now delete copy of plugin stored in the component
		$copyPath = JPATH_ADMINISTRATOR.DS.'components'.DS.'com_jckman'.DS.'editor'.DS.'plugins'.DS.$pname;
		JFolder::delete($copyPath);
		
		return $retval;
	}

	/**
	 * Custom rollback method
	 * 	- Roll back the plugin item
	 *
	 * @access	public
	 * @param	array	$arg	Installation step to rollback
	 * @return	boolean	True on success
	 * @since	1.5
	 * Minor changes to the db query
	 */
	function _rollback_plugin($arg)
	{
		// Get database connector object
		$db =& $this->parent->getDBO();
		
		
		// Remove the entry from the #__JCK_PLUGINS table
			
		$query = 'DELETE' .
				' FROM `#__jckplugins`' .
				' WHERE id='.(int)$arg['id'];
		$db->setQuery($query);
		return ($db->query() !== false);
	}
}
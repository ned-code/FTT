<?php

// Check to ensure this file is within the rest of the framework
defined('JPATH_BASE') or die();

jimport( 'joomla.html.parameter' );

class JCKHelper
{

	static function & getTable( $name, $prefix = 'JCKTable', $config = array())
	{
				
		$path = JPATH_COMPONENT.DS.'tables';
		JTable::addIncludePath($path);

		// Clean the name
		$prefix = preg_replace( '/[^A-Z0-9_]/i', '', $prefix );

		//Make sure we are returning a DBO object
		if (!array_key_exists('dbo', $config))  {
			$config['dbo'] = JFactory::getDBO();
		}

		$instance =@ JTable::getInstance($name, $prefix, $config );
		return $instance;
	}

	 static function & geTtoolbarParams($editor,$args = array())
	 {
		 
		 if( count($args) > 1) 
		{
			$row = $args[1];		
		}
		
		        
	   	if(is_a($args[0] ,'JParameter'))
		{
			$params = $args[0];
		}
		else
		{   	if( $row) 
			{
			    $params = new JParameter($row->params);		
			}
			else
			{
				$row = & JCKHelper::getTable('toolbar');
				// load the row from the db table
				$row->load( $args[0]);
				//get toolbar parameter
				$params = new JParameter($row->params);
			}
		}
		
		$editor_params   = new JParameter($editor->params);
		$toolbar = $params->get('toolbar',$row->name);
		$skins = $params->get('skin', $editor_params->def( 'skin','office2003'));
		$width = $params->get('wwidth', $editor_params->def( 'wwidth','100%'));
		
	
		$editor_params->set( 'toolbar',$toolbar);
		$editor_params->set( 'skin', $skins );
		$editor_params->set( 'wwidth', $width);
	    $editor_params->Set( 'hheight',300);			
		return $editor_params;
	 }
	
	
	
	static function & getEditorPluginConfig($namspace = 'config')
	{
	    static $config;
        
        if(!isset($config))
        {
            $path =  CKEDITOR_LIBRARY;
		
		    require_once($path.DS.'plugins.php');
		    require_once($path.DS.'plugins'.DS.'toolbarplugins.php');
		
	    	$config = new JRegistry();
		
		    $pluginConfig = new JCKToolbarPlugins();
			
		    $config->loadObject($pluginConfig);
		    $data = $config->toObject();
		    $properties = get_object_vars($data);
		
            foreach($properties as $key=>$value)
            {						
                if(strpos('p'.$key,'_'))
                unset($data->$key);	
            }
	  	    return 	$config;
        }  
        
        return $config;
    }
		
		
	static function & getEditorToolbars()
	{
		$path =  CKEDITOR_LIBRARY.DS.'toolbar';
		
		$files = JFolder::files($path);
					
		$toolbars = array();
			
		 foreach($files as $file)
		 {
			
			if(strpos($file,"index") === false && strpos(strrev($file), 'php.') === 0) 
			{
				$toolbars[] = preg_replace('/\.php$/','',$file); 
			}	
			
		 }
		  return $toolbars;
		
	}	
	
	
	static function getNextAvailablePluginRowId()
	{
		$db = JFactory::getDBO();
		
		$db->setQuery('SELECT `row` AS id,count(`row`) AS total FROM `#__jckplugins`'.
					'group by row'.
					'having `row` > 2 ORDER BY `row` DESC LIMIT 1');
		$row = $db->loadObject();
		
		if(!$row && is_null($row))
		{
		 $row = new stdclass;
		 $row->id = 4;
		 $row->order = 1;
		}
		
		$id = $row->id;
		if($row->total = 26)
		  $id++;
		 
		return $id;
	}
	
	
	static function getNextLayoutRow($toolbarid)
	{
		$db = JFactory::getDBO();
		
		$db->setQuery('SELECT `row` AS rowid,MAX(`ordering`) +1  AS rowordering FROM `#__jcktoolbarplugins`'
					.' WHERE `toolbarid`='.(int) $toolbarid
					.' GROUP BY `row`'
					.' ORDER BY `row` DESC LIMIT 1');
		$row = $db->loadObject();
		
		if(!$row && is_null($row))
		{
		 $row = new stdclass;
		 $row->rowid = 4;
		 $row->rowordering = 1;
		}
		
		return $row;
	}
	
	
	
	
}



jimport('joomla.application.component.helper');


abstract class JCKModuleHelper extends JModuleHelper
{
	
	
	public static function &getModules($position)
	{
		$app		= JFactory::getApplication();
		$position	= strtolower($position);
		$result		= array();

		
		$modules = self::_load();

		$total = count($modules);
		for ($i = 0; $i < $total; $i++)
		{
			if ($modules[$i]->position == $position) {
				$result[] = &$modules[$i];
			}
		}
		if (count($result) == 0)
		{
			if (JRequest::getBool('tp') && JComponentHelper::getParams('com_templates')->get('template_positions_display'))
			{
				$result[0] = self::getModule('mod_'.$position);
				$result[0]->title = $position;
				$result[0]->content = $position;
				$result[0]->position = $position;
			}
		}
		
		return $result;
	}
	
	/* Load published modules
	 *
	 * @return	array
	 */
	protected static function &_load()
	{
		
		
		static $clean;

		if (isset($clean)) {
			return $clean;
		}

		$Itemid 	= JRequest::getInt('Itemid');
		$app		= JFactory::getApplication();
		$user		= JFactory::getUser();
		$groups		= implode(',', $user->getAuthorisedViewLevels());
		$lang 		= JFactory::getLanguage()->getTag();
		$clientId 	= (int) $app->getClientId();

		$cache 		= JFactory::getCache ('com_modules', '');
		$cacheid 	= md5(serialize(array('com_jckman', $groups, $clientId, $lang)));


		if (!($clean = $cache->get($cacheid))) {
			$db	= JFactory::getDbo();

			$query =  $db->getQuery(true); //new JDatabaseQuery;
			$query->select('id, title, module, position, content, showtitle, params, mm.menuid');
			$query->from('#__modules AS m');
			$query->join('LEFT','#__modules_menu AS mm ON mm.moduleid = m.id');
			$query->where('m.published = 1');

			$date = JFactory::getDate();
			$now = $date->toMySQL();
			$nullDate = $db->getNullDate();
			$query->where('(m.publish_up = '.$db->Quote($nullDate).' OR m.publish_up <= '.$db->Quote($now).')');
			$query->where('(m.publish_down = '.$db->Quote($nullDate).' OR m.publish_down >= '.$db->Quote($now).')');

			$query->where('m.access IN ('.$groups.')');
			$query->where('m.client_id = '. $clientId);
			$query->where('(mm.menuid = '. (int) $Itemid .' OR (mm.menuid <= 0 OR mm.menuid IS NULL))'); //fix as this is suppose to be a LEFT JOIN!!! 

			// Filter by language
			if ($app->isSite() && $app->getLanguageFilter()) {
				$query->where('m.language IN (' . $db->Quote($lang) . ',' . $db->Quote('*') . ')');
			}

			$query->order('position, ordering');

			// Set the query
			$db->setQuery($query);
			if (!($modules = $db->loadObjectList())) {
				JError::raiseWarning(500, JText::sprintf('JLIB_APPLICATION_ERROR_MODULE_LOAD', $db->getErrorMsg()));
				return false;
			}

			// Apply negative selections and eliminate duplicates
			$negId	= $Itemid ? -(int)$Itemid : false;
			$dupes	= array();
			$clean	= array();
			for ($i = 0, $n = count($modules); $i < $n; $i++)
			{
				$module = &$modules[$i];

				// The module is excluded if there is an explicit prohibition, or if
				// the Itemid is missing or zero and the module is in exclude mode.
				$negHit	= ($negId === (int) $module->menuid)
						|| (!$negId && (int)$module->menuid < 0);

				if (isset($dupes[$module->id]))
				{
					// If this item has been excluded, keep the duplicate flag set,
					// but remove any item from the cleaned array.
					if ($negHit) {
						unset($clean[$module->id]);
					}
					continue;
				}
				$dupes[$module->id] = true;

				// Only accept modules without explicit exclusions.
				if (!$negHit)
				{
					//determine if this is a custom module
					$file				= $module->module;
					$custom				= substr($file, 0, 4) == 'mod_' ?  0 : 1;
					$module->user		= $custom;
					// Custom module name is given by the title field, otherwise strip off "com_"
					$module->name		= $custom ? $module->title : substr($file, 4);
					$module->style		= null;
					$module->position	= strtolower($module->position);
					$clean[$module->id]	= $module;
				}
			}
			unset($dupes);
			// Return to simple indexing that matches the query order.
			$clean = array_values($clean);

			$cache->store($clean, $cacheid);
		}

		return $clean;
	}

	
}

jimport( 'joomla.form.form' );
class JCKForm extends JForm
{
	/**
	 * Method to get an instance of a form.
	 *
	 * @param	string	$name		The name of the form.
	 * @param	string	$data		The name of an XML file or string to load as the form definition.
	 * @param	array	$options	An array of form options.
	 * @param	string	$replace	Flag to toggle whether form fields should be replaced if a field
	 *								already exists with the same group/name.
	 * @param	string	$xpath		An optional xpath to search for the fields.
	 *
	 * @return	object	JForm instance.
	 * @throws	Exception if an error occurs.
	 * @since	1.6
	 */
	public static function getInstance($name, $data = null, $options = array(), $replace = true, $xpath = false)
	{
		// Reference to array with form instances
		$forms = &self::$forms;
		// Only instantiate the form if it does not already exist.
		if (!isset($forms[$name])) {

			$data = trim($data);

			if (empty($data)) {
				throw new Exception(JText::_('JLIB_FORM_ERROR_NO_DATA'));
			}

			// Instantiate the form.
			$forms[$name] = new JCKForm($name, $options);

			// Load the data.
			if (substr(trim($data), 0, 1) == '<') {
				if ($forms[$name]->load($data, $replace, $xpath) == false) {
					throw new Exception(JText::_('JLIB_FORM_ERROR_XML_FILE_DID_NOT_LOAD'));

					return false;
				}
			}
			else {
				if ($forms[$name]->loadFile($data, $replace, $xpath) == false) {
					throw new Exception(JText::_('JLIB_FORM_ERROR_XML_FILE_DID_NOT_LOAD'));

					return false;
				}
			}
		}

		return $forms[$name];
	}


	
	/**
	 * Method to get a form field represented as an XML element object.
	 *
	 * @param	string	$name	The name of the form field.
	 * @param	string	$group	The optional dot-separated form group path on which to find the field.
	 *
	 * @return	mixed	The XML element object for the field or boolean false on error.
	 * @since	1.6
	 */
	protected function findField($name, $group = null)
	{
		// Initialise variables.
		$element	= false;
		$fields		= array();

		// Make sure there is a valid JForm XML document.
		if (!($this->xml instanceof JXMLElement)) {
			return false;
		}

		// Let's get the appropriate field element based on the method arguments.
		if ($group) {

			// Get the fields elements for a given group.
			$elements = & $this->findGroup($group);

			// Get all of the field elements with the correct name for the fields elements.
			foreach ($elements as $element)
			{
				// If there are matching field elements add them to the fields array.
				if ($tmp = $element->xpath('descendant::field[@name="'.$name.'"]')) {
					$fields = array_merge($fields, $tmp);
				}
			}

			// Make sure something was found.
			if (!$fields) {
				return false;
			}

			// Use the first correct match in the given group.
			$groupNames = explode('.', $group);
			foreach ($fields as & $field)
			{
				// Get the group names as strings for anscestor fields elements.
				$attrs = $field->xpath('ancestor::fields[@name]/@name');
				$names	= array_map('strval', $attrs ? $attrs : array());

				// If the field is in the exact group use it and break out of the loop.
				if ($names == (array) $groupNames) {
					$element = & $field;
					break;
				}
			}
		}
		else {
			// Get an array of fields with the correct name.
			$fields = $this->xml->xpath('//field[@name="'.$name.'"]');

			// Make sure something was found.
			if (!$fields) {
				return false;
			}

			// Search through the fields for the right one.
			foreach ($fields as & $field)
			{
				// If we find an anscestor fields element with a group name then it isn't what we want.
				if ($field->xpath('ancestor::fields[!@name]')) {
					continue;
				}
				// Found it!
				else {
					$element = & $field;
					break;
				}
			}
		}

		return $element;
	}

	/**
	 * Method to get the value of a field.
	 *
	 * @param	string	$name		The name of the field for which to get the value.
	 * @param	string	$group		The optional dot-separated form group path on which to get the value.
	 * @param	mixed	$default	The optional default value of the field value is empty.
	 *
	 * @return	mixed	The value of the field or the default value if empty.
	 * @since	1.6
	 */
	 
	public function getValue($name, $group = null, $default = null)
	{
		$return = $this->data->get($name, $default);
		return $return;
	}


	



}//end class JCKForm
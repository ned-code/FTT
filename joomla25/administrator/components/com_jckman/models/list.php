<?php

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

jimport('joomla.application.component.model');

/**
 * Hello Hello Model
 *
 * @package    Joomla.Tutorials
 * @subpackage Components
 */
class ListModelList extends JModel
{
	/**
	 * Constructor that retrieves the ID from the request
	 *
	 * @access	public
	 * @return	void
	 */
	function __construct()
	{
		parent::__construct();

		
	}

	/**
	 * Method to set the hello identifier
	 *
	 * @access	public
	 * @param	int Hello identifier
	 * @return	void
	 */
	 
	 
	

	/**
	 * Method to get a hello
	 * @return object with data
	 */
	function &getData()
	{
		// Load the data
		if (empty( $this->_data )) {
			$query = ' SELECT * FROM #__jckplugins'.
					'  WHERE id = '.$this->_id;
			$this->_db->setQuery( $query );
			$this->_data = $this->_db->loadObject();
		}
		if (!$this->_data) {
			$this->_data = new stdClass();
			$this->_data->id = 0;
		}
	   	
		return $this->_data;
	}

	
			
			
	function getTotal()
	{
	
	
	}		
		
	function & getTypes()
	{
	
	 $query = 'SELECT type AS value, type AS text'
		. ' FROM #__jckplugins'
		. ' GROUP BY type'
		. ' ORDER BY type'
		;
	 $this->_db->setQuery( $query );
	 $types = $this->_db->loadObjectList();
	 return  $types; 
	 	 
	}		

	function & getSelectedToolbarList()
	{
		
		$rows = array();
		jckimport('helper');
		$toolbars = JCKHelper::getEditorToolbars();
	
		$cid 	= JRequest::getVar( 'cid', array(0), '', 'array' );
		JArrayHelper::toInteger($cid, array(0));	
	
	
		$db = JFactory::getDBO();
		
		$query = 'SELECT title FROM #__jckplugins'
		. ' WHERE id = '. $cid[0];
		$db->setQuery( $query );
		$pluginname = $db->loadResult();
	
		if (!!$pluginname && !is_string($pluginname) ) {
			JError::raiseError(500, $db->getErrorMsg() );
		}
	
		jckimport('helper');
		$toolbarnames = JCKHelper::getEditorToolbars();
					
		if(!empty($toolbarnames))
		{
			require_once(CKEDITOR_LIBRARY.DS . 'toolbar.php');
			
			$CKfolder =  CKEDITOR_LIBRARY.DS . 'toolbar'; 
							
			foreach($toolbarnames as $toolbarname)
			{
				$tmpfilename = $CKfolder.DS.$toolbarname.'.php';
					
				require($tmpfilename);
					
				$classname = 'JCK'. ucfirst($toolbarname);
					
				$toolbar = new $classname();
				$pluginTitle =  str_replace(' ','',$pluginname);
				$pluginTitle = ucfirst($pluginTitle);
				if(!isset($toolbar->$pluginTitle)) continue;		
				$row = new stdclass;
				$row->text = $toolbarname; 
				$row->value = $toolbarname;
				$rows[] = $row;
			}
		}
		return $rows;

	}
	
	
	function getUserGroupList()
	{
		$db = JFactory::getDBO();
		$query = $db->getQuery(true);
		$query->select('a.id AS value, a.title AS text, COUNT(DISTINCT b.id) AS level');
		$query->from($db->quoteName('#__usergroups') . ' AS a');
		$query->join('LEFT', $db->quoteName('#__usergroups') . ' AS b ON a.lft > b.lft AND a.rgt < b.rgt');
		$query->group('a.id, a.title, a.lft, a.rgt');
		$query->order('a.lft ASC');
		$db->setQuery($query);
		$options = $db->loadObjectList();
		
		for ($i = 0, $n = count($options); $i < $n; $i++)
		{
			$options[$i]->text = str_repeat('- ', $options[$i]->level) . $options[$i]->text;
		}
		
		return $options;
	}

}
?>


	

			

		
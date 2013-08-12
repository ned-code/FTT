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
class InstallModelFolders extends JModel
{

	
	private $_editor; 

	
	public function __construct($config = array())
	{
		
		
		if( defined('JLEGACY_CMS') )
		{
			$sql =  "SELECT id,params FROM #__plugins WHERE element = 'jckeditor' AND folder ='editors'" ;
		
		} else
		{
			$sql =  "SELECT extension_id as id, params FROM #__extensions WHERE element = 'jckeditor' AND folder ='editors'" ;
		
		}//end if
					
		$database =  JFactory::getDBO();   
		$database->setQuery( $sql );
		$result = $database->loadObject();
		$this->_editor = $result;
		
		
		
		parent::__construct($config);
	}
	
	
	private function _getParams()
	{
			
		static $registry = NULL;
			
		if(is_null($registry))
		{
			if( defined('JLEGACY_CMS') )
			{
				jimport('joomla.html.parameter');
				$registry = new JParameter($this->_editor->params);
			} 		  
			 else
			 {
				$registry = new JRegistry($this->_editor->params);
			}
		}		
		return $registry;
	}
	

	
	
	public function getUserList()
	{
	 	$params = $this->_getParams();
		$default = $params->get('displayFoldersTo','');
		
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

		$list = JHTML::_('select.genericlist',  $options, 'displayFoldersTo[]', 'class="box" size="5" multiple="multiple"','value','text',$default);
		
		return $list;
	}
		
	public function getUseUserFolderBooleanList()
	{
		$params = $this->_getParams();
		$default = $params->get('useUserFolders',0);
		
		$options = array(
						 JHTML::_('select.option', '0', 'No'),
						 JHTML::_('select.option', '1', 'Yes')
						 );
		
		$list = JHTML::_('select.genericlist',  $options, 'useUserFolders', 'class="box" size="1"','value','text',$default);
		
		return $list;
	}
	
	public function getUserFolderTypeList()
	{
		$params = $this->_getParams();
		$default = $params->get('userFolderType','username');
	
		$options = array(
					 JHTML::_('select.option', 'username', 'UserName'),
					 JHTML::_('select.option', 'id', 'ID')
					 );
	
		$list = JHTML::_('select.genericlist',  $options, 'userFolderType', 'class="box" size="1"','value','text',$default);
		
		return $list;
	}
	
	public function store()
	{
		$post = JRequest::get('post');
		
		foreach($post as $key=>$value)
		{
			if(strtolower(trim($value)) == 'automatic' || strtolower(trim($value)) =='None')
				$post[$key] = '';
		}
		
		if( defined('JLEGACY_CMS') )
			$table = JTable::getInstance('plugin');
		else
			$table = JTable::getInstance('extension');
		
		$registry = $this->_getParams();
		$registry->loadArray($post);
				
		$table->load($this->_editor->id);	
		$table->params	= $registry->toString();
		return $table->store();
	}

}

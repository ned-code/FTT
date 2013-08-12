<?php
/**
 * @version		$Id: plugins.php 9872 2008-01-05 11:14:10Z eddieajau $
 * @package		Joomla
 * @subpackage	Menus
 * @copyright	Copyright (C) 2005 - 2008 Open Source Matters. All rights reserved.
 * @license		GNU/GPL, see LICENSE.php
 * Joomla! is free software. This version may have been modified pursuant to the
 * GNU General Public License, and as distributed it includes or is derivative
 * of works licensed under the GNU General Public License or other free or open
 * source software licenses. See COPYRIGHT.php for copyright notices and
 * details.
 */
// Import library dependencies
require_once(dirname(__FILE__).DS.'extension.php');

/**
 * Installer Plugins Model
 *
 * @package		Joomla
 * @subpackage	Installer
 * @since		1.5
 */
class InstallerModelPlugin extends InstallerModel
{
	/**
	 * Extension Type
	 * @var	string
	 */
	var $_type = 'plugin';

	/**
	 * Overridden constructor
	 * @access	protected
	 */
	function __construct()
	{
		$mainframe = JFactory::getApplication();
			
		// Call the parent constructor
		parent::__construct();

		// Set state variables from the request
		$this->setState('filter.string', $mainframe->getUserStateFromRequest( "com_jckman.plugin.string", 'filter', '', 'string' ));
	}

	function _loadItems()
	{
		$mainframe = JFactory::getApplication();	
	
		// Get a database connector
		$db = JFactory::getDBO();

		$where = null;
		if ($search = $this->state->get('filter.string')) {
			$where .= ' AND title LIKE '.$db->Quote( '%'.$db->getEscaped( $search, true ).'%', false );
		}

		$query = 'SELECT id, title, type, name' .
				' FROM #__jckplugins' .
				' WHERE type="plugin"' .
				' AND iscore=0' .
				$where .
				' ORDER BY name';
		$db->setQuery($query);
		$rows = $db->loadObjectList();
		// Get the plugin base path
		$baseDir = JCK_PLUGINS;

		$numRows = count($rows);

		for ($i = 0; $i < $numRows; $i ++) {
			$row = & $rows[$i];

			// Get the plugin xml file
			$xmlfile = $baseDir .DS. $row->name .DS. $row->name .".xml";

			if (file_exists($xmlfile)) {
				if ($data = JApplicationHelper::parseXMLInstallFile($xmlfile)) {
					foreach($data as $key => $value)
					{
						if($value)
							$row->$key = $value;
					}
				}
			}
		}
		$this->setState('pagination.total', $numRows);
		if($this->state->get('pagination.limit') > 0) {
			$this->_items = array_slice( $rows, $this->state->get('pagination.offset'), $this->state->get('pagination.limit') );
		} else {
			$this->_items = $rows;
		}
	
		
	}
}
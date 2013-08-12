<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Form
 *
 * @copyright   Copyright (C) 2005 - 2012 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

JFormHelper::loadFieldClass('sql');

/**
 * Supports an custom SQL select list
 *
 * @package     Joomla.Platform
 * @subpackage  Form
 * @since       11.1
 */
class JFormFieldFilebrowsers extends JFormFieldSQL
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  11.1
	 */
	public $type = 'Filebrowsers';

	/**
	 * Method to get the custom field options.
	 * Use the query attribute to supply a query to generate the list.
	 *
	 * @return  array  The field option objects.
	 *
	 * @since   11.1
	 */
	protected function getOptions()
	{
		// Initialize variables.
		$options = array();

		// Initialize some field attributes.

		$this->element['key_field'] = 'value';
		$this->element['value_field'] = 'name';
		$this->element['translate'] = false;
		
		$query='SELECT name, name AS value FROM  #__jckplugins
				WHERE type = "filebrowser"
				AND published = 1
				
				UNION
				
				SELECT name, name AS value FROM  #__jckplugins  
				WHERE  name = "jckexplorer" 
				AND type = "plugin"
				AND published = 1';
		 
		 $this->element['query'] = $query;

		return parent::getOptions();
	}
}

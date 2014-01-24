<?php
/**
 * ARRA User Export Import component for Joomla! 1.6
 * @version 1.6.0
 * @author ARRA (joomlarra@gmail.com)
 * @link http://www.joomlarra.com
 * @Copyright (C) 2010 - 2011 joomlarra.com. All Rights Reserved.
 * @license GNU General Public License version 2, see LICENSE.txt or http://www.gnu.org/licenses/gpl-2.0.html
 * PHP code files are distributed under the GPL license. All icons, images, and JavaScript code are NOT GPL (unless specified), and are released under the joomlarra Proprietary License, http://www.joomlarra.com/licenses.html
 *
 * file: view.html.php
 *
 **** class 
     ArrausermigrateViewModal
	 
 **** functions
     display();
	 columns();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view' );

/**
 * ArrausermigrateViewModal View
 *
 */
class ArrausermigrateViewModal extends JViewLegacy{
	/**
	 * display method 
	 * @return void
	 **/
	function display($tpl = null){				
		// make ToolBarHelper with name of component.
		JToolBarHelper::title(   JText::_( 'ARRA_USER_EXPORT' ), 'generic.png' );
		
		$columns = $this->columns();		
		$this->assignRef('columns', $columns);
		
		parent::display($tpl);
	}
	
	function columns(){
	    $db =& JFactory::getDBO();
	    $sql= "DESCRIBE #__users ";
	    $db->setQuery($sql);
	    $result = $db->loadAssocList();
		$array = array();
		foreach($result as $key=>$value){
		     if($value['Field'] != "gid" && $value['Field'] != "params"){
		        $array[] = $value['Field'];
			 }	
		}
		return $array;
	}
}
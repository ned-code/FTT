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
     ArrausermigrateViewLanguage
	 
 **** functions
     display();
     languageFile();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport( 'joomla.application.component.view' );

/**
 * ArrausermigrateViewLanguage View
 *
 */
class ArrausermigrateViewLanguage extends JViewLegacy{
	/**
	 * display method 
	 * @return void
	 **/
	function display($tpl = null){		
		
		// make ToolBarHelper with name of component.
		JToolBarHelper::title(   JText::_( 'ARRA_USER_EXPORT' ), 'generic.png' );
		JToolBarHelper::apply();
		JToolBarHelper::save();
		JToolBarHelper::cancel ('cancel', 'Cancel');		
		//make drop down with user types for export
		$language_file = $this->languageFile();		
		$this->assignRef('language_file', $language_file);     						
		parent::display($tpl);
	}
	
	//return language content
	function languageFile(){
	    $filename = JPATH_ROOT.DS."administrator".DS."language".DS."en-GB".DS."en-GB.com_arrausermigrate.ini";
		$handle = fopen ( $filename, 'r' );
		$language_file = fread ( $handle, filesize ( $filename ) );
		fclose( $handle );		
		return $language_file;
	}
	
}
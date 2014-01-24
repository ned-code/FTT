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
 * file: controller.php
 *
 **** class 
     ArrausersmigrateController 
 **** functions
     display();
*/

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport('joomla.application.component.controller');

class ArrausermigrateController extends JControllerLegacy{
	/**
	 * Method to display the view
	 * @access	public
	 */
	function display(){		
	    $controller = JRequest::getVar("controller", "");
		$true_export = false;
		$true_import = false;
		$true_language = false;
		$true_about = false;
		$true_main = true;
		$true_utf = false;
		$true_delete = false;
		$true_statistics = false;
		$true_userprofile = false;
		
		if($controller == "export"){
		    $true_export = true;
			$true_main = false;
		}
		elseif($controller == "import"){
		    $true_import = true;
			$true_main = false;
		}
		elseif($controller == "language"){
		    $true_language = true;
			$true_main = false;
		}
		elseif($controller == "about"){
		    $true_about = true;
			$true_main = false;
		}		
		elseif($controller == "modal"){
			$true_main = false;
		}		
		elseif($controller == "utf"){
			$true_utf = true;
			$true_main = false;
		}
		elseif($controller == "statistics"){
			$true_statistics = true;
			$true_main = false;
		}
		elseif($controller == "userprofile"){
			$true_userprofile = true;
			$true_main = false;
		}
		elseif($controller == "delete"){
			$true_delete = true;
			$true_main = false;
		}
		else{
		    $true_main = true;
		}
		
		JSubMenuHelper::addEntry(JText::_('ARRA_MAIN_MENU'), 'index.php?option=com_arrausermigrate', $true_main);
		JSubMenuHelper::addEntry(JText::_('ARRA_USER_EXPORT_MENU'), 'index.php?option=com_arrausermigrate&task=export&controller=export', $true_export);
		JSubMenuHelper::addEntry(JText::_('ARRA_USER_IMPORT_MENU'), 'index.php?option=com_arrausermigrate&task=import&controller=import', $true_import);				
		JSubMenuHelper::addEntry(JText::_('ARRA_USERPROFILE_MENU'), 'index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile', $true_userprofile);		
		JSubMenuHelper::addEntry(JText::_('ARRA_UTF_MENU'), 'index.php?option=com_arrausermigrate&controller=utf', $true_utf);
		JSubMenuHelper::addEntry(JText::_('ARRA_DELETE_MENU'), 'index.php?option=com_arrausermigrate&controller=delete', $true_delete);
		JSubMenuHelper::addEntry(JText::_('ARRA_STATISTICS'), 'index.php?option=com_arrausermigrate&controller=statistics', $true_statistics);
		JSubMenuHelper::addEntry(JText::_('ARRA_LANGUAGE_MENU'), 'index.php?option=com_arrausermigrate&task=language&controller=language', $true_language);			
		
		parent::display();
	}
}

?>
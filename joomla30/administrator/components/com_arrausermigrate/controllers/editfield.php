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
 * file: utf.php
 *
 **** class 
     ArrausermigrateControllerEditfield 
	 
 **** functions
     __construct();
	 utf();
	 import();
	 cancel();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausermigrateControllerUtf Controller
 */
class ArrausermigrateControllerEditfield extends ArrausermigrateController{
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {	  
		parent::__construct();
		// Register Extra tasks
		$this->registerTask('editfield', 'editField');
		$this->registerTask('save', 'save');
		$this->registerTask('cancel', 'cancel');
	}	    
	
	//set view for export tab
    function editField(){
		JRequest::setVar('view', 'editfield');
		JRequest::setVar('layout', 'default');
		$model = $this->getModel('editfield');		
		parent::display();
	}
	
	function save(){
		$model =& $this->getModel("editfield");
		$return = $model->saveFields();
		if($return === TRUE){
			$msg = JText::_("ARRA_FIELDS_SAVED");
			echo "<script> window.parent.location.reload(false); window.parent.SqueezeBox.close() </script>";				
			$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg);
			exit();
		}
		else{
			$msg = JText::_("ARRA_FIELDS_NOT_SAVED");
			echo "<script> window.parent.location.reload(false); window.parent.SqueezeBox.close() </script>";				
			$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg, 'notice');
			exit();
		}
	}		
	
	function cancel(){
		$msg = JText::_("ARRA_OPERATION_CANCELED");
		$msg = JText::_("ARRA_FIELDS_NOT_SAVED");
		echo "<script> window.parent.SqueezeBox.close() </script>";				
		$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=userprofile&controller=userprofile", $msg);
		exit();
	}
}
?>
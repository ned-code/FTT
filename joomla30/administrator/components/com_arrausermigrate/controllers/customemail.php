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
 * file: customemail.php
 *
 **** class 
     ArrausersmigrateControllerCustomemail
	 
 **** functions
     __construct(); 
     emailExport();
	 saveSettingsEmailExport();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausersmigrateControllerLanguage Controller
 */
 
class ArrausermigrateControllerCustomemail extends ArrausermigrateController{
    var $_model = null;
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {   
		parent::__construct();
		//Register Extra tasks
	    $this->registerTask( 'email_export', 'emailExport' );
		$this->registerTask( 'save_settings_email_export', 'saveSettingsEmailExport' );
	}
	
	function emailExport(){
		JRequest::setVar( 'view', 'customemail' );
		JRequest::setVar( 'layout', 'default'  );		
		parent::display();
	}
	
	function saveSettingsEmailExport(){
		$model = $this->getModel('customemail');		
		$message_completed = $model->saveCustomEmail();		
		$message_array = explode("+", $message_completed);						
		
		if(isset($message_array)){		    
			if(isset($message_array[0]) && $message_array[0]=="ERROR"){
				echo "<script> window.parent.SqueezeBox.close() </script>";				
				$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=export&controller=export", $message_array[1], 'notice');
				exit();
			}
			else{
				echo "<script> window.parent.SqueezeBox.close() </script>";				
				$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=export&controller=export", $message_array[1]);
				exit();
			}  
		}
	}
	
}
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
 * file: import.php
 *
 **** class 
     ArrausermigrateControllerImport 
	 
 **** functions
     __construct();
	 import();
	 backUp();
	 importFile();
	 cancel();	
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausermigrateControllerImport Controller
 */
class ArrausermigrateControllerImport extends ArrausermigrateController{
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {	  
		parent::__construct();
		// Register Extra tasks				
		$this->registerTask( 'import', 'import' );
		$this->registerTask( 'import_button', 'importFile' );
		$this->registerTask( 'import_file', 'importFile' );
		$this->registerTask( 'back_up', 'backUp' );
	}	    
	
	//set view for export tab
    function import(){		
		JRequest::setVar( 'view', 'import' );
		JRequest::setVar( 'layout', 'default'  );		
		$model = $this->getModel('import');
		
		parent::display();
	}
	
	function backUp(){
		$model = $this->getModel('import');
		$model->backUp();
		$config = new JConfig();
		$this->setRedirect(Juri::base()."components/com_arrausermigrate/files/".$config->db."_usersBK.zip");
	}
	
	//set model end request method for export command
	function importFile(){
	    $model = $this->getModel('import');		
		$message_completed = $model->import();		
		$message_array = explode("+", $message_completed);
		if(isset($message_array)){		    
			if(isset($message_array[0]) && $message_array[0]=="ERROR"){
				$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=import&controller=import", $message_array[1], 'notice');
			}
			else{
				$this->setRedirect(JURI::base()."index.php?option=com_arrausermigrate&task=import&controller=import", $message_array[1]);
			}   
		}
		
	}

    //out from export tab
    function cancel(){
		$msg = JText::_( 'ARRA_OPERATION_CANCELED' );
		$this->setRedirect( 'index.php?option=com_arrausermigrate', $msg );
	}	
	
}
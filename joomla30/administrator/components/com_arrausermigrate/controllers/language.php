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
 * file: export.php
 *
 **** class 
     ArrausermigrateControllerLanguage
	 
 **** functions
     __construct();
	 language();
	 apply(); 
     save();
	 cancel();	  
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausermigrateControllerLanguage Controller
 */
class ArrausermigrateControllerLanguage extends ArrausermigrateController{
    var $_model = null;
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {   
		parent::__construct();
		//Register Extra tasks
	    $this->registerTask( 'language', 'language' );
	}
	
	function language(){
		JRequest::setVar( 'view', 'language' );
		JRequest::setVar( 'layout', 'default'  );		
		$model =& $this->getModel('language');		
		parent::display();
	}
	
	function apply(){
		$model = $this->getModel('language'); 
		if ($model->store() ) {
			$msg = "OK+".JText::_('ARRA_LANGUAGE_SAVED');
		} 
		else{
			$msg = "ERROR+".JText::_('ARRA_LANGUAGE_NOT_SAVED');
		}
		
		$message_array = explode("+", $msg);
		if(isset($message_array)){		    
			if(isset($message_array[0]) && $message_array[0]=="ERROR"){
				$this->setRedirect("index.php?option=com_arrausermigrate&task=language&controller=language", $message_array[1], 'notice');			  
			}
			else{
				$this->setRedirect("index.php?option=com_arrausermigrate&task=language&controller=language", $message_array[1]);
			}   
		}	
	}
	
	// save language file
	function save(){
	    $model = $this->getModel('language'); 
		if ($model->store() ) {
			$msg = "OK+".JText::_('ARRA_LANGUAGE_SAVED');
		} 
		else{
			$msg = "ERROR+".JText::_('ARRA_LANGUAGE_NOT_SAVED');
		}
		
		$message_array = explode("+", $msg);
		if(isset($message_array)){		    
			if(isset($message_array[0]) && $message_array[0]=="ERROR"){
				$this->setRedirect("index.php?option=com_arrausermigrate", $message_array[1], 'notice');			  
			}
			else{
				$this->setRedirect("index.php?option=com_arrausermigrate", $message_array[1]);
			}   
		}		
	}

    //out from language tab
    function cancel(){
		$msg = JText::_( 'ARRA_OPERATION_CANCELED' );
		$this->setRedirect( 'index.php?option=com_arrausermigrate', $msg );
	}	
	
}
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
     ArrausersmigrateControllerDelete
	 
 **** functions
     __construct();  
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausersmigrateControllerDelete Controller
 */
class ArrausermigrateControllerDelete extends ArrausermigrateController{
    var $_model = null;
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {   
		parent::__construct();
		//Register Extra tasks
	    $this->registerTask('', 'delete');
		$this->registerTask('cancel', 'cancel');
		$this->registerTask('delete', 'deleteUsers');
	}
	
	function delete(){
		JRequest::setVar('view', 'delete');
		JRequest::setVar('layout', 'default');					
		parent::display();
	}

    function cancel(){
		$msg = JText::_( 'ARRA_OPERATION_CANCELED' );
		$this->setRedirect( 'index.php?option=com_arrausermigrate', $msg );
	}	
	
	function deleteUsers(){
		$model = $this->getModel("delete");
		$status = $model->deleteUsers();
		$search = JRequest::getVar("search", "");
		$search_link = "";
		if(trim($search) != ""){
			$search_link = "&search=".trim($search);
		}
		if($status == true){
			$msg = JText::_("ARRA_DELETE_SUCCESSFULLY");
			$this->setRedirect('index.php?option=com_arrausermigrate&controller=delete'.$search_link, $msg);
		}
		else{
			$msg = JText::_("ARRA_DELETE_UNSUCCESSFULLY");
			$this->setRedirect('index.php?option=com_arrausermigrate&controller=delete'.$search_link, $msg, 'notice');
		}
	}
}

?>
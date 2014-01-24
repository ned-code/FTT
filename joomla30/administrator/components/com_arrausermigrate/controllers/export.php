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
     ArrausermigrateControllerExport 
	 
 **** functions
     __construct();
	 export();
	 exportFile();
	 cancel();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

/**
 * ArrausermigrateControllerExport Controller
 */
class ArrausermigrateControllerExport extends ArrausermigrateController{
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {	  
		parent::__construct();
		// Register Extra tasks
		$this->registerTask( 'export', 'export' );
		$this->registerTask( 'export_button', 'exportFile' );
		$this->registerTask( 'export_file', 'exportFile' );
		$this->registerTask( 'video', 'video' );
	}
	
	function video(){
   		JRequest::setVar( 'view', 'export' );
		JRequest::setVar( 'layout', 'video'  );
        $view = $this->getView("export", "html");
		$view->setLayout("video");
        $view->video();
        die();
    }    
	
	//set view for export tab
    function export(){
		JRequest::setVar( 'view', 'export' );
		JRequest::setVar( 'layout', 'default'  );		
		$model = $this->getModel('export');		
		parent::display();
	}
	
	//set model end request method for export command
	function exportFile(){
	    $model = $this->getModel('export');
		$model->export();
		$config = new JConfig();
		$this->setRedirect(Juri::base()."components/com_arrausermigrate/files/".$config->db."_users.zip");
	}

    //out from export tab
    function cancel(){
		$msg = JText::_( 'ARRA_OPERATION_CANCELED' );
		$this->setRedirect( 'index.php?option=com_arrausermigrate', $msg );
	}	
	
}
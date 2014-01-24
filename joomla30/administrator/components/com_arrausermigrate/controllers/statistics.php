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
     ArrausermigrateControllerStatistics
	 
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
 * ArrausermigrateControllerStatistics Controller
 */
class ArrausermigrateControllerStatistics extends ArrausermigrateController{
    var $_model = null;
	/**
	 * constructor (registers additional tasks to methods)
	 * @return void
	 */
	function __construct() {   
		parent::__construct();
		//Register Extra tasks
	    $this->registerTask('', 'statistics');
		$this->registerTask('cancel', 'cancel');
	}
	
	function statistics(){
		JRequest::setVar('view', 'statistics');
		JRequest::setVar('layout', 'default');					
		parent::display();
	}

    function cancel(){
		$msg = JText::_( 'ARRA_OPERATION_CANCELED' );
		$this->setRedirect( 'index.php?option=com_arrausermigrate', $msg );
	}	
	
}
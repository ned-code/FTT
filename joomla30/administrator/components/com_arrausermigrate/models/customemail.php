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
     ArrausermigrateModelCustomemail 
	 
 **** functions
     __construct();
     saveCustomEmail();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');

/**
 * ArrausermigrateModelCustomemail
 */
class ArrausermigrateModelCustomemail extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}

	//save language file 
    function saveCustomEmail(){
		$database =& JFactory::getDBO();

		$subject_template = JRequest::getVar("subject_template","","get","string");
		$from_email = JRequest::getVar("from_email","","get","string");
		$from_name = JRequest::getVar("from_name","","get","string");
		$sitename = JRequest::getVar("sitename","","get","string");
		$email_template = JRequest::getVar("email_template","","get","string");
		
		$sql = "select c.params from #__extensions c where c.element='com_arrausermigrate'";
		$database->setQuery($sql);
		$content = $database->loadResult();
		$total_array = array();
		
		if($content != NULL && trim($content) != "{}" && trim($content) != ""){
			$total_array = json_decode($content, true);												
		}
		
		$total_array["JoomlaExport"] =  "subject_template=".$subject_template.";\n".
										"from_email=".$from_email.";\n".				 
										"from_name=".$from_name.";\n".
										"sitename=".$sitename.";\n".
										"email_template=".$email_template.";";
			
		$sql = "update #__extensions c set params='".addslashes(json_encode($total_array))."' where c.element='com_arrausermigrate'";		  
		$database->setQuery($sql);
		if($database->query()){
			echo "+"."Email template successfully saved.";
		}
		else{
			echo "ERROR+"."Settings can't saved";
		}      
    } 	
}
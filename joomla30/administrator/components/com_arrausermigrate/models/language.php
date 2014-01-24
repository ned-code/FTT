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
 * file: language.php
 *
 **** class 
     ArrausermigrateModelLanguage 
	 
 **** functions
     __construct();
     store();
     fk_slashes();
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');

/**
 * ArrausermigrateModelLanguage
 */
class ArrausermigrateModelLanguage extends JModelLegacy{
	/**
	 * Constructor that retrieves the ID from the request
	 * @access	public
	 * @return	void
	 */
	function __construct(){		
		parent::__construct();
	}

	//save language file 
    function store(){
        $ok = false; 
		//$data = JRequest::getVar('language_file', '', 'post', 'string', JREQUEST_ALLOWHTML);
		$data = $_REQUEST["language_file"];		
		$language = JPATH_ROOT.DS."administrator".DS."language".DS."en-GB".DS."en-GB.com_arrausermigrate.ini";		
        $textbe = $this->fk_slashes($data);	
		$g = fopen ($language, "w");
		if(fwrite ($g, $textbe)){
		    $ok = true; 
		}		
		fclose ($g);
		return $ok;
    } 
	
	function fk_slashes($string){	
		while(strstr($string, '\\')) {
			$string=stripslashes($string);
		}
		return $string;
	}
}
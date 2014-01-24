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
 * file: default.php
 *
 **** class     
 **** functions
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
?>
     <table width="60%" class="adminlist">
        <?php foreach($this->columns as $key=>$value){
		           echo "<tr>";
				   echo    "<td width=\"15%\">";
				   echo        "<b>".$value."</b>";
				   echo    "</td>";
				   echo    "<td width=\"85%\">";
				   echo        JText::_("ARRA_MODAL_TIP_".strtoupper($value));
				   echo    "</td>";
				   echo "</tr>";
		      }
		?>	
	</table> 	 
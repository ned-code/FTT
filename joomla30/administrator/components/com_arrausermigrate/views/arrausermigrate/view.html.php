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
 * file: view.html.php
 *
 **** class 
     ArrausermigrateViewArrausermigrate 
	 
 **** functions
     display();
     setCriteriaUsers();
     setAbout();
	 countUsers(); 
     setListUsers();
     getPicture();
	 jomSocialStatistics();
	 existJomSocial();
	 
 */

// No direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport( 'joomla.application.component.view' );

/**
 * ArrausermigrateViewArrausermigrate
 * 
 * Class for displaing view for arra_user control panel.
 */
class ArrausermigrateViewArrausermigrate extends JViewLegacy{
	/**
	 * Method for display default view. 
	 * @return void
	 **/
	function display($tpl = null) {	     		 
		// make ToolBarHelper with name of component.		
		JToolBarHelper::title(   JText::_( 'ARRA_USER_EXPORT' ), 'generic.png' );
				
		// set users statistix slide
		$list = $this->setListUsers();		
		$this->assignRef('listUsers', $list);
		
		// set users criterias display
		$criteria = $this->setCriteriaUsers();		
		$this->assignRef('criteria', $criteria);
		
		// set about slide
		$about = $this->setAbout();		
		$this->assignRef('about', $about);				
		
		parent::display($tpl);
	}
	
	// set criteria display users
	function setCriteriaUsers(){
		$criteria = "";
		//complet the heder om radio box
		$criteria .= "<div class=\"row_criteria\">" .
						"<div class=\"left_radio_content\">" . 
							JText::_("ARRA_ACTIVE_USERS") . 
						"</div>" .
						"<div class=\"right_radio_content\">" . 
							JText::_("ARRA_AT_LEAST_ONE_VISIT") . 
						"</div>".
					"</div><br/>";
		
		// make radio box		
		$criteria .= "<div class=\"row_criteria\">".	
						"<div class=\"left_radio_content\">
							<input type=\"radio\" name=\"all_active_users\" value=\"all_active_users\" onclick=\"javascript:showAllActiveUsers()\"> 
						</div>".
						"<div class=\"right_radio_content\">
							<input type=\"radio\" name=\"at_least_one_visit\" value=\"at_least_one_visit\" onclick=\"javascript:showAtLeastOneVisit()\"> 
						</div>".
					"</div>";
		
		// zones for changes with ajax
		$criteria .= "<div class=\"row_criteria\">".
						"<div class=\"left_radio_content\" id=\"active_counts\">" . "" . 
						"</div>".
						"<div class=\"right_radio_content\" id=\"at_least_one_visit\">" . "" . 
						"</div>".
					 "</div><br/><br/><br/>"; 
		
		return $criteria;
	}
	
	//set dates about component
	function setAbout(){
	    $last_version = $this->get('LatestVersion');
	    $actual_version = $this->get('ActualVersion');
		$about = "";
		$msg = "";
		
		$about .= "<table width=\"100%\">";
		$about .= 		"<tr>";
		$about .= 			"<td align=\"center\">";
		if($actual_version == $last_version){
			$about .= '<img src="components/com_arrausermigrate/images/icons/checked.png" title="Latest Version" alt="Latest Version" />';
			$msg = JText::_("ARRA_LATEST_VERSION_MSG");
		}
		else{
			$about .= '<img src="components/com_arrausermigrate/images/icons/unchecked.png" title="Old Version" alt="Old Version" />';
			$msg = JText::_("ARRA_OLD_VERSION_MSG");
		}
		$about .= 			"</td>";
		$about .= 			"<td align=\"left\">";
		$about .= 				"<b style=\"color:#666666; font-size:15px;\">".$msg."</b>";
		$about .= 			"</td>";
		$about .= 		"</tr>";
		$about .= "</table>";
		
		$about .= "<table width=\"100%\">";
		$about .=	"<tr>";		
		$about .=		"<td>";		
		$about .=			"<table class=\"adminlist_about\">";
		$about .=              "<tr>";
		$about .=                 "<td>";
		$about .=                     "<b>Installed version</b>";
		$about .=                 "</td>";
		$about .=                 "<td>";
		$about .=                     $actual_version;
		$about .=                 "</td>";
		$about .=              "</tr>";
		
		//if(($actual_version != $last_version) && ($last_version != "ERROR")){
		if($last_version != "ERROR"){
			$about .=              "<tr>";
			$about .=                 "<td>";
			$about .=                     "<b>Latest Version</b>";
			$about .=                 "</td>";
			$about .=                 "<td>";
			$about .=                     "<a href=\"http://www.joomlarra.com/joomla-1.6-extensions/arra-user-export-import-for-joomla-1.6.html\" target=\"_blank\">".$last_version."</a>";
			$about .=                 "</td>";
			$about .=              "</tr>";
		}
		elseif($last_version == "ERROR"){
			$about .=              "<tr>";
			$about .=                 "<td>";
			$about .=                     "<b>Latest Version</b>";
			$about .=                 "</td>";
			$about .=                 "<td>";
			$about .=                     JText::_("ARRA_NO_CONNECTION_TO_LAST_VERSION");
			$about .=                 "</td>";
			$about .=              "</tr>";
		}
				
		$about .=              "<tr>";
		$about .=                 "<td>";
		$about .=                     "<b>Copyright</b>";
		$about .=                 "</td>";
		$about .=                 "<td>";
		$about .=                     "2010-2013 www.joomlarra.com";
		$about .=                 "</td>";
		$about .=              "</tr>";
		$about .=              "<tr>";
		$about .=                 "<td>";
		$about .=                     "<b>Licence</b>";
		$about .=                 "</td>";
		$about .=                 "<td>";
		$about .=                     "<a href=\"http://www.gnu.org/licenses/gpl-2.0.txt\" target=\"_blank\">GPL v2</a>";
		$about .=                 "</td>";
		$about .=              "</tr>";				
		$about .=           "</table>";		
		$about .=        "</td>";	
		$about .=     "</tr>";		
		$about .= "</table>";
		
		return $about;
	}
	
	//count all users where usertype is input parameter
	function countUsers($usertype){
		if($usertype == "deprecated"){
			$usertype = "Super Users";
		}
		$db =& JFactory::getDBO();
		$sql = "select count(*) from #__user_usergroup_map where group_id in (select id from #__usergroups where title='".$usertype."')";				
		$db->setQuery($sql);
		$content = $db->loadResult();		
		return $content;
	}
	
	// set users statistix
	function setListUsers(){	
	    // get user count
		$users_count = $this->get('UsersCount');				
		$list = "";				
		$array_user_type = $this->get('UserType');
		$count = "";
		$const = 0;
		$no_type_count = 0;
		if(isset($array_user_type) && is_array($array_user_type) && count($array_user_type)>0){
			foreach($array_user_type as $key=>$value){
				if($value['usertype'] == "deprecated"){
					$value['usertype'] = "Super Users";
				}		    
				$count = $this->countUsers($value['usertype']);			
				if($count != 0){
					$list .= "<div class=\"user_row\">
								<div class=\"user_type\">" .
									$value['usertype'] . 
							   "</div>" . 
							   "<div class=\"user_count\" >" . 
									$count . 
							   "</div>" . 
							   "<div class=\"user_percent\" >" . 
									number_format( (($count * 100) / $users_count), 2, '.', '') . "%" . 
							   "</div>" . 
							   "<div class=\"grafic_statistic\">" . 
									$this->getPicture(number_format( (($count * 100) / $users_count), 2, '.', '')) . 
							   "</div>" . 
							"</div><br/><br/>";
				} 
			}	
		}
        // no user type
		$no_type_count = $this->get('NoTypeCount');
		if($no_type_count != 0){
	        $list .= "<div class=\"user_row\">
						<div class=\"no_user_type\">" .
							JText::_("ARRA_NO_USER_TYPE") . 
						"</div>" . 
						"<div class=\"no_user_count\" >" . 
							$no_type_count . 
						"</div>" . 
						"<div class=\"no_user_percent\" >" . 
							number_format( (($no_type_count * 100) / $users_count), 2, '.', '') . "%" . 
						"</div>" .
						"<div class=\"grafic_statistic\">" . 
							$this->getPicture(number_format( (($no_type_count * 100) / $users_count), 2, '.', '')) . 
					   "</div>" . 						    
					 "</div><br/><br/>";
		}			   		
		return $list;		 
	}
	
	// function generate count bar
	function getPicture($value){	
	    $picture = "";
		$picture .= "<div class=\"all_users\"> ";
		$picture .= 	"<div class=\"calculate_users\" style=\"width:" . $value . "px; \"> &nbsp; ";
		$picture .= 	"</div>";
		$picture .= "</div>";
		return $picture;
	}
	
	function jomSocialStatistics(){
		$group_category = $this->get("GroupCategory");
		$groups = $this->get("Groups");
		$users_count = $this->get("Users");
		$block_users = $this->get("BlockUsers");
		$unblock_users = $this->get("UnblockUsers");
		$users_from_jomsocial = $this->get("JomSocialUsers");
		
		$color = "green";
		$published = 0;
		$unpublished = 0;
		
		$return  = "";
		
		$return .= "<table width=\"100%\">";
		$return .=    "<tr>";
		$return .=      "<td width=\"60%\"></td>";
		$return .=      "<td>";
		$return .=         "<div style=\"float:left; background-color:green; width:15px; height:15px;\"></div><div style=\"float:left; padding-left:5px;\">".JText::_("ARRA_PUBLISHED_COLOR")."</div>";
		$return .=      "</td>";
		$return .=    "</tr>";
		$return .=    "<tr>";
		$return .=      "<td width=\"60%\"></td>";
		$return .=      "<td>";
		$return .=         "<div style=\" float:left; background-color:red; width:15px; height:15px;\"></div><div style=\"float:left; padding-left:5px;\">".JText::_("ARRA_UNPUBLISHED_COLOR")."</div>";
		$return .=      "</td>";
		$return .=    "</tr>";
		$return .= "</table>";
		
		$return .= "<fieldset class=\"adminform\">";
		$return .= 	   "<legend>";
		$return .= 			"<span class=\"heading\">".JText::_("ARRA_GROUP_CATEGORY_STATISTICS")."</span>";
		$return .= 	   "</legend>";		
		$return .= "<table>";
		$return .=    "<tr>";
		$return .=      "<td width=\"30%\"><span class=\"heading\">".JText::_("ARRA_GROUP_CATEGORY_NAME")."</span></td>";
		$return .=      "<td width=\"25%\"><span class=\"heading\">".JText::_("ARRA_GROUP_COUNT")."</span></td>";
		$return .=      "<td><span class=\"heading\">".JText::_("ARRA_PERCENTE")."</span></td>";
		$return .=      "<td width=\"37%\"></td>";
		$return .=    "</tr>";
		$return .= "</table>";
		$return .= '<div class="user_statistic">';
		if(isset($group_category) && count($group_category)>0)
		foreach($group_category as $key=>$value){
			$return .= '<div class="user_row">';
			$return .=    '<div class="user_type">';
			$return .= 	     $value["name"];
			$return .=    '</div>';
			$return .=    '<div class="user_count">';
			$return .= 	     $value["total"];
			$return .=    '</div>';
			$return .=    '<div class="user_percent">';
			if(count($groups)>0){
				$return .= 	     number_format( (($value["total"] * 100) / count($groups)), 2, '.', '') . "%";
			}
			$return .=    '</div>';
			$return .=    '<div class="grafic_statistic">';
			if(count($groups)>0){
				$return .= $this->getPicture(number_format( (($value["total"] * 100) / count($groups)), 2, '.', ''));
			}
			else{
				$return .= "-";
			}
			$return .=    '</div>';
			$return .= '</div>';
		}
		$return .= '</div>';
		$return .= "</fieldset>";
		
		$return .= "<fieldset class=\"adminform\">";
		$return .= 	   "<legend>";
		$return .= 			"<span class=\"heading\">".JText::_("ARRA_GROUP_STATISTICS")."</span>";
		$return .= 	   "</legend>";		
		$return .= "<table>";
		$return .=    "<tr>";
		$return .=      "<td width=\"28%\"><span class=\"heading\">".JText::_("ARRA_GROUP_NAME")."</span></td>";
		$return .=      "<td width=\"24%\"><span class=\"heading\">".JText::_("ARRA_GROUP_CATEGORY_NAME")."</span></td>";
		$return .=      "<td width=\"29%\"><span class=\"heading\">".JText::_("ARRA_MEMBER_COUNT")."</span></td>";
		$return .=      "<td><span class=\"heading\">".JText::_("ARRA_PERCENTE")."</span></td>";
		$return .=    "</tr>";
		$return .= "</table>";
		$return .= '<div class="user_statistic">';	
		if(isset($groups) && count($groups)>0)	
		foreach($groups as $key=>$value){
			$class = "user_row";
			if($key == count($groups)-1){
				$class = "user_row_border";
			}
			$return .= '<div class="'.$class.'">';
			if($value["published"] == "1"){
				$color = "green";
				$published ++;
			}
			else{
				$color = "red";
				$unpublished ++;
			}
			$return .=    '<div class="user_type2" style="color:'.$color.'">';
			$return .= 	     $value["name"];
			$return .=    '</div>';
			$return .=    '<div class="user_type2">';
			$return .= 	     $value["cat_name"];
			$return .=    '</div>';
			$return .=    '<div class="user_count2">';
			$return .= 	     $value["membercount"];
			$return .=    '</div>';			
			$return .=    '<div class="user_percent2">';
			if($users_count>0){
				$return .= number_format( (($value["membercount"] * 100) / $users_count), 2, '.', '') . "%";
			}
			else{
				$return .= "0.00";
			}	
			$return .=    '</div>';
			$return .=    '<div class="grafic_statistic2">';
			if($users_count>0){
				$return .= $this->getPicture(number_format( (($value["membercount"] * 100) / $users_count), 2, '.', ''));
			}
			else{
				$return .= "-";
			}	
			$return .=    '</div>';
			$return .= '</div>';
		}
		$return .= '</div>';
		$return .= '<div class="user_statistic">';
		$return .=    '<div class="user_type">';
		$return .= 	     JText::_("ARRA_PUBLISHED");
		$return .=    '</div>';
		$return .=    '<div class="user_count">';
		$return .= 	     $published;
		$return .=    '</div>';
		$return .=    '<div class="user_percent">';
		if(count($groups)>0){
			$return .= number_format( (($published * 100) / count($groups)), 2, '.', '') . "%";
		}
		else{
			$return .= "0";
		}
		$return .=    '</div>';
		$return .=    '<div class="grafic_statistic">';
		if(count($groups)>0){
			$return .= $this->getPicture(number_format( (($published * 100) / count($groups)), 2, '.', ''));
		}
		else{
			$return .= "-";
		}
		$return .=    '</div>';
		$return .= '</div>';
		$return .= '<div class="user_statistic">';
		$return .=    '<div class="user_type">';
		$return .= 	     JText::_("ARRA_UNPUBLISHED");
		$return .=    '</div>';
		$return .=    '<div class="user_count">';
		$return .= 	     $unpublished;
		$return .=    '</div>';
		$return .=    '<div class="user_percent">';
		if(count($groups)>0){
			$return .= number_format( (($unpublished * 100) / count($groups)), 2, '.', '') . "%";
		}
		else{
			$return .= "0";
		}
		$return .=    '</div>';
		$return .=    '<div class="grafic_statistic">';
		if(count($groups)>0){
			$return .= 	     $this->getPicture(number_format( (($unpublished * 100) / count($groups)), 2, '.', ''));
		}
		else{
			$return .= "-";
		}
		$return .=    '</div>';
		$return .= '</div>';		
		$return .= "</fieldset>";
		
		$return .= "<fieldset class=\"adminform\">";
		$return .= 	   "<legend>";
		$return .= 			"<span class=\"heading\">".JText::_("ARRA_USERS_STATISTICS")."</span>";
		$return .= 	   "</legend>";				
		$return .= '<div class="user_statistic">';		
		$return .=   '<div class="user_row">';
		$return .=      '<div class="user_type">';
		$return .= 	       JText::_("ARRA_BLOCK");
		$return .=      '</div>';
		$return .=      '<div class="user_count">';
		$total =         count($block_users) > 0 ? $block_users["0"]["total"] : "0";
		$return .= 	     $total; 
		$return .=      '</div>';
		$return .=      '<div class="user_percent">';
		if($users_from_jomsocial > 0){
			$return .= number_format( (($total * 100) / $users_from_jomsocial), 2, '.', '') . "%";
		}
		else{
			$return .= "0.00";
		}
		$return .=      '</div>';
		$return .=      '<div class="grafic_statistic">';
		if($users_from_jomsocial > 0){
			$return .= $this->getPicture(number_format( (($total * 100) / $users_from_jomsocial), 2, '.', ''));
		}
		else{
			$return .= "-";
		}
		$return .=      '</div>';
		$return .=   '</div>';		
		$return .= '</div>';
		$return .= '<div class="user_statistic">';		
		$return .=   '<div class="user_row">';
		$return .=      '<div class="user_type">';
		$return .= 	       JText::_("ARRA_UNBLOCK");
		$return .=      '</div>';
		$return .=      '<div class="user_count">';		
		$total =         count($unblock_users) > 0 ? $unblock_users["0"]["total"] : "0";		
		$return .= 	     $total; 
		$return .=      '</div>';
		$return .=      '<div class="user_percent">';
		if($users_from_jomsocial > 0){	
			$return .= number_format( (($total * 100) / $users_from_jomsocial), 2, '.', '') . "%";
		}
		else{
			$return .= "0.00";
		}
		$return .=      '</div>';
		$return .=      '<div class="grafic_statistic">';
		if($users_from_jomsocial > 0){
			$return .= $this->getPicture(number_format( (($total * 100) / $users_from_jomsocial), 2, '.', ''));
		}
		else{
			$return .= "-";
		}
		$return .=      '</div>';
		$return .=   '</div>';		
		$return .= '</div>';
		$return .= "</fieldset>";
		
		return $return;
	}	
		
	function existJomSocial(){
		$result = $this->get("ExitJomsocial");
		return $result;
	}			
}
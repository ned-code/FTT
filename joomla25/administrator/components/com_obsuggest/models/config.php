<?php
/**
 * @version		$Id: config.php 201 2011-03-24 01:50:48Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."config.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."class.output.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.uservoice.php");
jimport('joomla.installer.helper');
class ModelConfig extends JModel {	
	private $output = null;
	private $gconfigs = null;
	
	function __construct() {
		parent::__construct();		
	}
	public function display() {
		$output = new Output();
		$config = Config::getConfig();
		$output->addProperty('config', $config);
		$this->setOutput($output->getOutput());

//		$uservoice = ExportImport::getAllAccountUserVoice();		
//		$this->output->account = $uservoice;

		$this->output->forum = $this->getForumTemp();
	}
	public function getForumTemp() {
		$forum = new stdClass();
		
		$forum = Config::getForumTemp();
		return $forum;
	}
	public function unpublish($_input) {
		foreach ($_input as $id) {
			ExportImport::setUnpublishedAccount($id);
		}
	}
	public function publish($_input) {
		foreach ($_input as $id) {
			ExportImport::setPublishedAccount($id);
		}
	}
	public function deleteAccountUserVoice($_input) {
		foreach ($_input as $id) {
			ExportImport::deleteAccount($id);
		}
	}
	public function setOutput($_value) {
		$this->output = $_value;
	}
	public function getOutput() {
		return $this->output;
	}

	public function save($_input) {
		$query = "			
			UPDATE `#__foobla_uv_config`
			SET `bad_word` ='".$_input->config->bad_word."'
			WHERE `id` = 1
		;";		
		DBase::querySQL($query);
		
		$query = "			
			UPDATE `#__foobla_uv_config`
			SET `listbox` ='".$_input->config->listbox."'
			WHERE `id` = 1
		;";		
		DBase::querySQL($query);

		$this->saveGconfig();
		$this->saveForumTemp($_input->forum);
	}

	public function saveForumTemp($_forum) {
		Config::saveForumTemp($_forum);
	}

	public function addUserVoiceSubdomain($_input) {
		$uservoice = new UserVoice( $_input->account->subdomain );
		$topic = $uservoice->getTopics();

		$uv 			= new stdClass();
		$uv->topics 	= $topic;
		$uv->subdomain 	= $_input->account->subdomain;
		
		$uservoice->getIdea( $uv );
		
		if ( $topic != NULL ) {
			ExportImport::addUserVoiceAccount( $_input );
		}
	}

	function getInfoConfig()
	{
		global $option;

		$db = &JFactory::getDBO();
		$query = "
			SELECT `id`
			FROM `#__components`
			WHERE `link` = 'option=$option'
		";
		$db->setQuery($query);
		$id = $db->loadResult();
		$query = "
			SELECT *
			FROM `#__jlord_core_config`
			WHERE `name` != 'check_firsttime'
		";
		$db->setQuery($query);
		$rows = $db->loadObjectList();
		
		$entities = array();
		foreach ($rows as $row)
			$entities[] = $row->name;
		
		$info 			= new stdClass();
		$info->entities	= $entities;
		$info->id		= $id;
		return $info;
	}
	
	/**
	 * Get Value from Name
	 *
	 * @param unknown_type $name
	 */
	function getConfigValue($name)
	{
		$db =& JFactory::getDBO();
		$query = "
			SELECT `value`
			FROM `#__jlord_core_config`
			WHERE `name` = '$name'
		";
		$db->setQuery($query);
		return $db->loadResult();
	}
	
	function saveInfoConfig($info)
	{	
		global $mainframe, $option;
		$db 		= &JFactory::getDBO();
		$entities	= $info->entities;
		$id			= $info->id;
		// update jlord_core_config table
		foreach ($entities as $entity) {
			$cName 	= substr($entity, 5);
			if (($entity	=='show_cpanel')
			OR ($entity =='show_langs')
			OR ($entity =='show_tools')
			OR ($entity =='show_upgrade')
			OR ($entity =='show_addons')
			OR ($entity =='show_import')
			OR ($entity =='show_items')) {	
				// get id from jos_componets table
				$query = "
					SELECT `id` FROM `#__components` WHERE `admin_menu_link` ='option=$option&controller=$cName'
				";
				$db->setQuery($query);
				$entity_id 	= $db->loadResult();
				$query = "
					UPDATE `#__jlord_core_config`
					SET `params` = 'option=$option&controller=$cName,$id,$entity_id'
					WHERE `name` = '$entity'
				";
				$db->setQuery($query);
				if(!$db->query()) return false;
			} else if ($entity == 'show_categories') {
				$query = "
					SELECT `id` FROM `#__components` WHERE `admin_menu_link` ='option=com_$cName&section=$option'
				";
				$db->setQuery($query);
				$entity_id 	= $db->loadResult();
				$query = "
					UPDATE `#__jlord_core_config`
					SET `params` = 'option=com_$cName&section=$option,$id,$entity_id'
					WHERE `name` = '$entity'
				";
				$db->setQuery($query);
				if (!$db->query()) return false;
			}
		}
	}

	/**
	 * Check first time 
	 *
	 * @return boolean
	 */
	function check_firsttime()
	{
		$db 	= &JFactory::getDBO();
		$query 	= "
			SELECT `value` FROM `#__jlord_core_config`
			WHERE `name` = 'check_firsttime'
		";
		$db->setQuery($query);
		$resval = $db->loadResult();
		if($resval)
		{
			return true;
		}
		return false;
	}
	
	function setCheck()
	{
		$db 	= &JFactory::getDBO();
		$query 	= "
			UPDATE `#__jlord_core_config`
			SET		`value` = '1'
			WHERE  `name` 	= 'check_firsttime'
		";
		$db->setQuery($query);
		$db->query(); 
	}

	/**
	 * getDataConfig
	 *
	 */
	function saveDataConfig()
	{
		$db = &JFactory::getDBO();
		$entities = array();
		$entities['show_config'] 				= JRequest::getVar('show_config');
		$entities['show_cpanel']				= JRequest::getVar('show_cpanel');
		$entities['show_langs'] 				= JRequest::getVar('show_langs');
		$entities['show_tools'] 				= JRequest::getVar('show_tools');
		$entities['show_import'] 				= JRequest::getVar('show_import');
		$entities['show_items'] 				= JRequest::getVar('show_items');
		$entities['show_upgrade'] 				= JRequest::getVar('show_upgrade');
		$entities['show_phplist'] 				= JRequest::getVar('show_phplist');
		$entities['show_categories'] 			= JRequest::getVar('show_categories');
		$entities['show_addons'] 				= JRequest::getVar('show_addons');
		$entities['show_cpanel_info'] 			= JRequest::getVar('show_cpanel_info');
		$entities['show_cpanel_latestfaqs'] 	= JRequest::getVar('show_cpanel_latestfaqs');
		$entities['show_cpanel_addons'] 		= JRequest::getVar('show_cpanel_addons');
		$entities['show_cpanel_latestitems']	= JRequest::getVar('show_cpanel_latestitems');
		
		$tmps['show_config'] 					= 'show_config';
		$tmps['show_cpanel']					= 'show_cpanel';
		$tmps['show_langs'] 				  	= 'show_langs';
		$tmps['show_tools'] 					= 'show_tools';
		$tmps['show_import'] 					= 'show_import';
		$tmps['show_items'] 					= 'show_items';
		$tmps['show_upgrade'] 					= 'show_upgrade';
		$tmps['show_phplist'] 					= 'show_phplist';
		$tmps['show_categories'] 				= 'show_categories';
		$tmps['show_addons'] 					= 'show_addons';
		$tmps['show_cpanel_info'] 				= 'show_cpanel_info';
		$tmps['show_cpanel_latestfaqs'] 		= 'show_cpanel_latestfaqs';
		$tmps['show_cpanel_addons'] 			= 'show_cpanel_addons';
		$tmps['show_cpanel_latestitems']	 	= 'show_cpanel_latestitems';
		foreach ($tmps as $tmp) {
			$query = "
				UPDATE `#__jlord_core_config`
				SET 	`value` = '".$entities[$tmp]."'
				WHERE 	`name` 	= '".$tmp."'
			";	
			$db->setQuery($query);
			$db->query();
		}
	}
	
	/**
	 * 
	 */
	function saveConfig()
	{	
		global $mainframe, $option;
		$db 	= &JFactory::getDBO();
		$query 	= "
			SELECT * FROM `#__jlord_core_config`
			WHERE `name` != 'check_firsttime'
		";
		$db->setQuery($query);
		$resvals = $db->loadObjectList();
		foreach ($resvals as $resval) {	
			if (($resval->name =='show_cpanel')
					OR ($resval->name =='show_langs')
					OR ($resval->name =='show_tools')
					OR ($resval->name =='show_import')
					OR ($resval->name =='show_upgrade')
					OR ($resval->name =='show_addons')
					OR ($resval->name =='show_items')
					OR ($resval->name == 'show_categories')) {
				$param 	= $resval->params;
				$arr	= explode(',',$param);
				if ($resval->value) {

					$query = "
						UPDATE `#__components`
						SET `enabled` 			= 1,
						 	`admin_menu_link` 	= '".$arr[0]."'
						WHERE `id`				= '".$arr[2]."' 
					";
					$db->setQuery($query);
					$db->query();
				} else {
					$query = "
						UPDATE `#__components`
						SET `enabled` 			= 0,
						 	`admin_menu_link` 	= ''
						WHERE `id`				= '".$arr[2]."' 
					";
					$db->setQuery($query);
					$db->query();
				}
			}
		}
	}
	
	function saveLicense()
	{
		$license = JRequest::getVar('license');
		$db =& JFactory::getDBO();
		$query = "
			UPDATE `#__jlord_core_config`
			SET `value` = '$license'
			WHERE `name` = 'license'
		";
		$db->setQuery($query);
		$db->query();
	}
	
	function checkExistsPhpLists() {
		$query = "
			select 
				id, 
				phplist_path, 
				phplist_id, 
				phplist_attribute, 
				phplist_htmlemail, 
				displaydescription
	 
			from 
				#__jlord_phplist_config 
		";
		$this->_db->setQuery($query);
		$phplist_config = $this->_db->loadObject();
		if ($phplist_config) {
			$phplist_config_path = $phplist_config->phplist_path;
			
			if( file_exists(JPath::clean($phplist_config_path.'/config/config.php'))){
				require($phplist_config_path.'/config/config.php');
				$link = mysql_connect($database_host, $database_user, $database_password);
				if(!$link){
					return false;
				}
			} else {
				return false;
			}
		}
		return false;
	}
	/**
	* function getDatetimeConfig
	* date: 2010 Jan 18
	* created Tu Nguyen
	*/
	function getDatetimeList(){
		$sql = "
			SELECT * FROM #__foobla_uv_datetime_config
		";
		return DBase::getObjectList($sql);
	}
	
	function getDatetimeListHtml(){
		$list = $this->getDatetimeList();
		//$groups = $this->getUserGroups();
	
		return JHTML::_('select.genericlist', $groups, 'lst_forums_id', 'size=10', 'id', 'name', $_current_id);
	}
	function addDatetime($value, $description, $default = 0, $id = null){
		if(!$id){
			$sql = "
				INSERT INTO #__foobla_uv_datetime_config(`value`, `description`, `default`)
				VALUE('".$value."', '".$description."', '".$default."')
			";
		}else{
			$sql = "
				UPDATE #__foobla_uv_datetime_config
				SET `description` = '{$description}',
				`value` = '{$value}'
				WHERE id = {$id}
			";
		}
		$db = JFactory::getDBO();
		$db->setQuery($sql);
		$db->query();		
		
		$sql = "
				SELECT max(id) as max FROM #__foobla_uv_datetime_config
			";		
		return DBase::getObject($sql)->max;			
	}
	function getDatetimeInfo($id){		
		$sql = "
			SELECT * FROM #__foobla_uv_datetime_config
			WHERE id = {$id}
		";
		return DBase::getObject($sql);			
	}

	function removeDatetime($id){		
		$sql = "
			DELETE FROM #__foobla_uv_datetime_config
			WHERE id = {$id}
		";
		return DBase::getObject($sql);			
	}

	function setDefaultDatetime($id){	
		$db = JFactory::getDBO();				
		$sql = "
			UPDATE #__foobla_uv_datetime_config
			SET `default` = 0
			WHERE  `default`= 1";
		$db->setQuery($sql);
		$db->query();		
		$sql = "
			UPDATE #__foobla_uv_datetime_config
			SET `default` = 1
			WHERE  id = {$id}
		";
		$db->setQuery($sql);
		$db->query();	
	}

	function getGConfig() {
		if( !$this->gconfigs ) {
			$db 	= &JFactory::getDbo();
			$query 	= "SELECT * FROM `#__foobla_uv_gconfig`";
			$db->setQuery( $query );
			$this->gconfigs = $db -> loadObjectList('key');
		}
		return $this->gconfigs;
	}

	function saveGconfig() {
		$gconfig = &JRequest::getVar('gconfig');

		if( ! is_array( $gconfig ) ) {
			return;
		}
		$keys = array_keys( $gconfig );
		$db = &JFactory::getDbo();
		foreach ( $keys as $key ) {
			$query = "REPLACE INTO `#__foobla_uv_gconfig`(`key`,`value`) VALUES('$key', '".$gconfig[$key]."')";
			$db -> setQuery( $query );
			$db->query();
		}
	}
	
	function getGConfigByKey( $key='' ) {

		if(!$this->gconfigs ) {
			$this->getGConfig();
		}

		if(isset($this->gconfigs[$key]->value)){
			return $this->gconfigs[$key]->value;
		}

		return null;
	}
}
?>
<?php
class SiteSettings {
	/**
	*
	*/
	public function getMainTabContent(){
		$sql = "SELECT * FROM #__mb_system_settings WHERE type='main' ORDER BY priority";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$s_array = $db->loadAssocList();
		$string = '<table>';
		for($i=0;$i<sizeof($s_array);$i++){
			$string .= '<tr>';
				$string .= '<td><div class="site-settings-label">'.ucfirst(strtolower(trim($s_array[$i]['name']))).':</div></td>';
				if($s_array[$i]['name'] == 'discription'){
					$string .= '<td><div class="site-settings-textarea"><textarea id="'.$s_array[$i]['uid'].'" name="'.$s_array[$i]['name'].'">'.$s_array[$i]['value'].'</textarea></div></td>';
				}
				else{
					$string .= '<td><div class="site-settings-input"><input id="'.$s_array[$i]['uid'].'" name="'.$s_array[$i]['name'].'" type="text" value="'.$s_array[$i]['value'].'"></div></td>';
				}
			$string .= '</tr>';
		}
		$string .= '<tr><td colspan="2"><div class="site-settings-save"><input type="button" value="Save"></div></td></tr>';
		$string .= '</table>';
		return $string;
	}	
	
	/**
	*
	*/
	private function getLanguageOption($selected){
		$sql = "SELECT * FROM #__mb_system_language";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$s_array = $db->loadAssocList();
		$string = '';
		for($i=0;$i<sizeof($s_array);$i++){
			if($selected == $s_array[$i]['value']) {
				$string .= '<option selected value="'.$s_array[$i]['value'].'">'.$s_array[$i]['name'].'</option>';
			}
			else{
				$string .= '<option value="'.$s_array[$i]['value'].'">'.$s_array[$i]['name'].'</option>';
			}
		}
		$string .= '<option value="add">Add new language</option>';
		return $string;
	}
	
	/**
	*
	*/
	private function objectsIntoArray($arrObjData, $arrSkipIndices = array()){
		$arrData = array();
   
		// if input is object, convert into array
		if (is_object($arrObjData)) {
			$arrObjData = get_object_vars($arrObjData);
		}
		
		if (is_array($arrObjData)) {
			foreach ($arrObjData as $index => $value) {
				if (is_object($value) || is_array($value)) {
					$value = $this->objectsIntoArray($value, $arrSkipIndices); // recursive call
				}
				if (in_array($index, $arrSkipIndices)) {
					continue;
				}
				$arrData[$index] = $value;
			}
		}
		return $arrData;
	}
	
	/**
	*
	*/
	private function checkLanguage($value){
		$sql = "SELECT * FROM #__mb_system_language WHERE value='".$value."'";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$result = $db->loadAssocList();
		if(isset($result[0])){	return true; }
		return false;
	}
	
	/**
	*
	*/
	private function deleteDir($dirname) {
		if (is_dir($dirname))
			$dir_handle = opendir($dirname);
		if (!$dir_handle)
			return false;
		while($file = readdir($dir_handle)) {
			if ($file != "." && $file != "..") {
				if (!is_dir($dirname."/".$file))
					unlink($dirname."/".$file);
			else
				$this->deleteDir($dirname.'/'.$file);    
			}
		}
		closedir($dir_handle);
		rmdir($dirname);
		return true;
	}
	
	/**
	*
	*/
	private function addModuleLangPack($a, $xmlStr, $flag=false){
		$db =& JFactory::getDBO();
		$db->setQuery("SELECT * FROM #__mb_system_language WHERE value='".$a['type']."'");
		$s_array = $db->loadAssocList();
		if(!isset($s_array[0])){ return false; }
		//db
		if($flag){
			$sql = "UPDATE `#__mb_system_modules_language` SET `version` = '".$a['version']."' WHERE lang_type='".$a['type']."' AND mod_name='".$a['module_name']."'";
		}else{
			$sql = "INSERT INTO `#__mb_system_modules_language` (`uid` ,`lang_type` ,`mod_name` ,`author` ,`version`)VALUES(NULL , '".$a['type']."', '".$a['module_name']."', '".$a['author']."', '".$a['version']."')";
		}	
		$db->setQuery($sql);
		$db->query();
		//dir
		file_put_contents(JPATH_ROOT."\\components\\com_manager\\language\\".$a['type']."\\".$_FILES["userfile"]["name"], $xmlStr);	
	}
	
	/**
	*
	*/
	public function getModulesList($option){
		$sql = "SELECT * FROM #__mb_system_modules_language WHERE lang_type='".$option."'";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$s_array = $db->loadAssocList();
		$table = '<table>';
		for($i=0;$i<sizeof($s_array);$i++){
			$table .= '<tr>';
				$table .= '<td>';
					$table .= '<div class="site-settings-modules-label">'.$s_array[$i]['lang_type'].'.mod_'.$s_array[$i]['mod_name'].'.xml</div>';
				$table .= '</td>';
				$table .= '<td>';
					$table .= '<div class="site-settings-modules-delete" id="'.$s_array[$i]['lang_type'].'.mod_'.$s_array[$i]['mod_name'].'.xml">&nbsp;</div>';
				$table .= '</td>';
			$table .= '</tr>';
		}
		$table .= '</table>';
		return $table;
	}
	
	/**
	*
	*/
	public function getLanguageTabContent(){
		$sql = "SELECT * FROM #__mb_system_settings WHERE type='language' ORDER BY priority";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$s_array = $db->loadAssocList();
		$string = '<table>';
		for($i=0;$i<sizeof($s_array);$i++){
			switch($s_array[$i]['name']){
				case 'language_select':
					$string .= '<tr>';
					$string .= '<td><div class="site-settings-label">Language:</div></td>';
						$string .= '<td><div class="site-settings-select"><select>'.$this->getLanguageOption($s_array[$i]['value']).'</select></div><div class="site-settings-delete">&nbsp;</div></td>';
					$string .= '</tr>';
				break;
			}
		}
		$string .= '<tr>';
			$string .= '<td><div class="site-settings-label">Upload language for module:</div></td>';
			$string .= '<td><form id="uploadLangPack" enctype="multipart/form-data" target="iframe:settings" action="index.php?option=com_manager&amp;task=callMethod&amp;module=site_settings&amp;class=SiteSettings&amp;method=upload&amp;args=" method="POST"><input name="userfile" type="file">&nbsp;<input type="submit" value="Upload"></form></td>';
		$string .= '</tr>';
		$string .= '<tr><td colspan="2"><div class="site-settings-modules">'.$this->getModulesList($s_array[0]['value']).'</div></td></tr>';
		$string .= '<tr><td colspan="2"><div class="site-settings-save"><input type="button" value="Save"></div></td></tr>';
		$string .= '</table>';
		return $string;
		die;
	}

	/**
	*
	*/
	public function getColorTabContent(){
		$sql = "SELECT * FROM #__mb_system_settings WHERE type='color' ORDER BY priority";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$s_array = $db->loadAssocList();
		$string = '<table>';
		for($i=0;$i<sizeof($s_array);$i++){
			$string .= '<tr>';
				$string .= '<td><div class="site-settings-label">'.ucfirst(strtolower(trim($s_array[$i]['name']))).':</div></td>';
				$string .= '<td><div class="site-settings-input"><input id="'.$s_array[$i]['uid'].'" name="'.$s_array[$i]['name'].'" type="text" value="'.$s_array[$i]['value'].'"></div></td>';
			$string .= '</tr>';
		}
		$string .= '</table>';
		return $string;
	}	
	
	
	
	/**
	*
	*/
	public function saveParam($params){
		$item = explode(':', $params);
		$db =& JFactory::getDBO();
		$db->setQuery("UPDATE `#__mb_system_settings` SET `value` = '".$item[1]."' WHERE `uid` = '".$item[0]."'");
		$db->query();
	}
	
	/**
	*
	*/
	public function saveParams($p_string){
		$p_array = explode(';', $p_string);
		$db =& JFactory::getDBO();
		for($i=0;$i<sizeof($p_array);$i++){
			$item = explode(':', $p_array[$i]);
			$db->setQuery("UPDATE `#__mb_system_settings` SET `value` = '".$item[1]."' WHERE `uid` = '".$item[0]."'");
			$db->query();
		}	
	}
	
	/**
	*
	*/
	public function setLanguage($param){
		$db =& JFactory::getDBO();
		$db->setQuery("UPDATE `#__mb_system_settings` SET `value` = '".$param."' WHERE `name` = 'language_select'");
		$db->query();
	}
	
	/**
	*
	*/
	public function upload(){
		$xmlStr = file_get_contents($_FILES["userfile"]["tmp_name"]);
		$xmlObj = simplexml_load_string($xmlStr);
		$array = $this->objectsIntoArray($xmlObj);
		$db =& JFactory::getDBO();
		$db->setQuery("SELECT * FROM #__mb_system_modules_language WHERE lang_type='".$array['install']['type']."' AND mod_name='".$array['install']['module_name']."'");
		$s_array = $db->loadAssocList();
		if(isset($s_array[0])){
			if($array['install']['version'] > $s_array[0]['version']){
				$this->addModuleLangPack($array['install'], $xmlStr, true);
			}
		}
		else{
			$this->addModuleLangPack($array['install'], $xmlStr);
		}
	}
	
	/**
	*
	*/
	public function addNewLanguage($args){
		$p = explode(';', $args);
		if(!$this->checkLanguage($p[1])){
			//set row in table_db
			$db =& JFactory::getDBO();
			$db->setQuery("INSERT INTO #__mb_system_language (`uid` ,`name` ,`value`) VALUES (NULL , '".$p[0]."', '".$p[1]."')");
			$db->query();
			//create dir 
			$path = JPATH_ROOT."\\components\\com_manager\\language\\";
			mkdir($path."\\".$p[1]);
		}		
	}
	
	/**
	*
	*/
	public function deleteLanguage($args){
		if($this->checkLanguage($args)){
			//delete row in table_db
			$sql = "DELETE FROM #__mb_system_language WHERE `value` = '".$args."'";
			$db =& JFactory::getDBO();
			$db->setQuery($sql);
			$db->query();
			//detele dir
			$path = JPATH_ROOT."\\components\\com_manager\\language\\";
			$this->deleteDir($path."\\".$args);
		}
	}
	
	/**
	*
	*/
	public function deleteModuleLanguage($args){
		$parts = explode('.', $args);
		$type = $parts[0];
		$mod_name = str_replace('mod_' ,'',$parts[1]);
		//db
		$sql = "DELETE FROM `#__mb_system_modules_language` WHERE lang_type='".$type."' AND mod_name='".$mod_name."'";
		$db =& JFactory::getDBO();
		$db->setQuery($sql);
		$db->query();
		//dir
		$path = JPATH_ROOT."\\components\\com_manager\\language\\";
		unlink($path."\\".$type."\\".$args);
	}
}
?>

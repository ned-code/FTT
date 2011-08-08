<?php
class SiteSettings {
	protected $host;

	/**
	*
	*/
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function write_ini_file($path, $arr){
		$string = '';
		foreach($arr as $key => $part){
			$string .= '['.$key.']'.PHP_EOL;
			foreach($part as $k => $value){
				$string .= $k.'="'.$value.'"'.PHP_EOL;
			}
		}
		file_put_contents($path, $string);
	}
	
	protected function parse_ini($moduleName, $arr){
		$titles = array();
		$values = array();
		$arr2 = array();
		foreach($arr as $key => $value){
			$arr2[$key] = $value;
			if(strpos($key, 'title')!==false&&!empty($value)) {
				$mn = explode('_',$moduleName);
				$mn = strtoupper((sizeof($mn)==2)?$mn[0].$mn[1]:$mn[0]);
				$title = 'COM_MANAGER_'.$mn.'_'.strtoupper($value);
				$titles[] = $title;
			}
			if(strpos($key, 'value')!==false&&!empty($value)) { $values[] = $value; }
		}
		if( (sizeof($titles)==0||sizeof($values)==0)||(sizeof($titles)!=sizeof($values)) ) return false;
		return array($moduleName=>array_combine($titles, $values));
	}
	
	public function getModules($args){
		$path = JPATH_ROOT.DS.'language'.DS.$args.DS.$args.'.com_manager.ini';
		$parse = parse_ini_file($path, true);
		$db = & JFactory::getDBO();
		$sql = "SELECT id,name,title FROM #__mb_modules WHERE is_system='0'";
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		$modules = array();
		foreach($rows as $row){
			$modules[$row['name']] = array('id'=>$row['id'],'name'=>$row['name'],'title'=>$row['title']);
		}
		return json_encode(array('parse'=>$parse,'modules'=>$modules));
	}
	
	public function getLanguages(){
		$db = & JFactory::getDBO();
		$sql = 'SELECT lang_id,lang_code,title,title_native,sef,image,published FROM #__languages';
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		return json_encode($rows);
	}
	
	public function setLanguage($args){
		list($method, $langType, $moduleName) = explode(';', $args);
		$path = JPATH_ROOT.DS.'language'.DS.$langType.DS.$langType.'.com_manager.ini';
		$ini = parse_ini_file($path, true);		
		switch($method){
			case "new":
			case "update":
				if($_FILES['upload']['size'] != 0){
					$upload_ini = parse_ini_file($_FILES['upload']['tmp_name'],true);
				} else {
					$upload_ini = $this->parse_ini($moduleName, $_POST);
				}
				if(sizeof($upload_ini)>1||$moduleName!=key($upload_ini)) return json_encode(false);
				$diff = array_diff_assoc($ini, $upload_ini);
				$result = array_merge($diff, $upload_ini);
			break;
			
			case "delete":
				if(!array_key_exists($moduleName, $ini)) return json_encode(false);
				unset($ini[$moduleName]);
				$result = $ini;
			break;
		}
		$this->write_ini_file($path, $result);
		return json_encode(array('upload_ini'=>$upload_ini,'result'=>$result));
	}
}
?>

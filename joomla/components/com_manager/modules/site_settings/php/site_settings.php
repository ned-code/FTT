<?php
class SiteSettings {
	protected $host;

	/**
	*
	*/
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function getModuleNameByLangFile($language_file){
		$parts = explode('.', $language_file);
		return $parts[sizeof($parts)-2];
	}
	
	protected function write_ini_file($path, $arr){
		$string = '';		
		foreach($arr as $var){
			$string .= $var->name.'="'.$var->value.'"'.PHP_EOL;
		}
		return file_put_contents($path, $string);
	}
	
	public function getModules(){
		$db =& JFactory::getDBO();
		$sql_string = "SELECT id, name, title, description FROM #__mb_modules WHERE is_system='0'";
		//$sql = $this->host->gedcom->sql($sql_string);
		$db->setQuery($sql_string);
        	$modules_table = $db->loadAssocList();
		return json_encode(array('modules'=>$modules_table));
	}
	
	public function getLanguages($module_name){
		$jpath = $this->host->getAbsoluePath();
		$module_path = $jpath.DS.'components'.DS.'com_manager'.DS.'modules'.DS.$module_name.DS.'language';
		$lang_files = array();
		if(is_dir($module_path)&&$dh = opendir($module_path)) {
			while (($file = readdir($dh)) !== false) {
				if($file!='.'&&$file!='..'&&$file!='index.html'){
					$file_parts = explode('.', $file);
        				$end_file_part = end($file_parts);
        				if($end_file_part=='ini'){
        					$lang_files[] = $file;
        				}
				}
			}
			closedir($dh);
			return json_encode(array('success'=>array('lang_files'=>$lang_files)));	
		}
		return json_encode(array('error'=>'module dir not found.'));
	}
	
	public function getVariables($language_file){
		$jpath = $this->host->getAbsoluePath();		
		$module_name = $this->getModuleNameByLangFile($language_file);
		$file_path = $jpath.DS.'components'.DS.'com_manager'.DS.'modules'.DS.$module_name.DS.'language'.DS.$language_file;
		$ini_array = parse_ini_file($file_path);
		return json_encode(array('success'=>array('variables'=>$ini_array)));
	}
	
	public function saveVatiables($json_string){
		$args = json_decode($json_string);
		$jpath = $this->host->getAbsoluePath();		
		$module_name = $this->getModuleNameByLangFile($args->language_file);
		$file_path = $jpath.DS.'components'.DS.'com_manager'.DS.'modules'.DS.$module_name.DS.'language'.DS.$args->language_file;
		$result = $this->write_ini_file($file_path, $args->variables);	
		return json_encode(array('result'=>$result));
	}
}
?>

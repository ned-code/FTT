<?php
class SiteSettings {
	protected $host;

	/**
	*
	*/
	public function __construct(){
		$this->host = new Host('Joomla');
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
}
?>

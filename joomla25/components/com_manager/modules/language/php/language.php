<?php
class JMBLanguage {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
	
	public function getLanguages(){
		$db = new JMBAjax();
		$sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language";
		$db->setQuery($sql_string);
		$rows = $db->loadAssocList();
		return json_encode(array('languages'=>$rows));
	}
	
	public function setLanguage($lang_id){
		$db = new JMBAjax();
		$sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language WHERE lang_id = ?";
		$db->setQuery($sql_string, $lang_id);
		$rows = $db->loadAssocList();
		if($rows==null) return json_encode(array('error'=>'Not found this language...'));
		$_SESSION['jmb']['language'] = $rows[0]['lang_code'];
		return json_encode(array('success'=>array('lang'=>$rows[0])));
	}
}
?>

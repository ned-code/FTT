<?php
class JMBLanguage {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function getLanguages(){
		$db =& JFactory::getDBO();
		$sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language";
		$sql = $this->host->gedcom->sql($sql_string);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		return json_encode(array('languages'=>$rows));
	}
	
	public function setLanguage($lang_id){
		$db =& JFactory::getDBO();
		$sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language WHERE lang_id = ?";
		$sql = $this->host->gedcom->sql($sql_string, $lang_id);
		$db->setQuery($sql);
		$rows = $db->loadAssocList();
		if($rows==null) return json_encode(array('error'=>'Not found this language...'));
		$_SESSION['jmb']['language'] = $rows[0]['lang_code'];
		return json_encode(array('success'=>array('lang'=>$rows[0])));
	}
}
?>

<?php
class JMBLogin {
	protected $host;
	protected $db;
	
	public function __construct(){		
		$this->host = new Host('Joomla');
		$this->db = new JMBAjax();
	}
	
	protected function getNotifications($tree_id, $gedcom_id){
		$sql_string = "SELECT id,data,status FROM #__mb_notifications WHERE tree_id = ? AND gedcom_id = ? AND processed = 0";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		return $rows;
	}
	
	protected function getUsertreeData(){
		$session = JFactory::getSession();
		
		$tree_id = $session->get('tree_id');
		$facebook_id = $session->get('facebook_id');
		$gedcom_id = $session->get('gedcom_id');
		$permission = $session->get('permission');
		
		if(!empty($tree_id)&&!empty($gedcom_id)){
			$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
			$users = $this->host->usertree->getMembers($tree_id);
			return array('tree_id'=>$tree_id,'facebook_id'=>$facebook_id,'gedcom_id'=>$gedcom_id,'permission'=>$permission,'users'=>$users,'pull'=>$usertree);
		} 
		return false;
	}
	
	public function user(){
		$session = JFactory::getSession();
		
		$lang = $session->get('language');
		$gedcom_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');
		
		$languages = $this->host->getLanguages();
		$data = $this->getUsertreeData();
		
		$notifications = $this->getNotifications($tree_id, $gedcom_id);
		return json_encode(array('default_language'=>$lang, 'languages'=>$languages,'notifications'=>$notifications,'usertree'=>$data));
	}
	public function famous($args){
		if($args == 'logout'){			
			$session = JFactory::getSession();
			$session->clear('gedcom_id');
			$session->clear('tree_id');
			$session->clear('permission');
			$session->clear('facebook_id');
			$session->set('alias', 'famous-family');
			return true;
		}
	}
	public function language($lang_code){
		$session = JFactory::getSession();
		$session->set('language', $lang_code);
		return json_encode(array('success'=>$lang_code));
	}
}
?>

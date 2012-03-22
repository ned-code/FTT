<?php
class JMBLogin {
	protected $host;
	protected $db;
	
	public function __construct(){		
		$this->host = new Host('Joomla');
		$this->db = new JMBAjax();
	}
	
	protected function getNotifications($tree_id, $gedcom_id){
		$sql_string = "SELECT id,data,status FROM #__mb_notifications WHERE tree_id = ? AND gedcom_id = ?";
		$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		$rows = $this->db->loadAssocList();
		return $rows;
	}
	
	public function user(){
		$session = JFactory::getSession();
		$gedcom_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');
		$lang = $session->get('language');
		
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		$languages = $this->host->getLanguages();
		
		$tree_members = $this->host->usertree->getMembers($tree_id);
		
		$notifications = $this->getNotifications($tree_id, $gedcom_id);
		
		return json_encode(array('tree_members'=>$tree_members, 'user_id'=>$gedcom_id, 'notifications'=>$notifications, 'usertree'=>$usertree, 'default_language'=>$lang, 'languages'=>$languages));
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

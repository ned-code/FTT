<?php
class JMBRecentVisitors {
	/**
	*
	*/
	protected $host;
	/**
	*
	*/
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	/**
	*
	*/
	protected function _sort(&$last_login_users, $usertree){
		$objects = array();
		foreach($last_login_users as $user){
			$id = $user['id'];
			if(!isset($usertree[$id])){
				unset($usertree[$id]);
			} else {
				$objects[$id] = $usertree[$id];
			}
		}
		return $objects;
	}
	/**
	*
	*/
	public function getRecentVisitors(){		
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$owner_id = $session->get('gedcom_id');
        	$tree_id = $session->get('tree_id');
        	$permission = $session->get('permission');

		if(!$facebook_id||!$owner_id) return json_encode(array('error'=>'not register user'));
				
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$user = $usertree[$owner_id];
		$language = $this->host->getLangList('recent_visitors');
		$time = date('Y-m-d H:i:s');
		$last_login_users = $this->host->gedcom->individuals->getLastLoginMembers($tree_id);
		$objects = $this->_sort($last_login_users, $usertree);

		return json_encode(array(
			'config'=>$config,
			'user'=>$user,
			'lang'=>$language,
			'objects'=>$objects,
			'time'=>$time
		));	
	}
}
?>

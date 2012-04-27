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
	public function getRecentVisitors(){		
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$owner_id = $session->get('gedcom_id');
        $tree_id = $session->get('tree_id');

		if(!$facebook_id||!$owner_id) return json_encode(array('error'=>'not register user'));

		$language = $this->host->getLangList('recent_visitors');
		$time = date('Y-m-d H:i:s');
		$last_login_users = $this->host->gedcom->individuals->getLastLoginMembers($tree_id);
		return json_encode(array(
			'language'=>$language,
			'objects'=>$last_login_users,
			'time'=>$time
		));	
	}
}
?>

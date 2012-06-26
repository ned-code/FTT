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
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
	/**
	*
	*/
	public function getRecentVisitors(){
        $userMap = $this->host->getUserMap();
        $owner_id = $userMap['gedcom_id'];
        $tree_id = $userMap['tree_id'];
        $facebook_id = $userMap['facebook_id'];

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

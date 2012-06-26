<?php
class JMBAncestors {	
	
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
	
	public function get($indKey){
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$owner_id = $session->get('gedcom_id');
        	$tree_id = $session->get('tree_id');
        	$permission = $session->get('permission');
        	
        	$settings = $session->get('settings');
        	$alias = $session->get('alias');
        	$login_method = $session->get('login_method');

		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$user = $usertree[$owner_id];
		return json_encode(array('usertree'=>$usertree,'user'=>$user));
	}
	
	
	
}
?>

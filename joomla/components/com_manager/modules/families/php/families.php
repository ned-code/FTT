<?php
class JMBFamilies {
	protected $host;
	
	function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function getFamilies(){
		/*
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$gedcom_id = $session->get('gedcom_id');
        	$tree_id = $session->get('tree_id');
        	$permission = $session->get('permission');
        	
        	$settings = $session->get('settings');
        	$alias = $session->get('alias');
        	$login_method = $session->get('login_method');

		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		$user = $usertree[$gedcom_id];
		$colors = $settings['colors'];
		
		return json_encode(array(
			'colors'=>$colors,
			'user'=>$user,
			'usertree'=>$usertree
		));
		*/
		$session = JFactory::getSession();
        	$settings = $session->get('settings');
		$colors = $settings['colors'];
		
		return json_encode(array('colors'=>$colors));
		
	}
	
}
?>

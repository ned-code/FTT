<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	public function user(){
		$session = JFactory::getSession();
		$gedcom_id = $session->get('gedcom_id');
		$tree_id = $session->get('tree_id');
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		return json_encode(array('user_id'=>$gedcom_id, 'usertree'=>$usertree));
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
}
?>

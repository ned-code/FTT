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
		$lang = $session->get('language');
		
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		$languages = $this->host->getLanguages();
	
		return json_encode('user_id'=>$gedcom_id, 'usertree'=>$usertree,'default_language'=>$lang,'languages'=>$languages));
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

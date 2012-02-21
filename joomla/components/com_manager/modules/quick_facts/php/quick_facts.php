<?php
class JMBQuickFacts {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}

	protected function getLanguage(){
		$lang = $this->host->getLangList('quick_facts');
		if(!$lang) return false;
		return $lang;
	}
	
	protected function getFacts($usertree){
		$count = 0;
		$youngest = 9999;
		$youngest_object = null;
		$oldest = 0;
		$oldest_object = null;
		foreach($usertree as $object){
			if($object['user']['death']===null){
				$count++;
				if($object['user']['birth']!==null){
					$date = $object['user']['birth']['date'];
					if(is_array($date)&&$date[2]!==null){
						$turns = date('Y') - $date[2];
						if($turns <= 150 && $turns > $oldest){
							$oldest_object = $object;
							$oldest = $turns;
						}
						if($turns < $youngest){
							$youngest_object = $object;
							$youngest = $turns;
						}
					}
				}
			}
		}
		return array('living'=>$count,'youngest'=>$youngest_object,'oldest'=>$oldest_object);
	}
	
	public function get(){
		//vars
		$session = JFactory::getSession();
		$facebook_id = $session->get('facebook_id');
		$owner_id = $session->get('gedcom_id');
        	$tree_id = $session->get('tree_id');
        	$permission = $session->get('permission');
        	
        	$settings = $session->get('settings');
        	$alias = $session->get('alias');
        	$login_method = $session->get('login_method');
				
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		
		//facts
		$count = sizeof($usertree);
		$facts = $this->getFacts($usertree);
		$user = $usertree[$owner_id];
		$language = $this->getLanguage();
		$config = array('alias'=>$alias,'login_method'=>$login_method,'colors'=>$settings['colors']);
		
		return json_encode(array(
			'config'=>$config,
			'lang'=>$language,
			'user'=>$user,
			'count'=>$count,
			'living'=>$facts['living'],
			'youngest'=>$facts['youngest'],
			'oldest'=>$facts['oldest']
		));
	}
}
?>

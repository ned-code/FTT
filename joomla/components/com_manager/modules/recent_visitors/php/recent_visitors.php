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
	protected function _getColors(){
		$config = $_SESSION['jmb']['config'];
                $color = array();
                foreach($config['color'] as $key => $element){
                	switch($key){
                	    case "female":
                                    $color['F'] = $element;
                            break;
                            
                            case "male":
                                    $color['M'] = $element;
                            break;
                            
                            case "location":
                                    $color['L'] = $element;
                            break;
                            
                    	    case "famous_header":
                    	    	    $color['famous_header'] = $element;
                    	    break;
                    
                    	    case "family_header":
                    	    	    $color['family_header'] = $element;
                    	    break;
                	}
                }
                return $color;
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
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$facebook_id = $_SESSION['jmb']['fid'];
		if(!$facebook_id||!$owner_id) return json_encode(array('error'=>'not register user'));
				
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$user = $usertree[$owner_id];
		$language = $this->host->getLangList('recent_visitors');
		$colors = $this->_getColors();
		$time = date('Y-m-d H:i:s');
		$last_login_users = $this->host->gedcom->individuals->getLastLoginMembers($tree_id);
		$objects = $this->_sort($last_login_users, $usertree);
		$config = array('alias'=>$_SESSION['jmb']['alias'],'login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		
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

<?php
class JMBQuickFacts {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function getColors(){
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
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		
		//facts
		$count = sizeof($usertree);
		$facts = $this->getFacts($usertree);
		$colors = $this->getColors();
		$user = $usertree[$owner_id];
		$language = $this->getLanguage();
		$config = array('alias'=>'myfamily','login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
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

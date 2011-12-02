<?php
class JMBLatestUpdates {
	protected $host;
	
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

	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function get(){
		$treeId = $_SESSION['jmb']['tid'];
		$ownerId = $_SESSION['jmb']['gid'];
		$colors = $this->getColors();	
		$updates = $this->host->getLatestUpdates($treeId);
		if($updates==null) return json_encode(array('error'=>'Latest Update in null.'));
		foreach($updates as $upd){
			switch($upd['type']){
				case 'new_photo':
					$new_photo = $this->host->getUserInfo($upd['individuals_id'], $ownerId);
				break;
				case 'just_registered':
					$just_registered = $this->host->getUserInfo($upd['individuals_id'], $ownerId);
				break;
				case 'profile_change':
					$profile_change = $this->host->getUserInfo($upd['individuals_id'], $ownerId);
				break;
				case 'family_member_added':
					$family_member_added = $this->host->getUserInfo($upd['individuals_id'], $ownerId);
				break;
				case 'family_member_deleted':
					$family_member_deleted = $upd['description'];
				break;
			}
		}
		$path = "";
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$lang = $this->host->getLangList('latest_updates');
		$config = array('alias'=>'myfamily','login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		return json_encode(array('lang'=>$lang,'config'=>$config,'path'=>$path,'fmbUser'=>$fmbUser, 'new_photo'=>$new_photo,'just_registered'=>$just_registered, 'profile_change'=>$profile_change, 'family_member_added'=>$family_member_added, 'family_member_deleted'=>$family_member_deleted));
	}
}
?>

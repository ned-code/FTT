<?php
class JMBLatestUpdates {
	protected $host;
	
	protected function getColors(){
		$color = array();
		$p = $this->host->getSiteSettings('color');
		for($i=0;$i<sizeof($p);$i++){
                    switch($p[$i]['name']){	
                            case "female":
                                    $color['F'] = $p[$i]['value'];
                            break;
                            
                            case "male":
                                    $color['M'] = $p[$i]['value'];
                            break;
                            
                            case "location":
                                    $color['L'] = $p[$i]['value'];
                            break;
                            
                            case "famous_header":
                    	    	    $color['famous_header'] = $p[$i]['value'];
                    	    break;
                    
                    	    case "family_header":
                    	    	    $color['family_header'] = $p[$i]['value'];
                    	    break;
                    }
                }
                return $color;
	}

	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function get(){
		ob_clean();
		$treeId = $_SESSION['jmb']['tid'];
		$ownerId = $_SESSION['jmb']['gid'];
		$colors = $this->getColors();	
		$updates = $this->host->getLatestUpdates($treeId);
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
		$path = JURI::root(true);
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$lang = $this->host->getLangList('latest_updates');
		$config = array('alias'=>$_SESSION['jmb']['alias'],'login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		return json_encode(array('lang'=>$lang,'config'=>$config,'path'=>$path,'fmbUser'=>$fmbUser, 'new_photo'=>$new_photo,'just_registered'=>$just_registered, 'profile_change'=>$profile_change, 'family_member_added'=>$family_member_added, 'family_member_deleted'=>$family_member_deleted));
	}
}
?>

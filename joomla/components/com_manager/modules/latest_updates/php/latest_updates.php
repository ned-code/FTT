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
		$new_photo = $this->host->getUserInfo($this->host->gedcom->media->getNewPhoto($treeId), $ownerId);
		$profile_changes = $this->host->getUserInfo($this->host->gedcom->individuals->getLastProfileChange($treeId), $ownerId);
		$just_registered = $this->host->getUserInfo($this->host->gedcom->individuals->getLastRegisterUser($treeId), $ownerId);
		$colors = $this->getColors();
		return json_encode(array('colors'=>$colors,'new_photo'=>$new_photo,'profile_changes'=>$profile_changes,'just_registered'=>$just_registered));
	}
}
?>

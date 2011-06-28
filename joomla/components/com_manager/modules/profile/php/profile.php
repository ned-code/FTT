<?php
class JMBProfile {
	protected $db;
	protected $host;
	/**
	*
	*/
	function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	/**
	*
	*/
	public function _uploadPhoto($gedId){
		if($_FILES['photo']['size'] == 0) return;
		$result = $this->host->gedcom->media->save($gedId, $_FILES["photo"]["tmp_name"], $_FILES["photo"]["name"]);
		$photos = $this->host->gedcom->media->getMediaByGedId($gedId, '');
		$this->host->gedcom->media->setAvatarImage($gedId, $photos[0]->Id);
		return $photos;
        }
	
	/**
	*
	*/
	protected function _createFamily(){
		$fam = new Family();
		$fam->Id = $this->host->gedcom->families->getNewId();
		return $fam;
	}
	
	/**
	*
	*/
	protected function _createLocation($id, $type, $prefix, $save=true){
		if(!isset($_POST[$prefix.'country'])&&!isset($_POST[$prefix.'state'])&&!isset($_POST[$prefix.'town'])){
			return null;
		}
		$places = array($_POST[$prefix.'country'],$_POST[$prefix.'state'],$_POST[$prefix.'town']);
		$loc = new Location();
		$parent_id = 0;
		foreach($places as $key => $place){
			$place = trim($place);
			$place=preg_replace('/\\\"/', "", $place);
			$place=preg_replace("/[\><]/", "", $place);
			$loc->Hierarchy[] = new Place('', $place, $key, '');
			$parent_id = $p_id;
		}		
		if($save){ $this->host->gedcom->locations->save($loc);  }
		return $loc;
	}
	
	/**
	*
	*/
	protected function _createEvent($id, $type, $prefix, $save=true){
		$event = new Events();
		$event->Id = $this->host->gedcom->events->getNewId();
		$event->Type = $type;
		$event->Day = (isset($_POST[$prefix.'day']))?$_POST[$prefix.'day']:'';
		$event->Month = (isset($_POST[$prefix.'month']))?$_POST[$prefix.'month']:'';
		$event->Year = (isset($_POST[$prefix.'year']))?$_POST[$prefix.'year']:'';
		$event->Place = $this->_createLocation($event->Id, $type, $prefix);
		$event->IndKey = $id;
		if($save){ $this->host->gedcom->events->save($event); }
		return $event;
	}
	
	/**
	*
	*/
	protected function _addIndivEvents(&$ind){
		$ind->Birth = $this->_createEvent($ind->Id, 'BIRT', 'b_');
		if($_POST['living']=='false') { 
 			$ind->Death = $this->_createEvent($ind->Id, 'DEAT', 'd_');
 		}
	}
		
	/**
	*
	*/
	protected function _createIndiv($save=true){
		$ind = new Individual();
		$ind->Id = $this->host->gedcom->individuals->getNewId();
		$ind->FacebookId = 0;
		$ind->FirstName = (isset($_POST['first_name']))?$_POST['first_name']:''; 
		$ind->MiddleName = (isset($_POST['middle_name']))?$_POST['middle_name']:'';
		$ind->LastName = (isset($_POST['last_name']))?$_POST['last_name']:'';
		$ind->Gender = (isset($_POST['gender']))?$_POST['gender']:'';
		$ind->Nick = (isset($_POST['know_as']))?$_POST['know_as']:'';
		if($save){ $this->host->gedcom->individuals->save($ind); }
		return $ind;
	}
	
	protected function _addParent_($ind, $fam, $gender){
		if($gender=="M"){ 
			if($fam->Sircar){
				$this->host->gedcom->individuals->delete($fam->Sircar->Id);
			}
			$fam->Sircar = $ind; 
		} else { 
			if($fam->Spouse){
				$this->host->gedcom->individuals->delete($fam->Spouse->Id);
			}
			$fam->Spouse = $ind; 
		}
	}
	
	/**
	*
	*/
	protected function _addParent($id){
		$ind = $this->_createIndiv();
		$this->_addIndivEvents(&$ind);
 		
		$photos = $this->_uploadPhoto($ind->Id);
 		$fam_id = $this->host->gedcom->individuals->getFamilyId($id, 'CHIL');
		if(!$fam_id){
			$fam = $this->_createFamily();
			$this->_addParent_($ind, $fam, $_POST['gender']);
			$this->host->gedcom->families->save($fam);
			$this->host->gedcom->families->addChild($fam->Id, $id);
		
		} else {
			$fam = $this->host->gedcom->families->get($fam_id);
			$this->_addParent_($ind, $fam, $_POST['gender']);
			$this->host->gedcom->families->update($fam);
		}
		return array('i'=>$ind,'f'=>$fam,'p'=>$photos);
	}
	
	/**
	*
	*/
	protected function _addChild($id){
		$user = $this->host->gedcom->individuals->get($id);
		$fam_id = $this->host->gedcom->individuals->getFamilyId($id, 'FAMS');
		if(!$fam_id){
			$fam = $this->_createFamily();
			$this->_addParent_($user, $fam, $user->Gender);
			$this->host->gedcom->families->save($fam);
			$fam_id = $fam->Id;
		} 
		
		$ind = $this->_createIndiv();
		$this->_addIndivEvents(&$ind);
		
 		$photos = $this->_uploadPhoto($ind->Id);
 		$this->host->gedcom->families->addChild($fam_id, $ind->Id);
 		return array('fam_id'=>$fam_id,'i'=>$ind,'p'=>$photos);
	}	
	
	/**
	*
	*/
	protected function _addBS($id){
		$ind = $this->_createIndiv();
		$this->_addIndivEvents(&$ind);
		
		$photos = $this->_uploadPhoto($ind->Id);
		$user = $this->host->gedcom->individuals->get($id);
		$parents = $this->host->gedcom->individuals->getParents($id);
		if(!$parents){
			$fam = $this->_createFamily();
			$this->host->gedcom->families->save($fam);
			$fam_id = $fam->Id;
			$this->host->gedcom->families->addChild($fam_id, $ind->Id);
		} else {
			$fam_id = $parents['familyId'];
		}
 		$this->host->gedcom->families->addChild($fam_id, $ind->Id);
 		return array('fam_id'=>$fam_id,'i'=>$ind,'p'=>$photos);
	}
	
	/**
	*
	*/
	public function addPSC($args){
		$args = explode(';', $args);
		$type = $args[0];
		$ownerId = $args[1];
		switch($type){
			case "parent":
				$result = $this->_addParent($ownerId);
			break;
			
			case "bs":
				$result = $this->_addBS($ownerId);
			break;
			
			case "child":
				$result = $this->_addChild($ownerId);
			break;
		}
		return json_encode($result);	
	}
	
	/**
	*
	*/
	protected function _addSpouse(&$fam, $gender, $user, $ind){
		if($gender=="M"){
			$fam->Sircar = $user;
			$fam->Spouse = $ind;
		} else {
			$fam->Sircar = $ind;
			$fam->Spouse = $user;
		}
	}
	
	/**
	*
	*/
	protected function _addSpouseFamily($gender, $user, $ind){
		$fam = $this->_createFamily();
		$this->_addSpouse(&$fam, $gender, $user, $ind);
		$this->_addSpouseEvents(&$fam);
		return $fam;
	}
	
	/**
	*
	*/
	protected function _addSpouseEvents(&$fam){
		$fam->Marriage = $this->_createEvent($fam->Id, 'MARR', 'm_');
		if($_POST['deceased']=='on'){
			$fam->Divorce = $this->_createEvent($fam->Id, 'DIV', 's_');
		}
		
	}
		
	/**
	*
	*/
	public function addSpouse($args){
		$args = explode(';', $args);
		$ownerId = $args[0];
		$gender = $args[1];
		$type = ($gender=='M')?'HUSB':'WIFE';
		$_POST['gender'] = ($gender=='M')?'F':'M';
		
		$ind = $this->_createIndiv();
		$this->_addIndivEvents(&$ind);
		
		$fam_id = $this->host->gedcom->individuals->getFamilyId($ownerId, $type);
		$user = $this->host->gedcom->individuals->get($ownerId);
		$photos = $this->_uploadPhoto($ind->Id);
		
		if(!$fam_id){
			$fam = $this->_createFamily();
			$this->_addSpouse(&$fam, $gender, $user, $ind);
			$this->_addSpouseEvents(&$fam);
			$this->host->gedcom->families->save($fam);
			
		} else {
			$fam = $this->host->gedcom->families->get($fam_id);
			if($fam->Spouse==null&&$gender="M"||$fam->Sircar==null&&$gender=="F"){
				$this->_addSpouse(&$fam, $gender, $user, $ind);
				$this->_addSpouseEvents(&$fam);
				$this->host->gedcom->families->update($fam);
			} else {
				$fam = $this->_addSpouseFamily($gender, $user, $ind);
				$this->host->gedcom->families->save($fam);
			}
		}
		return json_encode(array('fam_id'=>$fam_id,'i'=>$ind,'p'=>$photos, 'f'=>$fam));
	}
	
	/**
	*
	*/
	public function delete($args){
		$args = explode(';', $args);
		switch($args[1]){
			case "delete":
				$this->host->gedcom->individuals->delete($args[0]);	
			break;
			
			case "deleteAndKeep":
				$user = $this->host->gedcom->individuals->get($args[0]);
				$user->FirstName = "unknown";
				$user->MiddleName = "";
				$user->LastName = "";
				$user->Nick = "";
				if($user->Birth){ $this->host->gedcom->events->delete($user->Birth->Id); }
				if($user->Death){ $this->host->gedcom->events->delete($user->Death->Id); }
				$this->host->gedcom->individuals->update($user);
			break;
			
			case "deleteAll":
					
			break;
		}
	}
	
	/**
	*
	*/
	protected function updateEvent($event, $prefix){
		$event->Day = (isset($_POST[$prefix.'day']))?$_POST[$prefix.'day']:'';
		$event->Month = (isset($_POST[$prefix.'month']))?$_POST[$prefix.'month']:'';
		$event->Year = (isset($_POST[$prefix.'year']))?$_POST[$prefix.'year']:'';
		$places = array($_POST[$prefix.'country'],$_POST[$prefix.'state'],$_POST[$prefix.'town']);
		$event->Place->Hierarchy[0]->Name = $places[0];
		$event->Place->Hierarchy[1]->Name = $places[1];
		$event->Place->Hierarchy[2]->Name = $places[2];
		$this->host->gedcom->events->update($event);
	}
	
	/**
	*
	*/
	public function updateIndiv($id){
		$ind = $this->host->gedcom->individuals->get($id);
		$ind->FirstName = (isset($_POST['first_name']))?$_POST['first_name']:''; 
		$ind->MiddleName = (isset($_POST['middle_name']))?$_POST['middle_name']:'';
		$ind->LastName = (isset($_POST['last_name']))?$_POST['last_name']:'';
		$ind->Gender = (isset($_POST['gender']))?$_POST['gender']:'';
		$ind->Nick = (isset($_POST['know_as']))?$_POST['know_as']:'';
		$this->host->gedcom->individuals->update($ind);
		//events
		$this->updateEvent($ind->Birth, 'b_');
		if(isset($_POST['living']) && $_POST['living'] == 'false' && $ind->Death){
			$this->updateEvent($ind->Death, 'd_');
		}
		if(isset($_POST['living']) && $_POST['living'] == 'false' && !$ind->Death){
			$ind->Death = $this->_createEvent($ind->Id, 'DEAT', 'd_');
		}	
		return json_encode(array('i'=>$ind));
	}
	
	/**
	*
	*/
	public function updateUnion($args){
		$args = explode(';', $args);
		$families = $this->host->gedcom->families->getPersonFamilies($args[0]);
		$fam_id = null;
		foreach($families as $family){
			if($family->Spouse->Id == $args[1]){
				$fam_id = $family->Id;
				$fam_events = $this->host->gedcom->events->getFamilyEvents($family->Id);
			}
		}
		$dFlag = false;
		$mFlag = false;
		foreach($fam_events as $event){
			switch($event->Type){
				case "MARR":
					$this->updateEvent($event, 'm_');
					$mFlag = true;
				break;
				
				case "DIV":
					if(isset($_POST['year'])){
						$event->Year = $_POST['year'];
						$this->host->gedcom->events->update($event);
						$dFlag = true;
					}
				break;
			}
		}		
		if(!$dFlag && $_POST['deceased']=='on'){
			$this->_createEvent($fam_id, 'DIV', 's_');
		}
		if(!$mFlag){
			$this->_createEvent($fam_id, 'MARR', 'm_');
		}
		return json_encode(array('f'=>$families,'e'=>$fam_events));
	}
}

?>

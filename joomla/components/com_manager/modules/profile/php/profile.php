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
	/*
	*  General Functions. 
	*/
	// create family object.
	protected function _createFamily(){
		$fam = new Family();
		return $fam;
	}
	// create individual object.
	protected function _createIndiv($save=true){
		$ind = new Individual();
		$ind->FacebookId = 0;
		$ind->FirstName = (isset($_POST['first_name']))?$_POST['first_name']:''; 
		$ind->MiddleName = (isset($_POST['middle_name']))?$_POST['middle_name']:'';
		$ind->LastName = (isset($_POST['last_name']))?$_POST['last_name']:'';
		$ind->Gender = (isset($_POST['gender']))?$_POST['gender']:'';
		$ind->Nick = (isset($_POST['know_as']))?$_POST['know_as']:'';
		if($save){ $ind->Id = $this->host->gedcom->individuals->save($ind); }
		return $ind;
	}
	// create event object.
	protected function _createEvent($eventType, $id, $name, $type, $prefix, $dateType, $save=true){
		$e = new Events();
		$e->Name = $name;
		$e->Type = $type;
		$e->DateType = $dateType;
		switch($e->DateType){
			case "AFT":
			case "BEF":
			case "EVO":
				$this->_setEventDate($e->From, 'f'.$prefix);
			break;
			case "BET":
				$this->_setEventDate($e->From, 'f'.$prefix);
				$this->_setEventDate($e->To, 't'.$prefix);
			break;
		}
		if($eventType=='IND'){ $e->IndKey = $id; } else { $e->FamKey = $id; }
		$e->Place = $this->_createLocation($e, $prefix);
		if($save){ $this->host->gedcom->events->save($e, $eventType); }
		return $e;
	}
	protected function _setEventDate(&$object, $prefix){
		if(isset($_POST[$prefix.'option'])) return false;
		$object->Day = (isset($_POST[$prefix.'day']))?$_POST[$prefix.'day']:'';
		$object->Month = (isset($_POST[$prefix.'month']))?$_POST[$prefix.'month']:'';
		$object->Year = (isset($_POST[$prefix.'year']))?$_POST[$prefix.'year']:'';
	}
	//create place and location address.
	protected function _createLocation($event, $prefix, $name=false){
		if(empty($_POST[$prefix.'town'])&&empty($_POST[$prefix.'state'])&&empty($_POST[$prefix.'country'])){ return null; }
		$city = (!empty($_POST[$prefix.'town']))?$_POST[$prefix.'town']:null;
		$state = (!empty($_POST[$prefix.'state']))?$_POST[$prefix.'state']:null;
		$country = (!empty($_POST[$prefix.'country']))?$_POST[$prefix.'country']:null;
		$address = array($city,$state,$country);
		$location = new Location();
		$location->City = $address[0];
		$location->State = $address[1];
		$location->Country = $address[2];
		$event->Place->Name = ($name)?$name:$this->_getPlaceName($address);
		$event->Place->Locations[] = $location; 
		return $event->Place;
	}
	// update event object.
	protected function _updateEvent($eventType, $event, $name, $type, $prefix, $dateType, $update=true){
		$event->Name = $name;
		$event->Type = $type;
		$event->DateType = $dateType;
		switch($event->DateType){
			case "AFT":
			case "BEF":
			case "EVO":
				$this->_setEventDate($event->From, 'f'.$prefix);
			break;
			case "BET":
				$this->_setEventDate($event->From, 'f'.$prefix);
				$this->_setEventDate($event->To, 't'.$prefix);
			break;
		}
		$event->Place = $this->_updateLocation($event->Place, $prefix);
		if($update) { $this->host->gedcom->events->update($event, $eventType); }
		return $event;
	}
	//update place and location address.
	protected function _updateLocation($place, $prefix, $name=false){
		if(empty($_POST[$prefix.'town'])&&empty($_POST[$prefix.'state'])&&empty($_POST[$prefix.'country'])){ return null; }
		$city = (!empty($_POST[$prefix.'town']))?$_POST[$prefix.'town']:null;
		$state = (!empty($_POST[$prefix.'state']))?$_POST[$prefix.'state']:null;
		$country = (!empty($_POST[$prefix.'country']))?$_POST[$prefix.'country']:null;
		$address = array($city,$state,$country);
		$place->Locations[0]->City = $address[0];
		$place->Locations[0]->State = $address[1];
		$place->Locations[0]->Country = $address[2];
		$place->Name = ($name)?$name:$this->_getPlaceName($address);
		return $place;
	}
	//add birth and death event to individual object.
	protected function _addIndivEvents(&$ind){
 		$ind->Birth[0] = $this->_createEvent('IND', $ind->Id, 'Birthday', 'BIRT', 'b_', 'EVO');
		if($_POST['living']=='false') { 
 			$ind->Death[0] = $this->_createEvent('IND', $ind->Id, 'Birthday', 'DEAT', 'd_', 'EVO');
 		}
	}
	//add individual to family (sort by sircar\spouse)
	protected function _addParent_($ind, &$fam, $gender){
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
	//add spouse to family object;
	protected function _addSpouse(&$fam, $gender, $user, $ind){
		if($gender=="M"){
			$fam->Sircar = $user;
			$fam->Spouse = $ind;
		} else {
			$fam->Sircar = $ind;
			$fam->Spouse = $user;
		}
	}
	//add spouse events
	protected function _addSpouseEvents(&$fam, $save=true){
		$fam->Marriage = $this->_createEvent('FAM',$fam->Id,'Marriage', 'MARR', 'm_', 'EVO', $save);
		if($_POST['deceased']=='on'){
			$fam->Divorce = $this->_createEvent('FAM',$fam->Id,'Divorce', 'DIV', 's_', 'EVO', $save);
		}	
	}
	//create family and add spouse
	protected function _addSpouseFamily($gender, $user, $ind){
		$fam = $this->_createFamily();
		$this->_addSpouse($fam, $gender, $user, $ind);
		return $fam;
	}
	// photo upload and set to avatar.
	protected function _uploadPhoto($gedId){
		if($_FILES['photo']['size'] == 0) return false;
		$result = $this->host->gedcom->media->save($gedId, $_FILES["photo"]["tmp_name"], $_FILES["photo"]["name"]);
		if($result) {
			$this->host->gedcom->media->setAvatarImage($gedId, $result);
			return $result;
		}
		return false;
        }
        // get place name 
        protected function _getPlaceName($places){    	
        	$placeName = '';
        	foreach($places as $place){
        		$placeName .= ($place!=null)?$place.',':'';
        	}
        	return substr($placeName, 0, -1);
        }
	
	/*
	* Protected Functions.
	*/
	//add parent record.
	protected function _addParent($id){
		$ind = $this->_createIndiv();
		$this->_addIndivEvents($ind);
 		
		$photo = $this->_uploadPhoto($ind->Id);
 		$fam_id = $this->host->gedcom->individuals->getFamilyId($id, 'FAMC');
		if(!$fam_id){
			$fam = $this->_createFamily();
			$this->_addParent_($ind, $fam, $_POST['gender']);
			$fam->Id = $this->host->gedcom->families->save($fam);
			$this->host->gedcom->families->addChild($fam->Id, $id);
		
		} else {
			$fam = $this->host->gedcom->families->get($fam_id);
			$this->_addParent_($ind, $fam, $_POST['gender']);
			
			$this->host->gedcom->families->update($fam);
		}
		return array('i'=>$ind,'f'=>$fam,'photo'=>$photo);
	}
	//add brother or sister record.
	protected function _addBS($id){
		$ind = $this->_createIndiv();
		$this->_addIndivEvents($ind);
		
		$photo = $this->_uploadPhoto($ind->Id);
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
 		return array('fam_id'=>$fam_id,'i'=>$ind,'photo'=>$photo);
	}
	
	//add children record.
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
		$this->_addIndivEvents($ind);
		
 		$photo = $this->_uploadPhoto($ind->Id);
 		$this->host->gedcom->families->addChild($fam_id, $ind->Id);
 		return array('fam_id'=>$fam_id,'i'=>$ind,'photo'=>$photo);
	}	
	
	
	/*
	* Public Functions.
	*/
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
	public function addSpouse($args){
		$args = explode(';', $args);
		$ownerId = $args[0];
		$gender = $args[1];
		$_POST['gender'] = ($gender=='M')?'F':'M';
		$ind = $this->_createIndiv();
		$this->_addIndivEvents($ind);	
		$fam_id = $this->host->gedcom->individuals->getFamilyId($ownerId, 'FAMS');
		$user = $this->host->gedcom->individuals->get($ownerId);
		$photo = $this->_uploadPhoto($ind->Id);
		
		if(!$fam_id){
			$fam = $this->_createFamily();
			$this->_addSpouse($fam, $gender, $user, $ind);
			$this->host->gedcom->families->save($fam);
			$this->_addSpouseEvents($fam);		
		} else {
			$fam = $this->host->gedcom->families->get($fam_id);
			$this->_addSpouse($fam, $gender, $user, $ind);
			if($fam->Marriage==null){ 
				$fam->Marriage = $this->_createEvent('FAM',$fam->Id,'Marriage', 'MARR', 'm_', 'EVO'); 
			} else {
				$fam->Marriage = $this->_createEvent('FAM',$fam->Id,'Marriage', 'MARR', 'm_', 'EVO', false);
				$this->host->gedcom->events->update($family->Marriage);
			}
			if($fam->Divorce==null&&$_POST['deceased']=='on'){ 
				$fam->Divorce = $this->_createEvent('FAM',$fam->Id,'Divorce', 'DIV', 's_', 'EVO');
			} elseif($_POST['deceased']=='on'){
				$fam->Divorce = $this->_createEvent('FAM',$fam->Id,'Divorce', 'DIV', 's_', 'EVO', false);
				$this->host->gedcom->events->update($family->Divorce);
			}	
			$this->host->gedcom->families->update($fam);			
		}
		
		$data = $this->host->getUserInfo($ownerId);
		return json_encode(array('data'=>$data,'spouse'=>array('indiv'=>$ind),'photo'=>$photo));
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
		//photo
		$photo = $this->_uploadPhoto($ind->Id);
		//events
		if(sizeof($ind->Birth)!=0){
			$ind->Birth[0] = $this->_updateEvent('IND', $ind->Birth[0], 'Birthday', 'BIRT', 'b_', 'EVO');
		} else {
			$ind->Birth[0] = $this->_createEvent('IND', $ind->Id, 'Birthday', 'BIRT', 'b_', 'EVO');
		}
		if(isset($_POST['living']) && $_POST['living'] == 'false' && sizeof($ind->Death)!=0){
			$ind->Death[0] = $this->_updateEvent('IND', $ind->Death[0], 'Birthday', 'DEAT', 'd_', 'EVO');
		}
		if(isset($_POST['living']) && $_POST['living'] == 'false' && sizeof($ind->Death)==0){
			$ind->Death[0] = $this->_createEvent('IND', $ind->Id, 'Birthday', 'DEAT', 'd_', 'EVO');
		}
		if(isset($_POST['living']) && $_POST['living'] == 'true'&& sizeof($ind->Death)!=0){
			$this->host->gedcom->events->delete($ind->Death[0]->Id);
			$ind->Death = null;
		}
		return json_encode(array('ind'=>$ind,'photo'=>$photo));
	}
	/**
	*
	*/
	public function updateUnion($args){
		$args = explode(';', $args);
		$families = $this->host->gedcom->families->getPersonsFamilies($args[0]);
		$fam_id = null;
		foreach($families as $family){
			if($family->Spouse->Id == $args[1]){
				$fam_id = $family->Id;
				$divorce = $family->Divorce;
				$marriage = $family->Marriage;
			}
		}
		if($marriage){
			$marriage = $this->_updateEvent('FAM', $marriage, 'Marriage', 'MARR', 'm_', 'EVO');
		} else {
			$marriage = $this->_createEvent('FAM', $fam_id,'Marriage', 'MARR', 'm_', 'EVO');
		}
		if($divorce&&isset($_POST['deceased'])){
			$divorce->From->Year = $_POST['s_year'];
			$this->host->gedcom->events->update($divorce);
		} else if($divorce&&!isset($_POST['deceased'])){
			$this->host->gedcom->events->delete($divorce->Id);
			$divorce = null;
		} else if(!$divorce&&isset($_POST['deceased'])){
			$divorce = $this->_createEvent('FAM', $fam_id, 'Divorce', 'DIV', 's_', 'EVO');
		}
		return json_encode(array('marriage'=>$marriage,'divorce'=>$divorce));
	}
	/**
	*
	*/
	public function getUserInfo(){
		$data = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$path = JURI::root(true); 
		return json_encode(array('data'=>$data,'path'=>$path));
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
				$user->MiddleName = NULL;
				$user->LastName = NULL;
				$user->Nick = NULL;
				if(!empty($user->Birth)){ $this->host->gedcom->events->delete($user->Birth[0]->Id); }
				if(!empty($user->Death)){ $this->host->gedcom->events->delete($user->Death[0]->Id); }
				$this->host->gedcom->individuals->update($user);
			break;
			
			case "deleteAll":
					
			break;
		}
	}
}

?>

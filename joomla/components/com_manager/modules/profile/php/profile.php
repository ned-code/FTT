<?php
class JMBProfile {
	protected $db;
	protected $host;
	protected $relation;
	
	/**
	*
	*/
	function __construct(){
		$this->db =& JFactory::getDBO();
		$this->host = new Host('Joomla');
	}
	
	protected function getPlaceName($request, $prefix){
		$place = array();
		$place[] = $request[$prefix.'city'];
		$place[] = $request[$prefix.'state'];
		$place[] = $request[$prefix.'country'];
		$place_name = '';
		foreach($place as $v){
			if($v!=''){
				$place_name .= $v;
				$place_name .= ',';
			}
		}
		return substr($place_name, 0, -1);
	}
	
	protected function updateIndividual($ind, $request){
		$ind->Gender = $request['gender'];
		$ind->FirstName = $request['first_name'];
		$ind->MiddleName = $request['middle_name'];
		$ind->LastName = $request['last_name'];
		$ind->Nick = $request['nick'];
		$this->host->gedcom->individuals->update($ind);
	}
	
	protected function updateIndividualEvent($user_id, $event, $type, $request){
		if(empty($event)){			
			$event = new Events();
			$event->IndKey = $user_id;
			$event->DateType = 'EVO';
			$event->Type = $type;
			$event->Id = $this->host->gedcom->events->save($event);
		} else {
			$event = $event[0];
		}
		$prefix = ($event->Type=='BIRT')?'birth_':'death_';		
		$update_event = $this->updateEvent($event, $prefix, $request);
		$this->host->gedcom->events->update($update_event);
	}
	
	protected function updateIndividualEvents($individual, $request){
		$this->updateIndividualEvent($individual->Id, $individual->Birth, 'BIRT', $request);
		if($request['living']=='1'){
			if(sizeof($individual->Death) != 0){
				$this->host->gedcom->events->delete($individual->Death[0]->Id);
			}
		} else {			
			$this->updateIndividualEvent($individual->Id, $individual->Death, 'DEAT', $request);	
		}
	}
	
	protected function updateFamilyEvents($family, $request){
		//marriage
		if($family->Marriage==null){
			$event = new Events();
			$event->Name = 'Marriage';
			$event->FamKey = $family->Id;
			$event->DateType = 'EVO';
			$event->Type = 'MARR';
			$event->Id = $this->host->gedcom->events->save($event);
		} else {
			$event = $family->Marriage;
		}
		$update_marr = $this->updateEvent($event, 'marr_', $request);
		$this->host->gedcom->events->update($update_marr);
		//divorce
		if(isset($request['deceased'])){
			if($family->Divorce==null){
				$event = new Events();
				$event->Name = 'Divorce';
				$event->FamKey = $family->Id;
				$event->DateType = 'EVO';
				$event->Type = 'DIV';
				$event->Id = $this->host->gedcom->events->save($event);
			} else {
				$event = $family->Divorce;
			}
			$div_year = (isset($request['marr_divorce_year']))?$request['marr_divorce_year']:null;
			$event->From->Year = $div_year;
			$this->host->gedcom->events->update($event);
		} else {
			if($family->Divorce!=null){
				$this->host->gedcom->events->delete($family->Divorce->Id);
			}
		}
	}
	
	protected function updateEvent($event, $prefix, $request){
		$place_name = $this->getPlaceName($request, $prefix);
		$city = $request[$prefix.'city'];
		$state = $request[$prefix.'state'];
		$country = $request[$prefix.'country'];
		if(!isset($request[$prefix.'option'])){
			$event->From->Day = ($request[$prefix.'days']!='0')?$request[$prefix.'days']:NULL;
			$event->From->Month = ($request[$prefix.'months']!='0')?$request[$prefix.'months']:NULL;
			$event->From->Year = ($request[$prefix.'year']!='')?$request[$prefix.'year']:NULL;
		} else {
			$event->From->Day = null;
			$event->From->Month = null;
			$event->From->Year = null;
		}
		if($event->Place!=null){
			$event->Place->Name = $place_name;
			$location = $event->Place->Locations[0];
			$location->City = $city;
			$location->State = $state;
			$location->Country = $country;
		} else if($city!==''||$state!==''||$country!=='') {
			$place = new Place();
			$location = new Location();
			$location->City = $city;
			$location->State = $state;
			$location->Country = $country;
			$place->Name = $place_name;
			$place->Locations = array();
			$place->Locations[] = $location;
			$event->Place = $place;
		}
		return $event;
	}

	public function basic($user_id){				
		// update user in db
		$ind = $this->host->gedcom->individuals->get($user_id);
		$this->updateIndividual($ind, $_REQUEST);
		$this->updateIndividualEvents($ind, $_REQUEST);
		//update user tree
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		$this->host->usertree->init($tree_id, $owner_id, $permission);
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		return json_encode(array('user'=>$usertree[$user_id]));
	}
	
	public function union($args){
		$args = json_decode($args);
		$request = $_REQUEST;
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		$data = false;
		switch($args->method){
			case "save":
				$family = $this->host->gedcom->families->get($args->family_id);
				$this->updateFamilyEvents($family, $request);
			break;
			
			case "add":
				
				$sircar = $this->host->gedcom->individuals->get($args->gedcom_id);
				//add spouse in db
				$spouse = $this->host->gedcom->individuals->create();
				$spouse->FacebookId = '0';
				$spouse->Gender = $request['gender'];
				$spouse->FirstName = ($request['first_name']!='')?$request['first_name']:'unknown';
				$spouse->MiddleName = $request['middle_name'];
				$spouse->LastName = $request['last_name'];
				$spouse->Nick = $request['nick'];
				$spouse->Id = $this->host->gedcom->individuals->save($spouse);
				$this->host->usertree->link($tree_id, $spouse->Id);
				$this->updateIndividualEvents($spouse, $request);
				//add family in db
				$family = new Family();
				$family->Sircar = $sircar;
				$family->Spouse = $spouse;
				$family->Id = $this->host->gedcom->families->save($family);
				$this->updateFamilyEvents($family, $request);
				$data = true;
			break;
		}
		
		//update user tree
		$this->host->usertree->init($tree_id, $owner_id, $permission);
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		if($data){
			$family_id = $family->Id;  
			$spouse = $usertree[$spouse->Id];
			$data = array('family_id'=>$family_id, 'spouse'=>$spouse);
		}
		return json_encode(array('user'=>$usertree[$args->gedcom_id], 'data'=>$data));
	}
	
	
	public function photo($args){
		$args = json_decode($args);
		switch($args->method){
			case "delete":
				return json_encode(array( 'message'=>$this->host->gedcom->media->delete($args->media_id) ) );
			break;
			
			case "add":
				$media_id = false;
				$image = false;
				if($_FILES['upload']['size'] != 0){
					$media_id = $this->host->gedcom->media->save($args->gedcom_id, $_FILES["upload"]["tmp_name"], $_FILES["upload"]["name"], $_FILES['upload']['size']);
					if($media_id) {
						$res = $this->host->gedcom->media->get($media_id);
						$image = array(
							'media_id'=>$res->Id,
							'title'=>$res->Title,
							'path'=>$res->FilePath,
							'gedcom_id'=>$args->gedcom_id,
							'size'=>$res->Size
						);
					}
				}
				return json_encode(array('image'=>$image));
			break;
			
			case "set_avatar":
				$this->host->gedcom->media->setAvatarImage($args->gedcom_id, $args->media_id);
				return true;
			break;
		}
	}
}

?>

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
		$place_name = $this->getPlaceName($request, $prefix);
		$city = $request[$prefix.'city'];
		$state = $request[$prefix.'state'];
		$country = $request[$prefix.'country'];
		if(!isset($request[$prefix.'option'])){
			$event->From->Day = $request[$prefix.'days'];
			$event->From->Month = $request[$prefix.'months'];
			$event->From->Year = $request[$prefix.'year'];
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
		}
		$this->host->gedcom->events->update($event);
	}

	public function basic($user_id){				
		// update user in db
		$ind = $this->host->gedcom->individuals->get($user_id);
		$this->updateIndividual($ind, $_REQUEST);
		$this->updateIndividualEvent($user_id, $ind->Birth, 'BIRT', $_REQUEST);
		if($_REQUEST['living']=='1'){
			if( sizeof($ind->Death) != 0){
				$this->host->gedcom->events->delete($ind->Death[0]->Id);
			}
		} else {			
			$this->updateIndividualEvent($user_id, $ind->Death, 'DEAT', $_REQUEST);	
		}
		//update user tree
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		$this->host->usertree->init($tree_id, $owner_id, $permission);
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		return json_encode(array('user'=>$usertree[$user_id]));
	}
}

?>

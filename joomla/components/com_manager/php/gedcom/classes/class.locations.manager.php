<?php
class LocationsList{
	public $core;
        
	function  __construct($core) {
		require_once 'class.location.php';
		$this->core = $core;
		$this->db = new JMBAjax();
        }
        
        public function get($id, $lite=false){
        	if($id==null){ return null; }        	
        	$this->db->setQuery('SELECT place_id, place_name FROM #__mb_places WHERE place_id = ?', $id);         
        	$rows = $this->db->loadAssocList();
        	$place = new Place();
        	$place->Id = $rows[0]['place_id'];
        	$place->Name = $rows[0]['place_name'];
        	if(!$lite){
        		$place->Locations = $this->getLocations($place);
        	}
        	return $place;
        }
        
        public function save($id, $place){
        	if($place==null) { return false; }
        	$this->db->setQuery('INSERT INTO #__mb_places (`place_id`, `events_id`, `name`) VALUES (NULL, ?, ?)', $id, $place->Name);    
        	$this->db->query();
        	$lastId = $this->db->insertid();
        	$this->saveLocations($lastId, $place);
        	return $lastId;
        }
        public function update($id, $place){
        	if($place==null) { return false; }
        	$this->db->setQuery('UPDATE #__mb_places SET `events_id`=?, `name`=?, `change`=NOW() WHERE `place_id`=?', $id, $place->Name, $place->Id);    
        	$this->db->query();
        	$this->updateLocations($place);
        }
        public function detele($id){
        	if($id==null){ return false; }
        	$this->db->setQuery('DELETE FROM #__mb_places WHERE place_id=?', $id);    
        	$this->db->query();
        }
        public function getPlaceByEventId($id, $lite=false){
        	if($id==null){ return null; }        	
        	$this->db->setQuery('SELECT place_id, name FROM #__mb_places WHERE events_id =?', $id);   
        	$rows = $this->db->loadAssocList();
        	if($rows==null) { return null; }
        	$place = new Place();
        	$place->Id = $rows[0]['place_id'];
        	$place->Name = $rows[0]['name'];
        	if(!$lite){
        		$place->Locations = $this->getLocations($place);
        	}
        	return $place;
        }
        
        public function getLocations($place){
        	if($place==null) { return null; }
        	$this->db->setQuery('SELECT name, cont, adr1, adr2, city, state, country, post, phones FROM #__mb_locations WHERE place_id =?', $place->Id);         
        	$rows = $this->db->loadAssocList();
        	foreach ($rows as $row){
        		$location = new Location();
        		$location->Name = $row['name'];
			$location->Cont = explode(',', $row['cont']);
			$location->Adr1 = $row['adr1'];
			$location->Adr2 = $row['adr2'];
			$location->City = $row['city'];
			$location->State = $row['state'];
			$location->Post = $row['post'];
			$location->Country = $row['country'];
			$location->Phones = explode(',', $row['phones']);
        		$place->Locations[] = $location;
        	}
        	return $place->Locations;
        }
        public function saveLocations($id, $place){
        	if($id==null||$place==null){ return false; }
        	foreach($place->Locations as $loc){
        		$phones = (is_array($loc->Phones))?implode(',', $loc->Phones):NULL;
        		$this->db->setQuery('INSERT INTO #__mb_locations (`place_id`, `name`, `cont`, `adr1`, `adr2`, `city`, `state`, `post`, `country`, `phones`) VALUES(?,?,?,?,?,?,?,?,?,?)', $id, $loc->Name, $loc->Cont, $loc->Adr1, $loc->Adr2, $loc->City, $loc->State, $loc->Post, $loc->Country, $phones);         
        		$this->db->query();
        	}
        }
        public function updateLocations($place){
        	if($place==null){ return false; }
        	foreach($place->Locations as $loc){
        		$phones = (is_array($loc->Phones))?implode(',', $loc->Phones):NULL;
        		$this->db->setQuery('UPDATE #__mb_locations SET `name`=?, `cont`=?,`adr1`=?,`adr2`=?,`city`=?,`state`=?,`post`=?,`country`=?,`phones`=?,`change`= NOW() WHERE place_id=?', $loc->Name, $loc->Cont, $loc->Adr1, $loc->Adr2, $loc->City, $loc->State, $loc->Post, $loc->Country, $phones, $place->Id);         
        		$this->db->query();
        	}
        }
}
?>
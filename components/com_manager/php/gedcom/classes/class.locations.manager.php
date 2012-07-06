<?php
class LocationsList{       
	    private $ajax;

        public function  __construct(&$ajax) {
            $this->ajax = $ajax;
        }
        
        public function get($id, $lite=false){
        	if($id==null){ return null; }        	
        	$this->ajax->setQuery('SELECT place_id, place_name FROM #__mb_places WHERE place_id = ?', $id);
        	$rows = $this->ajax->loadAssocList();
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
        	$this->ajax->setQuery('INSERT INTO #__mb_places (`place_id`, `events_id`, `name`) VALUES (NULL, ?, ?)', $id, $place->Name);
        	$this->ajax->query();
        	$lastId = $this->ajax->insertid();
        	$this->saveLocations($lastId, $place);
        	return $lastId;
        }
        public function update($id, $place){
        	if($place==null) { return false; }
        	$this->ajax->setQuery('UPDATE #__mb_places SET `events_id`=?, `name`=?, `change`=NOW() WHERE `place_id`=?', $id, $place->Name, $place->Id);
        	$this->ajax->query();
        	$this->updateLocations($place);
        }
        public function detele($id){
        	if($id==null){ return false; }
        	$this->ajax->setQuery('DELETE FROM #__mb_places WHERE place_id=?', $id);
        	$this->ajax->query();
        }
        public function getPlaceByEventId($id, $lite=false){
        	if($id==null){ return null; }        	
        	$this->ajax->setQuery('SELECT place_id, name FROM #__mb_places WHERE events_id =?', $id);
        	$rows = $this->ajax->loadAssocList();
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
        	$this->ajax->setQuery('SELECT name, cont, adr1, adr2, city, state, country, post, phones FROM #__mb_locations WHERE place_id =?', $place->Id);
        	$rows = $this->ajax->loadAssocList();
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
        		$this->ajax->setQuery('INSERT INTO #__mb_locations (`place_id`, `name`, `cont`, `adr1`, `adr2`, `city`, `state`, `post`, `country`, `phones`) VALUES(?,?,?,?,?,?,?,?,?,?)', $id, $loc->Name, $loc->Cont, $loc->Adr1, $loc->Adr2, $loc->City, $loc->State, $loc->Post, $loc->Country, $phones);
        		$this->ajax->query();
        	}
        }
        public function updateLocations($place){
        	if($place==null){ return false; }
        	foreach($place->Locations as $loc){
        		$phones = (is_array($loc->Phones))?implode(',', $loc->Phones):NULL;
        		$sql_string = 'UPDATE #__mb_locations SET `name`=?, `cont`=?,`adr1`=?,`adr2`=?,`city`=?,`state`=?,`post`=?,`country`=?,`phones`=?,`change`= NOW() WHERE place_id=?';
        		$this->ajax->setQuery($sql_string, $loc->Name, ($loc->Cont!=NULL)?implode(',',$loc->Cont):NULL, $loc->Adr1, $loc->Adr2, $loc->City, $loc->State, $loc->Post, $loc->Country, $phones, $place->Id);
        		$this->ajax->query();
        	}
        }
        public function getEventsLocationsList($tree_id, $gedcom_id = false){
		    $family_places = $this->getFamilyPlaces($tree_id, $gedcom_id);
            $individuals_places = $this->getIndividualPlaces($tree_id, $gedcom_id);
            $result = array();
            if(!empty($family_places)){
                foreach($family_places as $key => $ev){
                    if(!isset($result[$key])){
                        $result[$key] = $ev;
                    }
                }
            }
            if(!empty($individuals_places)){
                foreach($individuals_places as $key => $ev){
                    if(!isset($result[$key])){
                        $result[$key] = $ev;
                    }
                }
            }
            return $result;
        }
        public function getFamilyPlaces($tree_id, $gedcom_id = false){
            $sql_string = "SELECT DISTINCT place.place_id, event.id as event_id, location.name as location_name,
                                           place.name as place_name, location.city, location.state, location.country
                            FROM #__mb_places as place
                            LEFT JOIN #__mb_events as event ON place.events_id = event.id
                            LEFT JOIN #__mb_families as family ON family.id = event.families_id
                            LEFT JOIN #__mb_individuals as ind ON family.husb = ind.id OR family.wife = ind.id
                            LEFT JOIN #__mb_tree_links as link ON link.individuals_id = ind.id
                            LEFT JOIN #__mb_locations as location ON location.place_id = place.place_id";
            if($gedcom_id){
                $sql_string .= " WHERE lin.tree_id = ? and link.individuals_id =? ";
                $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
            } else {
                $sql_string .= " WHERE link.tree_id = ?";
                $this->ajax->setQuery($sql_string, $tree_id);
            }
            //var_dump($this->ajax->getQuery());
            $rows = $this->ajax->loadAssocList('event_id');
            return $rows;
        }
        public function getIndividualPlaces($tree_id, $gedcom_id = false){
            $sql_string = "SELECT DISTINCT place.place_id, event.id as event_id, location.name as location_name,
                                           place.name as place_name, location.city, location.state, location.country
                            FROM #__mb_places as place
                            LEFT JOIN #__mb_events as event ON place.events_id = event.id
                            LEFT JOIN #__mb_individuals as ind ON event.individuals_id = ind.id
                            LEFT JOIN #__mb_tree_links as link ON link.individuals_id = ind.id
                            LEFT JOIN #__mb_locations as location ON location.place_id = place.place_id";
            if($gedcom_id){
                $sql_string .= " WHERE link.tree_id = ? and link.individuals_id =? ";
                $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
            } else {
                $sql_string .= " WHERE link.tree_id = ?";
                $this->ajax->setQuery($sql_string, $tree_id);
            }
            //var_dump($this->ajax->getQuery());
            $rows = $this->ajax->loadAssocList('event_id');
            return $rows;
        }
}
?>
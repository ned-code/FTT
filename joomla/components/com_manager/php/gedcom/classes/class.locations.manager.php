<?php
class LocationsList{
	public $core;
        
	function  __construct($core) {
		require_once 'class.location.php';
		$this->core = $core;
		$this->db = & JFactory::getDBO();
        }
        
        public function get($id, $lite=false){
        	if($id==null){ return false; }        	
        	$sql = $this->core->sql('SELECT place_id, place_name FROM #__mb_places WHERE place_id = ?', $id);
        	$this->db->setQuery($sql);         
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
        	$sql = $this->core->sql('INSERT INTO #__mb_places (`place_id`, `events_id`, `name`) VALUES (NULL, ?, ?)', $id, $place->Name);
        	echo $sql;
        	die();
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	$lastId = $this->db->insertid();
        	$this->saveLocations($lastId, $place);
        	return $lastId;
        }
        public function update($id, $place){
        	if($place==null) { return false; }
        	$sql = $this->core->sql('UPDATE #__mb_places SET `events_id`=?, `name`=?, `change`=NOW() WHERE `place_id`=?', $id, $place->Name, $place->Id);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	$this->updateLocations($place);
        }
        public function detele($id){
        	if($id==null){ return false; }
         	$sql = $this->core->sql('DELETE FROM #__mb_places WHERE place_id=?', $id);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        }
        public function getPlaceByEventId($id, $lite=false){
        	if($id==null){ return false; }        	
        	$sql = $this->core->sql('SELECT place_id, place_name FROM #__mb_places WHERE events_id =?', $id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	$place = new Place();
        	$place->Id = $rows[0]['place_id'];
        	$place->Name = $rows[0]['place_name'];
        	if(!$lite){
        		$place->Locations = $this->getLocations($place);
        	}
        	return $place;
        }
        
        public function getLocations($place){
        	if($place==null) { return false; }
        	$sql = $this->core->sql('SELECT name, cont, adr1, adr2, city, state, country, post, phones FROM #__mb_locations WHERE place_id =?', $place->Id);
        	$this->db->setQuery($sql);         
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
			$location->Phones = explode(',', $rows['phones']);
        		$place->Locations[] = $location;
        	}
        	return $place->Locations;
        }
        public function saveLocations($id, $place){
        	foreach($place->Locations as $loc){
        		$phones = (is_array($loc->Phones))?implode(',', $loc->Phones):NULL;
        		$sql = $this->core->sql('INSERT INTO #__mb_locations (`place_id`, `name`, `cont`, `adr1`, `adr2`, `city`, `state`, `post`, `country`, `phones`) VALUES(?,?,?,?,?,?,?,?,?,?)', $id, $loc->Name, $loc->Cont, $loc->Adr1, $loc->Adr2, $loc->City, $loc->State, $loc->Post, $loc->Country, $phones);
        		$this->db->setQuery($sql);         
        		$this->db->query();
        	}
        }
        public function updateLocations($place){
        	foreach($place->Locations as $loc){
        		$phones = (is_array($loc->Phones))?implode(',', $loc->Phones):NULL;
        		$sql = $this->core->sql('UPDATE #__mb_locations SET `name`=?, `cont`=?,`adr1`=?,`adr2`=?,`city`=?,`state`=?,`post`=?,`country`=?,`phones`=?,`change`= NOW() WHERE place_id=?', $loc->Name, $loc->Cont, $loc->Adr1, $loc->Adr2, $loc->City, $loc->State, $loc->Post, $loc->Country, $phones, $place->Id);
        		$this->db->setQuery($sql);         
        		$this->db->query();
        	}
        }
	
	/*
	function form(&$a,&$b) {
                if ($a['level'] == $b['level']) {
                        return 0;
                    }
                    return ($a['level'] < $b['level']) ? -1 : 1;
            }
         function  __construct($cor) {
             $this->core = $cor;
         }
         public function count(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT COUNT(DISTINCT pl_p_id) as count
                            FROM #__mb_placelinks');
            $rows = $db->loadAssocList();

            return $rows[0]['count'];
         }
         public function parseLocationString($str){
             $places = explode(',', $str);
		//-- reverse the array to start at the highest level
                $places = array_reverse($places);
		$parent_id = 0;
		$level = 0;


                $loc = new Location();
		foreach ($places as $indexval => $place) {
			$place = trim($place);
			$place=preg_replace('/\\\"/', "", $place);
			$place=preg_replace("/[\><]/", "", $place);
			$pl = new Place('', $place, $level, '');
                        $level++;
			$loc->Hierarchy[]=$pl;
                }
                return $loc;
         }
         public function insertPlace($place){

         }
         public function getLinkedLocation($id){
             $db =& JFactory::getDBO();
             $db->setQuery('SELECT #__mb_places.p_id as id, #__mb_places.p_place as place, #__mb_places.p_level as level, #__mb_places.p_parent_id as parent_id
                    FROM #__mb_placelinks
                    LEFT JOIN #__mb_places ON #__mb_places.p_id = #__mb_placelinks.pl_p_id
                 WHERE #__mb_placelinks.pl_gid="'.$id.'"');
             $rows = $db->loadAssocList();
             //$rows = uasort($rows , 'form');
             $places;
             foreach($rows as $row){
                 $places[] = new Place($row['id'], $row['place'], $row['level'], $row['parent_id']);
             }
             //var_dump($places);
             $location = new Location($places);
           
             return $location;
             //
         }
         function getNewId(){
            $db =& JFactory::getDBO();
            $req = 'SELECT max(p_id) as id FROM #__mb_places';
            $db->setQuery($req);

            $rows = $db->loadAssocList();

            if($rows == null){
               $newid = '1' ;
            }else{
                $newid = ($rows[0]['id']+1) ;
            }
            return $newid;

        }
        public function get($id){
        }
        public function update($location, $foreignKey){
            if($location->Hierarchy != null&&count($location->Hierarchy)>0){
                 $db =& JFactory::getDBO();
                 $db->setQuery('SELECT * from #__mb_placelinks WHERE pl_gid ="'.$foreignKey.'"');
                 $rows = $db->loadAssocList();
                 if($rows!=null){
                    for($i=0; $i<count($location->Hierarchy);$i++){
                         if($location->Hierarchy[$i]->Id  !=''&&$location->Hierarchy[$i]->Id !='0'){

                check if place name has benn actually changed,
                         * check is there a multiple events are linked to current place, if so appending modified place as new location
                         * else just renaming it,  change subplaces parent ids for correct hierarchy
                         *


                            $db->setQuery('SELECT * from #__mb_places WHERE p_id="'.$location->Hierarchy[$i]->Id.'"');
                            $rows = $db->loadAssocList();
                            if($rows != null&&$rows[0]['p_place'] != $location->Hierarchy[$i]->Name ){


                                $db->setQuery('SELECT * from #__mb_placelinks WHERE pl_p_id="'.$location->Hierarchy[$i]->Id.'"');
                                $rows = $db->loadAssocList();
                                if($rows==null||count($rows)>1){
                                 
                                    $ildId = $location->Hierarchy[$i]->Id;
                                    $location->Hierarchy[$i]->Id =$this->getNewId();
                                    $req = 'INSERT INTO #__mb_places (`p_id`, `p_place`, `p_level`, `p_parent_id`) VALUES ("'.$location->Hierarchy[$i]->Id.'","'.$location->Hierarchy[$i]->Name.'","'.$location->Hierarchy[$i]->Level.'","'.$location->Hierarchy[$i]->ParentId.'")';
                                    $db->setQuery($req);
                                    $db->query();

                                    if(isset($location->Hierarchy[$i]))
                                            $location->Hierarchy[$i]->ParentId = $location->Hierarchy[$i]->Id;
                                    $req = 'UPDATE #__mb_placelinks SET pl_p_id="'.$location->Hierarchy[$i]->Id.'"  WHERE pl_p_id="'.$ildId.'" AND pl_gid="'.$foreignKey.'"';
                                    $db->setQuery($req);
                                    $db->query();
                                }else{
                                    $req = 'UPDATE #__mb_places SET p_place="'.$location->Hierarchy[$i]->Name.'", p_parent_id="'.$location->Hierarchy[$i]->ParentId.'"  WHERE p_id="'.$location->Hierarchy[$i]->Id.'"';
                                    $db->setQuery($req);
                                    $db->query();
                                }


                            }
                        }else{
                            $this->resetPlacelinks($foreignKey);
                            $this->linkLocation($this->save($location), $foreignKey);
                        }
                    }
                 }else{
                     $this->resetPlacelinks($foreignKey);
                     $this->linkLocation($this->save($location), $foreignKey);
                 }
            }
        }
        public function save($location){
            $inserted = null;
         
            if($location->Hierarchy != null&&count($location->Hierarchy)>0){
                $prev = 0;
                $inserted = new Location();   
                $db =& JFactory::getDBO();
                
                for($i=0; $i<count($location->Hierarchy);$i++){
                    $req = 'INSERT INTO #__mb_places (`p_id`, `p_place`, `p_level`, `p_parent_id`) VALUES ';

                        $inserted->Hierarchy[$i] = $location->Hierarchy[$i];
                        if($inserted->Hierarchy[$i]->Id == ''){
                            $inserted->Hierarchy[$i]->Id = $this->getNewId();
                        }
                        $inserted->Hierarchy[$i]->Level = $i;
                        $inserted->Hierarchy[$i]->ParentId = $prev;
                        $prev = $inserted->Hierarchy[$i]->Id;
                        $req .= '("'.$inserted->Hierarchy[$i]->Id.'", "'.$inserted->Hierarchy[$i]->Name.'", "'.$inserted->Hierarchy[$i]->Level.'", "'.$inserted->Hierarchy[$i]->ParentId.'")';
                       
                    $db->setQuery($req);
                    $db->query();
                }
                
                
            }
            return $inserted;
        }
        public function resetPlacelinks($foreignKey){
            $db =& JFactory::getDBO();
            $req = 'DELETE FROM #__mb_placelinks WHERE pl_gid="'.$foreignKey.'"';
            $db->setQuery($req);
            $db->query();
        }
        public function ulinkLocation($location, $foreignKey){
             if($location->Hierarchy != null&&count($location->Hierarchy)>0){                
                for($i=0; $i<count($location->Hierarchy);$i++){  
                        $req = 'DELETE FROM #__mb_placelinks WHERE pl_p_id="'.$location->Hierarchy[$i]->Id.'" pl_gid="'.$foreignKey.'"';
                        $db->setQuery($req);
                        $db->query();
                    }
                }
 
        }
        public function linkLocation($location, $foreignKey){
            $db =& JFactory::getDBO();
             if($location->Hierarchy != null&&count($location->Hierarchy)>0){
          //   echo 'linking';
                $req = 'INSERT INTO #__mb_placelinks (`pl_p_id`, `pl_gid`) VALUES ';
                for($i=0; $i<count($location->Hierarchy);$i++){                                               
                        if($location->Hierarchy[$i]->Id!=''){
                            $req .= '("'.$location->Hierarchy[$i]->Id.'", "'.$foreignKey.'")';
                            if(isset($location->Hierarchy[$i+1])){
                                     $req .= ', ';
                                }
                        }
                    }
                }
          //      var_dump($req);
                $db->setQuery($req);
                $db->query();

        }
         //public function get()
       */

}
?>
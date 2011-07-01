<?php
require_once 'class.data.php';
    class LocationsList extends DataType{
         public $core;
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

                        /* check if place name has benn actually changed,
                         * check is there a multiple events are linked to current place, if so appending modified place as new location
                         * else just renaming it,  change subplaces parent ids for correct hierarchy
                         *
                         */

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
       
    }
?>
<?php
class EventsList{
        private $locations;
        private $ajax;

        public function __construct(&$ajax, &$locations){
        	 $this->locations= $locations;
        	 $this->ajax = $ajax;
        }
        public function get($id){
        	if($id==null){ return null; }        	
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.individuals_id as individuals_id, #__mb_events.families_id as families_id, #__mb_events.name as name, #__mb_events.type as type, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE `id`=?";
        	$this->ajax->setQuery($sqlString, $id);
        	$rows = $this->ajax->loadAssocList();
        	$event = $this->setEventData($rows[0]);
		return $event;
        }
        public function save($event, $type='IND'){
        	if($event==null||($event->IndKey!=null&&$event->FamKey!=null)){ return false; }
        	$sqlString = "INSERT INTO #__mb_events (`id`, `type`, `name`, `caus`, `res_agency`,`individuals_id`,`families_id`) VALUES (NULL,?,?,?,?,?,?)";
        	$this->ajax->setQuery($sqlString, $event->Type, $event->Name, $event->Caus, $event->ResAgency, $event->IndKey, $event->FamKey);
        	$this->ajax->query();
        	$lastId = $this->ajax->insertid();
        	$sqlString = "INSERT INTO #__mb_dates (`events_id`, `type`, `f_day`, `f_month`, `f_year`, `t_day`, `t_month`, `t_year`) VALUES (?,?,?,?,?,?,?,?)";
        	$this->ajax->setQuery($sqlString, $lastId, $event->DateType, ($event->From!=null)?$event->From->Day:$event->From, ($event->From!=null)?$event->From->Month:$event->From, ($event->From!=null)?$event->From->Year:$event->From, ($event->To!=null)?$event->To->Day:$event->To, ($event->To!=null)?$event->To->Month:$event->To, ($event->To!=null)?$event->To->Year:$event->To);
        	$this->ajax->query();
        	$this->locations->save($lastId, $event->Place);
        	return $lastId;
        }
        public function update($event, $type='IND'){
        	if($event==null||($event->IndKey!=null&&$event->FamKey!=null)){ return false; }
        	$sqlString = "UPDATE #__mb_events SET `type`=?,`name`=?,`caus`=?,`res_agency`=?,`individuals_id`=?,`families_id`=?,`change`=NOW()  WHERE id=?";
        	$this->ajax->setQuery($sqlString, $event->Type, $event->Name, $event->Caus, $event->ResAgency, $event->IndKey, $event->FamKey, $event->Id);
        	$this->ajax->query();
        	$sqlString = "UPDATE #__mb_dates SET `type`=?,`f_day`=?,`f_month`=?,`f_year`=?,`t_day`=?,`t_month`=?,`t_year`=?,`change`=NOW() WHERE events_id=?";
        	$this->ajax->setQuery($sqlString, $event->DateType, $event->From->Day, $event->From->Month, $event->From->Year, $event->To->Day, $event->To->Month, $event->To->Year, $event->Id);
        	$this->ajax->query();
        	if(empty($event->Place->Id)){
        		$this->locations->save($event->Id, $event->Place);
        	} else {
        		$this->locations->update($event->Id, $event->Place);
        	}
        	return true;
        }
        public function delete($id){
        	if($id==null){ return false; }
        	$this->ajax->setQuery('DELETE FROM #__mb_events WHERE id=?', $id);
        	$this->ajax->query();
        }
        public function setEventData($row){
        	$event = new Events();
        	$event->Id = $row['event_id'];
        	$event->Name = $row['name'];
		$event->Type = $row['type'];
		$event->DateType = $row['date_type'];
		$event->From->Day = $row['f_day'];
		$event->From->Month = $row['f_month'];
		$event->From->Year = $row['f_year'];
		$event->To->Day = $row['t_day'];
		$event->To->Month = $row['t_month'];
		$event->To->Year = $row['t_year'];
		$event->Caus = $row['caus'];
		$event->ResAgency = $row['res_agency']; 
		$event->Notes = NULL;
		$event->Sources = NULL;
		$event->Place = $this->locations->getPlaceByEventId($row['event_id']);
		$event->IndKey = (isset($row['individuals_id']))?$row['individuals_id']:null;
		$event->FamKey = (isset($row['families_id']))?$row['families_id']:null;
		return $event;
        }
        public function getPersonEvents($indKey){
        	if($indKey==null){ return null; }   
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.individuals_id as individuals_id, #__mb_events.type as type, #__mb_events.name as name, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE `individuals_id`=?";
        	$this->ajax->setQuery($sqlString, $indKey);
        	$rows = $this->ajax->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }
        public function getPersonEventsByType($indKey, $type){
        	if($indKey==null||$type==null){ return null; } 
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.individuals_id as individuals_id, #__mb_events.type as type, #__mb_events.name as name, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE #__mb_events.individuals_id=? AND #__mb_events.type=?";
        	$this->ajax->setQuery($sqlString, $indKey, $type);
        	$rows = $this->ajax->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }
        public function getFamilyEvents($famKey){
        	if($famKey==null){ return null; } 
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.families_id as families_id, #__mb_events.type as type, #__mb_events.name as name, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE #__mb_events.families_id=?";
        	$this->ajax->setQuery($sqlString, $famKey);
        	$rows = $this->ajax->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }    
        public function getAllEventsByIndKey($indKey){
        	if($indKey==null){ return null; }
        	$sqlString = "SELECT events.id as event_id,events.individuals_id as individuals_id, events.families_id as families_id, events.type as type, events.name as name, events.caus as caus, events.res_agency as res_agency,dates .type as date_type,dates .f_day as f_day,dates .f_month as f_month, dates .f_year as f_year, dates .t_day as t_day, dates .t_month as t_month, 
        	dates .t_year as t_year 
        	FROM jos_mb_events as events
        	LEFT JOIN jos_mb_dates as dates ON events.id = dates.events_id
        	LEFT JOIN jos_mb_families as families ON events.families_id = families.id
        	WHERE events.individuals_id= ? OR families.husb = ? OR families.wife = ?";
        	$this->ajax->setQuery($sqlString, $indKey, $indKey, $indKey);
        	$rows = $this->ajax->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }
        public function getIndividualsEventsList($tree_id, $gedcom_id = false){
        	$sql_string = "SELECT events.id as event_id, events.individuals_id as gedcom_id,events.type, events.name,
        				dates.type as date_type, dates.f_day,dates.f_month, dates.f_month, dates.f_year, dates.t_day, dates.t_month, dates.t_year  
        			FROM #__mb_events as events
        			LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = events.individuals_id";
        			////
        	if($gedcom_id){
        		$sql_string .= " WHERE links.tree_id = ? and links.individuals_id = ?";
        		$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
		} else {
			$sql_string .= " WHERE links.tree_id = ?";
			$this->ajax->setQuery($sql_string, $tree_id);
		}			
        	$rows = $this->ajax->loadAssocList('gedcom_id');
        	return $rows;
        }
        public function getFamiliesEvenetsList($tree_id, $gedcom_id = false){
        	$sql_string = "SELECT events.id as event_id, links.individuals_id as gedcom_id, events.families_id as family_id, events.type, events.name, 
        				dates.type as date_type, dates.f_day,dates.f_month, dates.f_month, 
        				dates.f_year, dates.t_day, dates.t_month, dates.t_year
        			FROM #__mb_events as events
        			LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
        			LEFT JOIN #__mb_families as family ON family.id = events.families_id
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = family.wife OR links.individuals_id = family.husb";
        	if($gedcom_id){
        		$sql_string .= " WHERE links.tree_id = ? and links.individuals_id = ?";
			    $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
		    } else {
                $sql_string .= " WHERE links.tree_id = ?";
                $this->ajax->setQuery($sql_string, $tree_id);
		    }
        	$rows = $this->ajax->loadAssocList('family_id');
        	return $rows;
        }
}
?>
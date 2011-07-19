<?php
class EventsList{
        public $core;

        function __construct($core){
        	 require_once 'class.event.php';
        	 $this->core=$core;
        	 $this->db = & JFactory::getDBO();
        }
        public function get($id){
        	if($id==null){ return false; }        	
        	$sqlString = "SELECT #__mb_events.id as event_id, #__mb_events.name as name, #__mb_events.type as type, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE `id`=?";
        	$sql = $this->core->sql($sqlString, $id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	$event = $this->setEventData($rows[0]);
		return $event;
        }
        public function save($event){
        	if($event==null){ return false; }
        	if($event->IndKey!=null&&$event->FamKey!=null){ return false; }
        	$sqlString = "INSERT INTO #__mb_events (`id`, `individuals_id`, `families_id`, `type`, `name`, `caus`, `res_agency`) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
        	$sql = $this->core->sql($sqlString, $event->IndKey, $event->FamKey, $event->Type, $event->Name, $event->Caus, $event->ResAgency);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	$lastId = $this->db->insertid();
        	$sqlString = "INSERT INTO #__mb_dates (`events_id`, `type`, `f_day`, `f_month`, `f_year`, `t_day`, `t_month`, `t_year`) VALUES (?,?,?,?,?,?,?,?)";
        	$sql = $this->core->sql($sqlString, $lastId, $event->DateType, $event->From->Day, $event->From->Month, $event->From->Year, $event->To->Day, $event->To->Month, $event->To->Year);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	$this->$this->core->locations->save($lastId, $event->Place);
        	return $lastId
        }
        public function update($event){
        	if($event==null){return false;}
        	if($event->IndKey!=null&&$event->FamKey!=null){ return false; }
        	$sqlString = "UPDATE #__mb_events SET `individuals_id`=?,`families_id`=?,`type`=?,`name`=?,`caus`=?,`res_agency`=?,`change`=NOW()  WHERE id=?";
        	$sql = $this->core->sql($sqlString, $event->IndKey, $event->FamKey, $event->Type, $event->Name, $event->Caus, $event->ResAgency, $event->Id);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	$sqlString = "UPDATE #__mb_dates SET `type`=?,`f_day`=?,`f_month`=?,`f_year`=?,`t_day`=?,`t_month`=?,`t_year`=?,`change`=NOW() WHERE events_id=?";
        	$sql = $this->core->sql($sqlString, $event->DateType, $event->From->Day, $event->From->Month, $event->From->Year, $event->To->Day, $event->To->Month, $event->To->Year, $event->Id);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	$this->$this->core->locations->update($event->Id, $event->Place);
        }
        public function delete($id){
        	if($id==null){ return false; }
        	$sql = $this->core->sql('DELETE FROM #__mb_events WHERE id=?', $id)
        	$this->db->setQuery($sql);    
        	$this->db->query();
        }
        public function setEventData($row){
        	$event = new Events();
        	$event->Id = $row['event_id'];
        	$event->Name = $row['name'];
		$event->Type = $row['type'];
		$event->DateType = $row['date_type'];
		$event->From = new EventDate();
		$event->From->Day = $row['f_day'];
		$event->From->Month = $row['f_month'];
		$event->From->Year = $row['f_year'];
		$event->To = new EventDate();
		$event->To->Day = $row['t_day'];
		$event->To->Month = $row['t_month'];
		$event->To->Year = $row['t_year'];
		$event->Caus = $row['caus'];
		$event->ResAgency = $row['res_agency']; 
		$event->Notes = NULL;
		$event->Sources = NULL;
		$event->Place = $this->core->locations->getPlaceByEventId($rows[0]['event_id']);
		$event->IndKey = (isset($row['individuals_id']))?$row['individuals_id']:null;
		$event->FamKey = (isset($row['families_id']))?$row['families_id']:null;
		return $event;
        }
        public function getPersonEvents($indKey){
        	if($indKey==null){ return false; }   
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.individuals_id as individuals_id, #__mb_events.type as type, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE `individuals_id`=?";
        	$sql = $this->core->sql($sqlString, $indKey)
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }
        public function getPersonEventsByType($indKey, $type){
        	if($indKey==null||$type==null){ return false; } 
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.individuals_id as individuals_id, #__mb_events.type as type, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE #__mb_events.individuals_id=? AND #__mb_events.type=?";
        	$sql = $this->core->sql($sqlString, $indKey, $type);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }
        public function getFamilyEvents($famKey){
        	if($famKey==null){ return false; } 
        	$sqlString = "SELECT #__mb_events.id as event_id,#__mb_events.families_id as families_id, #__mb_events.type as type, #__mb_events.caus as caus, #__mb_events.res_agency as res_agency,#__mb_dates.type as date_type,
        			#__mb_dates.f_day as f_day,#__mb_dates.f_month as f_month, #__mb_dates.f_year as f_year, #__mb_dates.t_day as t_day, #__mb_dates.t_month as t_month, 
        			#__mb_dates.t_year as t_year FROM #__mb_events 
        		LEFT JOIN #__mb_dates ON #__mb_events.id = #__mb_dates.events_id
        		WHERE #__mb_events.families_id=?";
        	$sql = $this->core->sql($sqlString, $famKey)
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	$events = array();
        	foreach($rows as $row){
        		$events[] = $this->setEventData($row);
        	}
        	return $events;
        }    
        
        /*
         function  __construct($core) {
            require_once 'class.event.php';
            $this->core=$core;
            $this->months = array(
                'All months'=>'',
                'January'=>'1',
                'February'=>'2',
                'March'=>'3',
                'April'=>'4',
                'May'=>'5',
                'June'=>'6',
                'July'=>'7',
                'August'=>'8',
                'September'=>'9',
                'October'=>'10',
                'November'=>'11',
                'December'=>'12'
            );
            $this->gedmonths = array(
                1=>'JAN',
                2=>'FEB',
                3=>'MAR',
                4=>'APR',
                5=>'MAY',
                6=>'JUN',
                7=>'JUL',
                8=>'AUG',
                9=>'SEP',
                10=>'OCT',
                11=>'NOV',
                12=>'DEC'
            );
            $this->types = array(
                'ANUL'=>'Annulment',
                'CENS'=>'Census',
                'DIV' =>'Divorce',
                'DIVF'=>'Divorce Filed',
                'ENGA'=>'Engagement',
                'MARR'=>'Marriage',
                'MARB'=>'Marriage Bann',
                'MARC'=>'Marriage Contract',
                'MARL'=>'Marriage License',
                'MARS'=>'Marriage Settlement',
                'BIRT'=>'Birth',
                'CHR' =>'Christening',
                'DEAT'=>'Death',
                'BURI'=>'Burial',
                'CREM'=>'Cremation',
                'ADOP'=>'Adoption',
                'BAPM'=>'Baptism',
                'BARM'=>'Bar Mitzvah',
                'BASM'=>'Bas Mitzvah',
                'BLES'=>'Blessing',
                'CHRA'=>'Adult Christening',
                'CONF'=>'Confirmation',
                'FCOM'=>'First Communion',
                'ORDN'=>'Ordination',
                'NATU'=>'Naturalization',
                'EMIG'=>'Emigration',
                'IMMI'=>'Immigration',
                'CENS'=>'Census',
                'PROB'=>'Probate',
                'WILL'=>'Will',
                'GRAD'=>'Graduation',
                'RETI'=>'Retirement',
                'RESI'=>'Residence',
                'OCCU'=>'Occupation',
                'CAST'=>'Caste',
                'DSCR'=>'Physical Description',
                'EDUC'=>'Education',
                'IDNO'=>'National ID Number',
                'NATI'=>'Nationality',
                'PROP'=>'Possessions',
                'RELI'=>'Religion',
                'SSN'=>'Social Security Number'
            );
        }
        public function update($event){  
            if($event->Id){
                $event->checkDate();
                $db =& JFactory::getDBO();
                $req = "UPDATE #__mb_dates SET d_year='".$event->Year."', d_mon='".$event->Month."', d_day='".$event->Day."', d_month='' WHERE d_id='".$event->Id."'";
                $db->setQuery($req);
                $db->query();
                $this->core->locations->update($event->Place, $event->Id);
            }
        }

        public function getGedcomString($id){
            $event = $this->core->events->get($id);
            $str = '';
            if($event != null){
                if($event->Type != ''){
                    $str .= "1 {$event->Type}\n";
                   
                    $date = ($event->Day!=''&&$event->Day!='0' ? $event->Day.' ' : '').($event->Month!=''&&$event->Month!='0' ? $this->gedmonths[$event->Month+0].' ' : '').($event->Year!=''&&$event->Year!='0' ? $event->Year.' ' : '');
                    if($date != '')
                        $str .= "2 DATE {$date}\n";
                    $place = ($event->Place != null ? $event->Place->toString() : '');
                    if($place != '')
                        $str .= "2 PLAC {$place}\n";
                    $sources = $this->core->sources->getLinkedSources($event->Id);
                    if($sources != null)
                        foreach ($sources as $source){
                            $str .= "2 SOUR @{$source->Id}@\n";
                        }

                    $notes = $this->core->notes->getLinkedNotes($event->Id);
                    if($notes != null)
                        foreach ($notes as $note){
                            $str .= "2 NOTE @{$note->Id}@\n";
                        }
                }
            }
            return $str;
        }
        public function save($event){
            if($event->IndKey){
               //$this->checkDate($event);
                $db =& JFactory::getDBO();
                $req = "INSERT INTO  #__mb_dates (`d_id` ,`d_day` ,`d_month` ,`d_mon` ,`d_year` ,`d_julianday1` ,`d_julianday2` ,`d_fact` ,`d_gid` ,`d_file`, `d_type`)
		VALUES (
		'".$event->Id."','".$event->Day."','','".$event->Month."','".$event->Year."','','','".$event->Type."','".$event->IndKey."',
		'"."', '@#DGREGORIAN@')";

                $db->setQuery($req);
                $db->query();
               
                if($event->Place->Hierarchy != null&&count($event->Place->Hierarchy>0)){
                    $place = $this->core->locations->save($event->Place);
                    $this->core->locations->linkLocation($place, $event->Id);
                }
              //  $this->updateLinkedIndivodual(&$event);
            }
        }
        public function delete($id){
            $db =& JFactory::getDBO();
            $req = 'DELETE FROM #__mb_dates WHERE d_id='.$id;
            $db->setQuery($req);

            $db->query();
        }
        function getNewId(){
            $db =& JFactory::getDBO();
            $req = 'SELECT max(d_id) from #__mb_dates';
            $db->setQuery($req);


            $rows = $db->loadAssocList();
            if($rows == null){
               $newid = '1' ;
            }else{
                $newid = $rows[0]['max(d_id)']+1 ;
            }
            return $newid;

        }
        
      
        
        public function checkDate($event){
            if($event->Year != ""){
                if(strlen($event->Year)<4)
                        while(strlen($this->Year)<4)
                             $event->Year = "0".$this->Year;
                while(strlen($event->Day)<2)
                             $event->Day = "0".$this->Day;
                while(strlen($event->Month)<2)
                             $event->Month = "0".$this->Month;
                }else{
                    $event->Year = "";
                    $event->Day = "";
                    $event->Month = "";
                }
        }
        function get($factkey, $lite=false){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT * FROM `#__mb_dates`
                    WHERE d_id="'.$factkey.'"');
            $rows = $db->loadAssocList();

            if($rows[0]['d_year'] != "" && $rows[0]['d_year'] != "0"){
                $year = $rows[0]['d_year'];
                $month = $rows[0]['d_mon'];
                $day = $rows[0]['d_day'];
            }else{
                $year = "";
                $month = "";
                $day = "";
            }
            $ev = new Events($rows[0]['d_id'], $rows[0]['d_fact'], $day, $month, $year, $rows[0]['d_gid'], $this->core->locations->getLinkedLocation($rows[0]['d_id']), ($lite ? null : $this->core->notes->getLinkedNotes($rows[0]['d_id'])), ($lite ? null : $this->core->sources->getLinkedSources($rows[0]['d_id']))) ;
            
            return $ev;

        }

        //get array of events binded to specified person
        function getPersonsEvents($id, $lite=false){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT #__mb_dates.d_id FROM `#__mb_dates` LEFT JOIN #__mb_individuals on #__mb_individuals.i_id = #__mb_dates.d_gid
                    WHERE d_gid="'.$id.'"');
            
            $rows = $db->loadAssocList();
            $events = array ();

            if($rows != null){
             
                foreach($rows as $row){
                 
                    $ev =  $this->get($row['d_id'], $lite);
                    $events[] = $ev;
                }
            }
            return $events;
        }
        function getFamilyEvents($fam_id, $lite=false){
            $db =& JFactory::getDBO();
            $req = 'SELECT distinct #__mb_dates.d_id, #__mb_families.f_id AS family_id, #__mb_dates.d_day AS
                    day, #__mb_dates.d_mon AS
                    month, #__mb_dates.d_year AS year, #__mb_dates.d_fact AS
                    type
                    FROM #__mb_families
                    LEFT JOIN #__mb_dates ON #__mb_families.f_id = #__mb_dates.d_gid
                    WHERE #__mb_families.f_id = "'.$fam_id.'"';
            
                $db->setQuery($req);
                $rows = $db->loadAssocList();
                
                $events = array();
                if($rows != null){
                    $gedArray;
                   // $gedstr =
                    foreach($rows as $row){
                    
                         $ev =  $this->get($row['d_id'],  $lite);
                      
                        $events[] = $ev;
                    }
                }
                return $events;
        }
        function getFamilyEvent($id, $spId = "", $lite=false){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT distinct #__mb_dates.d_id, #__mb_families.f_id AS family_id,#__mb_dates.d_day AS
                    day, #__mb_dates.d_mon AS
                    month, #__mb_dates.d_year AS year, #__mb_dates.d_fact AS
                    type , husband.n_id AS husband_id, husband.n_givn AS husband_givenname, husband.n_surname AS husband_surname, wife.n_id AS wife_id, wife.n_givn AS wife_givenname, wife.n_surname AS wife_surname
                    FROM #__mb_families
                    LEFT JOIN #__mb_dates ON #__mb_families.f_id = #__mb_dates.d_gid
                    LEFT JOIN #__mb_name AS husband ON husband.n_id = #__mb_families.f_husb
                    LEFT JOIN #__mb_name AS wife ON wife.n_id = #__mb_families.f_wife
                  
                    WHERE #__mb_dates.d_id = "'.$id.'"');
            $rows = $db->loadAssocList();

            if($rows != null){

                if($rows[0]['d_year'] != "" && $rows[0]['d_year'] != "0"){
                    $year = $rows[0]['d_year'];
                    $month = $rows[0]['d_mon'];
                    $day = $rows[0]['d_day'];
                }else{
                    $year = "";
                    $month = "";
                    $day = "";
                }
                if($spId==$rows[0]['wife_id']){
                    $spouse = $this->core->individuals->get($rows[0]['husband_id'],$lite);
                     $spouse2 = $this->core->individuals->get($rows[0]['wife_id'],$lite);
                }else{
                    $spouse = $this->core->individuals->get($rows[0]['wife_id'],$lite);
                     $spouse2 = $this->core->individuals->get($rows[0]['husband_id'],$lite);
                }
              
                $ev = new FamilyEvent($rows[0]['d_id'], $spouse, $spouse2,$day, $month, $year,  $rows[0]['type'], $rows[0]['d_gid'], $this->core->locations->getLinkedLocation($rows[0]['d_id']), ($lite ? null : $this->core->notes->getLinkedNotes($rows[0]['d_id'])), ($lite ? null : $this->core->sources->getLinkedSources($rows[0]['d_id']))) ;
            }
            return $ev;

        }            
        
        function personsFamilyEvents($id, $lite=false){
            $db =& JFactory::getDBO();
            $req = 'SELECT distinct #__mb_dates.d_id
                    FROM #__mb_families
                    LEFT JOIN #__mb_dates ON #__mb_families.f_id = #__mb_dates.d_gid
                    LEFT JOIN #__mb_name AS husband ON husband.n_id = #__mb_families.f_husb
                    LEFT JOIN #__mb_name AS wife ON wife.n_id = #__mb_families.f_wife
                  
                    WHERE #__mb_families.f_husb = "'.$id.'" OR #__mb_families.f_wife = "'.$id.'"';
            //echo $req;
                $db->setQuery($req);
              
                $rows = $db->loadAssocList();
                $events = array();
                $gedArray;
            
                if($rows != null)
                    foreach($rows as $row){
               
                        $events[] = $this->getFamilyEvent($row['d_id'], $id, $lite);
                        
                    }
                
                return $events;
        }
        //fills Events, Birth, Death fields of given person object
        function assignPersonsEvents(&$person, &$gedArray=null){
            if($person->Id&&$person->Id!=""){
                $db =& JFactory::getDBO();
                $db->setQuery('SELECT #__mb_dates.* FROM `#__mb_dates` LEFT JOIN #__mb_individuals on #__mb_individuals.i_id = #__mb_dates.d_gid
                        WHERE d_gid="'.$person->Id.'"');

                $rows = $db->loadAssocList();
                
                if($rows != null)
                    foreach($rows as $row){
                   
                        $ev =  $this->get($row['d_id']);
                       
                       // $this->assignEventPlace($ev, $gedArray);
                        if($ev->Type=="BIRT"){
                             $person->Birth = $ev;
                        }else
                        if($ev->Type=="DEAT"){
                            $person->Death = $ev;
                        }else
                            $person->Events[] = $ev;
                    }
                    
                   
            }
        }
        public function getDescendantsEvents($id,  $lite=true){
            $array = array();
            $this->core->individuals->getDescendants($array, $id);
            $result = array();
            $index = 0;
            foreach($array as $k => $v){
            	  $events = $this->getPersonsEvents($v['id'], $lite);
            	  $famevents = $this->personsFamilyEvents($v['id'], $lite);
            	  $events = array_merge($events,$famevents);
            	  $result[$index]['person'] = new Individual($v['id'], $v['givenname'], $v['middlename'], $v['surname'], $v['suffix'], $v['sex']);
		  $result[$index]['events'] = $events;
		  $index++;             	  
            }
            return $result;
        }
        
        
        function updateGedArray(&$event, &$gedArray){    
        }
        function assignEventPlace(&$event){   
        }
       
        //get list of all event types in db
        function getTypes(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT d_fact as type FROM `#__mb_dates`
                    GROUP BY type');
            $rows = $db->loadAssocList();

            return $rows;
        }
        //append filtering expressions to sql request
        //params: month('01'-'12'), type(as it is in db),
        function attachConditions($month, $type, $filter){
            $req;
            if($month||$type||$filter){
                $where_added = false;
                 if($type&&$type!="All types"){
                     foreach ($this->types as $key => $value) {
                         if($value==$type){
                             $type = $key;
                         }
                     }
                     $req .= ' WHERE dat.d_fact="'.$type.'" ';
                     $where_added = true;
                 }
                 if($filter&&$filter!=""){
                     $req .=  ($where_added ? ' AND ' : ' WHERE ') .' (
                        REPLACE( REPLACE(CONCAT( husband.n_givn, husband.n_surname, wife.n_givn, wife.n_surname ), "@N.N.", "") , "@P.N.", "") LIKE "%'.mysql_real_escape_string($filter).'%" OR
                        REPLACE( REPLACE(CONCAT( indiv.n_givn, indiv.n_surname ), "@N.N.", "") , "@P.N.", "") LIKE "%'.mysql_real_escape_string($filter).'%" OR
                        dat.d_day LIKE "%'.mysql_real_escape_string($filter).'%"  OR
                        dat.d_mon LIKE "%'.mysql_real_escape_string($filter).'%" OR
                        dat.d_year LIKE "%'.mysql_real_escape_string($filter).'%" )';
                 }
                 if($month&&$month!=""&&$month!="All months"){
                    if(($type&&$type!="All types")||($filter&&$filter!=""))
                        $req .= ' AND ';
                    else
                        $req .= ' WHERE ';
                     $req .= ' dat.d_mon ='. $month;
                 }
             }
             return $req;
        }
        //returns number of event records in db
        function count($months=null, $type=null, $filter=null){
            $db =& JFactory::getDBO();

            $req = 'SELECT COUNT(*)
                    FROM `#__mb_dates` as `dat`
                    LEFT JOIN #__mb_families ON dat.d_gid = #__mb_families.f_id
                    LEFT JOIN #__mb_dates AS check_living ON (dat.d_gid = check_living.d_gid and check_living.d_fact="DEAT")
                    LEFT JOIN #__mb_name AS husband ON #__mb_families.f_husb = husband.n_id
                    LEFT JOIN #__mb_name AS wife ON #__mb_families.f_wife = wife.n_id
                    LEFT JOIN #__mb_name AS indiv ON dat.d_gid = indiv.n_id
                    LEFT JOIN #__mb_individuals ON dat.d_gid = #__mb_individuals.i_id ';
            $req .= $this->attachConditions($months, $type, $filter);
        
            $db->setQuery($req);
             $rows = $db->loadAssocList();

             return $rows[0]['COUNT(*)'];
        }
        //gets array of events
        //params: current page<int>, number of records per page<int>, gedcom event type, filter, sort parameter('date', 'name', 'type'), sorting order(ASC or DESC)
        function getRecords($months, $type, $filter, $sort, $order, $page="-1", $perpage="-1"){
            $db =& JFactory::getDBO();

            $req = 'SELECT distinct dat.d_id as id, dat.d_fact as type,dat.d_year as year, dat.d_mon as month, dat.d_gid as object_id, dat.d_day as day, REPLACE(REPLACE(CONCAT( husband.n_givn, " ", husband.n_surname, " and ", wife.n_givn, " ", wife.n_surname ), "@N.N.", "(unknown)"), "@P.N.", "(unknown)") AS family, REPLACE(REPLACE(CONCAT( indiv.n_givn, " ", indiv.n_surname ), "@N.N.", "(unknown)"), "@P.N.", "(unknown)") AS person,
                    REPLACE(REPLACE(wife.n_full, "@N.N.", "(unknown)"), "@P.N.", "(unknown)") as wife,  REPLACE(REPLACE(husband.n_full, "@N.N.", "(unknown)"), "@P.N.", "(unknown)") as husband,IF( (
                    check_living.d_fact is NULL
                    ), "0", "1" ) AS isdead,
                    #__mb_individuals.i_sex AS sex,
                    wife.n_id as wife_id,
                    husband.n_id as husband_id
                    FROM `#__mb_dates` as `dat`
                    LEFT JOIN #__mb_families ON dat.d_gid = #__mb_families.f_id
                    LEFT JOIN #__mb_dates AS check_living ON (dat.d_gid = check_living.d_gid and check_living.d_fact="DEAT")
                    LEFT JOIN #__mb_name AS husband ON #__mb_families.f_husb = husband.n_id
                    LEFT JOIN #__mb_name AS wife ON #__mb_families.f_wife = wife.n_id
                    LEFT JOIN #__mb_name AS indiv ON dat.d_gid = indiv.n_id

                    LEFT JOIN #__mb_individuals ON dat.d_gid = #__mb_individuals.i_id';
       
            $req .= $this->attachConditions($months, $type, $filter);
            if($sort&&$order){
                 if($sort == "name")
                     $req.= " ORDER BY person ".$order.", family ".$order;
                 elseif($sort == "date"){
                     $req.= " ORDER BY year ".$order.", month ".$order.", day ".$order." ";
                 }else
                     $req.= " ORDER BY ".$sort ." ".$order;
             }
             if(($page!="-1")&&($perpage!="-1")){
                 $req.= " LIMIT ".$page*$perpage.", ".$perpage;
             }
           
             $db->setQuery($req);
             $rows = $db->loadAssocList();
             if($rows != null){
                $count = count($rows);
                for($i=0; $i<$count; $i++){
                   // var_dump($this->core->locations->getLinkedLocation( $rows[$i]['id']));
                 //   var_dump($this->core->notes->getLinkedNotes( $rows[$i]['id']));
                    $rows[$i]['location'] = $this->core->locations->getLinkedLocation( $rows[$i]['id']);
                    
                    $rows[$i]['notes'] = $this->core->notes->getLinkedNotes( $rows[$i]['id']);
                }
             }
             
             return $rows;
        }

        function getRecordsUponYear($year, $relation, $month, $type, $filter, $sort, $order, $page="-1", $perpage="-1"){
            $db =& JFactory::getDBO();

            $req = 'SELECT distinct dat.d_id as id, dat.d_fact as type,dat.d_year as year, dat.d_mon as month, dat.d_gid as object_id, dat.d_day as day, REPLACE(REPLACE(CONCAT( husband.n_givn, " ", husband.n_surname, " and ", wife.n_givn, " ", wife.n_surname ), "@N.N.", "(unknown)"), "@P.N.", "(unknown)") AS family, REPLACE(REPLACE(CONCAT( indiv.n_givn, " ", indiv.n_surname ), "@N.N.", "(unknown)"), "@P.N.", "(unknown)") AS person,
                    REPLACE(REPLACE(wife.n_full, "@N.N.", "(unknown)"), "@P.N.", "(unknown)") as wife,  REPLACE(REPLACE(husband.n_full, "@N.N.", "(unknown)"), "@P.N.", "(unknown)") as husband,IF( (
                    check_living.d_fact is NULL
                    ), "0", "1" ) AS isdead,
                    #__mb_individuals.i_sex AS sex,
                    wife.n_id as wife_id,
                    husband.n_id as husband_id
                    FROM `#__mb_dates` as `dat`
                    LEFT JOIN #__mb_families ON dat.d_gid = #__mb_families.f_id
                    LEFT JOIN #__mb_dates AS check_living ON (dat.d_gid = check_living.d_gid and check_living.d_fact="DEAT")
                    LEFT JOIN #__mb_name AS husband ON #__mb_families.f_husb = husband.n_id
                    LEFT JOIN #__mb_name AS wife ON #__mb_families.f_wife = wife.n_id
                    LEFT JOIN #__mb_name AS indiv ON dat.d_gid = indiv.n_id
                    LEFT JOIN #__mb_individuals ON dat.d_gid = #__mb_individuals.i_id';

            $conditions;
            if($month||$type||$filter||$year){
                $where_added = false;
                 if($type&&$type!="All types"){
                     foreach ($this->types as $key => $value) {
                         if($value==$type){
                             $type = $key;
                         }
                     }
                     $conditions .= ' WHERE dat.d_fact="'.$type.'" ';
                     $where_added = true;
                 }
                 if($filter&&$filter!=""){

                     $conditions .=  ($where_added ? ' AND ' : ' WHERE ') .' (
                        REPLACE( REPLACE(CONCAT( husband.n_givn, husband.n_surname, wife.n_givn, wife.n_surname ), "@N.N.", "") , "@P.N.", "") LIKE "%'.mysql_real_escape_string($filter).'%" OR
                        REPLACE( REPLACE(CONCAT( indiv.n_givn, indiv.n_surname ), "@N.N.", "") , "@P.N.", "") LIKE "%'.mysql_real_escape_string($filter).'%" OR
                        dat.d_day LIKE "%'.mysql_real_escape_string($filter).'%"  OR
                        dat.d_mon LIKE "%'.mysql_real_escape_string($filter).'%" OR
                        dat.d_year LIKE "%'.mysql_real_escape_string($filter).'%" )';
                     $where_added = true;
                 }
                 if($month&&$month!=""&&$month!="All months"){
                    if(($where_added))
                        $conditions .= ' AND ';
                    else
                        $conditions .= ' WHERE ';
                     $conditions .= ' dat.d_mon ='. $month;
                     $where_added = true;
                 }
                 if($year != "" ){
                     if(($where_added))
                        $conditions .= ' AND ';
                    else
                        $conditions .= ' WHERE ';
                    $rel;
                    if($relation=='-1')
                        $rel = '<';
                    else if($relation=='0')
                        $rel = '=';
                    else if($relation=='1')
                        $rel = '>';

                     $conditions .= ' dat.d_year '.$rel.' '. $year.' ';
                     $where_added = true;
                 }
             }

            $req .= $conditions;


            if($sort&&$order){
                 if($sort == "name")
                     $req.= " ORDER BY person ".$order.", family ".$order;
                 elseif($sort == "date"){
                     $req.= " ORDER BY year ".$order.", month ".$order.", day ".$order." ";
                 }else
                     $req.= " ORDER BY ".$sort ." ".$order;
             }
             if(($page!="-1")&&($perpage!="-1")){
                 $req.= " LIMIT ".$page*$perpage.", ".$perpage;
             }

             $db->setQuery($req);
             $rows = $db->loadAssocList();
             if($rows != null){
                $count = count($rows);
                for($i=0; $i<$count; $i++){
                    
                    $rows[$i]['location'] = $this->core->locations->getLinkedLocation($rows[$i]['id']);
                    $rows[$i]['notes'] = $this->core->notes->getLinkedNotes($rows[$i]['id']);
                }
             }
             return $rows;
        }
        
        
        function getEarliestBirth(){
            $row = $this->getByFunctOfType("MIN","BIRT");
            return $row["MIN(d_year)"];

        }
        function getLatestBirth(){
            $row = $this->getByFunctOfType("MAX","BIRT");
            return $row["MAX(d_year)"];

        }
        function getByFunctOfType($func,$type){
                    $db =& JFactory::getDBO();    
                    $req = 'SELECT '.$func.'(d_year) FROM #__mb_dates WHERE d_fact="'.$type.'" AND d_year !="" AND d_year !=0';
                   
                    $db->setQuery($req);
                    $rows = $db->loadAssocList();
                    
                    return $rows[0];

        }
        */
}
?>
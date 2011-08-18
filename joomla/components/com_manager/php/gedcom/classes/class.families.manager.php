<?php
class FamiliesList{
	public $core;

	function  __construct($core) {
		require_once 'class.family.php';
		$this->core = $core;
		$this->db = & JFactory::getDBO();
        }
        public function get($id, $lite=false){
        	if($id==NULL) { return null; }
        	$sql = $this->core->sql('SELECT id,husb,wife FROM #__mb_families WHERE id=?',$id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	if($rows == null) { return false; }
                return $this->setData($id ,$rows[0], $lite);
        }
        public function save($family){
        	if(($family->Sircar != null && $family->Sircar->Id)||($family->Spouse != null && $family->Spouse->Id)){
        		$id1 = ($family->Sircar != null && $family->Sircar->Id) ? $family->Sircar->Id : '';
        		$id2 = ($family->Spouse != null && $family->Spouse->Id) ? $family->Spouse->Id : '';

			if($family->Sircar != null){
				if($family->Sircar->Gender == 'M'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
			}elseif($family->Spouse != null){
				if($family->Spouse->Gender == 'F'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
			}else{
			    $husb = NULL;
			    $wife = NULL;
			}
                }
		$sqlString = "INSERT INTO #__mb_families (`id`, `husb`, `wife`,`type`) VALUES (NULL, ?, ?, ?)";
		$sql = $this->core->sql($sqlString, $husb, $wife, $family->Type);
		$this->db->setQuery($sql);    
        	$this->db->query();
        	return $this->db->insertid();
        }
        public function update($family){
        	if($family->Id==NULL) { return false; }
        	if(($family->Sircar != null && $family->Sircar->Id)||($family->Spouse != null && $family->Spouse->Id)){
        		$id1 = ($family->Sircar != null && $family->Sircar->Id) ? $family->Sircar->Id : '';
        		$id2 = ($family->Spouse != null && $family->Spouse->Id) ? $family->Spouse->Id : '';

			if($family->Sircar != null){
				if($family->Sircar->Gender == 'M'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
			}elseif($family->Spouse != null){
				if($family->Spouse->Gender == 'F'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
			}else{
			    $husb = NULL;
			    $wife = NULL;
			}
                }
		$sqlString = "UPDATE #__mb_families SET `husb`=?,`wife`=?,`type`=?,`change`=NOW() WHERE `id`=?";
		$sql = $this->core->sql($sqlString, $husb, $wife,$family->Type,$family->Id);
		$this->db->setQuery($sql);    
        	$this->db->query();
        	return true;
        }
        public function delete($id){
        	if($id==NULL){ return false; }
        	$sql = $this->core->sql('DELETE FROM #__mb_families WHERE id=?',$id);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	return true;
        }
        public function setData($id, $row, $lite){
        	$sircar = $this->core->individuals->get($id, $lite);
        	if($id == $row['husb']){
        		$spouse = $this->core->individuals->get($row['wife'], $lite);
        	} else {
        		$spouse = $this->core->individuals->get($row['husb'], $lite);
        	}
        	$events = (!$lite)?$this->core->events->getFamilyEvents($row['id']):null;
        	$marriage = null;
                $divorce = null;
                if($events != null){
                    foreach($events as $event){
                        if($event->Type=="MARR")
                             $marriage = $event;
                        if($event->Type=="DIV")
                             $divorce = $event;
                    }
                }
                $family = new Family();
                $family->Id = $row['id'];
                $family->Sircar = $sircar;
                $family->Spouse = $spouse;
                $family->Marriage = $marriage;
                $family->Divorce = $divorce;
                $family->Events = $events;
                return $family;
        }
        public function addChild($fId, $id, $fRel=null, $mRel=null){
        	if($fId==null||$id==null) { return false; }
        	$sqlString = "INSERT INTO #__mb_childrens (`fid`, `gid`, `frel`, `mrel`) VALUES (?,?,?,?)";
        	$sql = $this->core->sql($sqlString, $fId, $id, $fRel, $mRel);
		$this->db->setQuery($sql);    
        	$this->db->query();
        }
        public function getPersonsFamilies($indKey, $lite=false){
        	if($indKey==null){ return null; }
        	$sql = $this->core->sql('SELECT id, husb, wife, type FROM #__mb_families WHERE husb=? OR wife=?', $indKey, $indKey);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	$families = array();
        	foreach($rows as $row){        		
        		$families[] = $this->setData($indKey, $row, $lite);
        	}
        	return $families;
        	
        }
        public function getFamilyChildrenIds($fId){
        	if($fId==null) { return null; }
        	$sql = $this->core->sql('SELECT gid FROM #__mb_childrens WHERE fid=?', $fId);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	if($rows!=null){
        		return $rows;
        	} else{ 
        		return array();
        	}
        }
        public function getByEvent($treeId, $type, $month, $sort=false){
        	$sqlString = "SELECT family.id, family.husb, family.wife 
				FROM #__mb_families AS family
				LEFT JOIN #__mb_tree_links AS tree_links ON family.husb = tree_links.individuals_id OR family.wife = tree_links.individuals_id
				LEFT JOIN #__mb_events AS event ON family.id = event.families_id
				LEFT JOIN #__mb_dates AS date ON event.id = date.events_id
				WHERE tree_links.tree_id =?";
        	$sqlString .= "AND event.type=?";
        	$sqlString .= "AND date.f_month=?";
        	if($sort[0]!='false'){
        		$sqlString .= ((int)$sort[0]<0)?"AND date.f_year < ?":"AND date.f_year > ?";
        		$sqlString .= " GROUP BY family.id";
        		$sql = $this->core->sql($sqlString, $treeId, $type, $month, $sort[1]);
        	} else {
        		$sqlString .= " GROUP BY family.id";
        		$sql = $this->core->sql($sqlString, $treeId, $type, $month);
        	}
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }
	/*
        function  __construct($core) {
            $this->core = $core;
        }
        function count(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT COUNT(*) FROM `#__mb_families`');
            $rows = $db->loadAssocList();
            return $rows[0]['COUNT(*)'];
        }
        function totalChildren(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT COUNT(*) FROM `#__mb_link` WHERE l_type="CHIL"');
            $rows = $db->loadAssocList();
            return $rows[0]['COUNT(*)'];
        }
        function delete($family){
            $db =& JFactory::getDBO();
            $req = 'DELETE FROM #__mb_families where f_id ="'.$family->Id.'"';
            $db->setQuery($req);
            $db->query();
            
            $req = 'DELETE FROM #__mb_link WHERE (l_type="HUSB" OR l_type="WIFE" OR l_type="FAMS" ) AND l_to="'.$family->Id.'"';
            $db->setQuery($req);
            $db->query();
        }
        function addChild($famId, $childId){
        	$db =& JFactory::getDBO();
        	$sql = "INSERT INTO `#__mb_link` (`l_file` ,`l_from` ,`l_type` ,`l_to`)VALUES ('', '".$famId."', 'CHIL', '".$childId."'), ('', '".$childId."', 'FAMC', '".$famId."')";
		$db->setQuery($sql);
		$db->query();
        }
        function save($family){
            $db =& JFactory::getDBO();
            if(($family->Sircar != null && $family->Sircar->Id)||($family->Spouse != null && $family->Spouse->Id)){
                $id1 = ($family->Sircar != null && $family->Sircar->Id) ? $family->Sircar->Id : '';
                $id2 = ($family->Spouse != null && $family->Spouse->Id) ? $family->Spouse->Id : '';

                if($family->Sircar != null){
                    if($family->Sircar->Gender == 'M'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
                }elseif($family->Spouse != null){
                    if($family->Spouse->Gender == 'F'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
                }else{
                    $husb = '';
                    $wife = '';
                }
            }
            $req = 'INSERT INTO #__mb_families (`f_husb`,`f_wife`,`f_id`) VALUES ("'.$husb.'","'.$wife.'","'.$family->Id.'")';
            
            $db->setQuery($req);
            $db->query();
            if($family->Sircar != null && $family->Sircar->Id){
                $req = 'INSERT INTO #__mb_link (`l_from`, `l_type`, `l_to`) VALUES ("'.$family->Id.'","'.($family->Sircar->Gender=='M'?'HUSB':'WIFE').'","'.$family->Sircar->Id.'"), ("'.$family->Sircar->Id.'","FAMS","'.$family->Id.'")';
                $db->setQuery($req);
                $db->query();
           
            }
            if($family->Spouse != null && $family->Spouse->Id){
                $req = 'INSERT INTO #__mb_link (`l_from`, `l_type`, `l_to`) VALUES ("'.$family->Id.'","'.($family->Spouse->Gender=='M'?'HUSB':'WIFE').'","'.$family->Spouse->Id.'"), ("'.$family->Spouse->Id.'","FAMS","'.$family->Id.'")';
                $db->setQuery($req);
                $db->query();
            } 
        }
        function update($family){
        	$db =& JFactory::getDBO();
		    if(($family->Sircar != null && $family->Sircar->Id)||($family->Spouse != null && $family->Spouse->Id)){
			$id1 = ($family->Sircar != null && $family->Sircar->Id) ? $family->Sircar->Id : '';
			$id2 = ($family->Spouse != null && $family->Spouse->Id) ? $family->Spouse->Id : '';
	
			if($family->Sircar != null){
			    if($family->Sircar->Gender == 'M'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
			}elseif($family->Spouse != null){
			    if($family->Spouse->Gender == 'F'){ $husb = $id1; $wife = $id2;}else{$husb = $id2; $wife = $id1;}
			}else{
			    $husb = '';
			    $wife = '';
			}
		    }
        	
        	# update husband and wife in #__mb_families
        	$req = "UPDATE `#__mb_families` SET `f_husb` = '".$family->Sircar->Id."', `f_wife` = '".$family->Spouse->Id."' WHERE `#__mb_families`.`f_id` = '".$family->Id."'";	
        	$db->setQuery($req);
        	$db->query();
        	
        	$req = "DELETE FROM `#__mb_link` WHERE `l_to`='".$family->Id."' AND `l_type`='FAMS'";
        	$db->setQuery($req);
        	$db->query();
        	
        	#rewrites links in #__mb_links       	
        	if($family->Sircar != null && $family->Sircar->Id){        		
        		$req = "DELETE FROM `#__mb_link` WHERE `l_from`='".$family->Id."' AND `l_type`='".($family->Sircar->Gender=='M'?'HUSB':'WIFE')."'";
        		$db->setQuery($req);
        		$db->query();
        		
        		$req = 'INSERT INTO #__mb_link (`l_from`, `l_type`, `l_to`) VALUES ("'.$family->Id.'","'.($family->Sircar->Gender=='M'?'HUSB':'WIFE').'","'.$family->Sircar->Id.'"), ("'.$family->Sircar->Id.'","FAMS","'.$family->Id.'")';
        		$db->setQuery($req);
        		$db->query();
        		
        	}
		if($family->Spouse != null && $family->Spouse->Id){
			$req = "DELETE FROM `#__mb_link` WHERE `l_from`='".$family->Id."' AND `l_type`='".($family->Spouse->Gender=='M'?'HUSB':'WIFE')."'";
			$db->setQuery($req);
        		$db->query();
			
			 $req = 'INSERT INTO #__mb_link (`l_from`, `l_type`, `l_to`) VALUES ("'.$family->Id.'","'.($family->Spouse->Gender=='M'?'HUSB':'WIFE').'","'.$family->Spouse->Id.'"), ("'.$family->Spouse->Id.'","FAMS","'.$family->Id.'")';
			 $db->setQuery($req);
			 $db->query();
		}
        }
        function getAllIds(){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_families.f_id as id FROM #__mb_families';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            return $rows;
        }
        function getGedcomString($fam_id){
            $family = $this->get($fam_id, true);
            $str = '';

            if($family != null){
                $str .= "0 @{$family->Id}@ FAM\n";

                $str .= ($family->Sircar != null ? "1 HUSB @{$family->Sircar->Id}@\n" : '');
                $str .= ($family->Spouse != null ? "1 WIFE @{$family->Spouse->Id}@\n" : '');

                $childs =  $this->getFamilyChildrenIds($fam_id);
                if($childs != null)
                    foreach($childs as $child)
                        $str .= "1 CHIL @{$child['id']}@\n";

                $events = $this->core->events->getFamilyEvents($fam_id, true);
                if($events != null)
                    foreach ($events as $event){
                        $str .= $this->core->events->getGedcomString($event->Id);
                    }

            }

            return $str;
        }
        function get($id, $lite=false){
                $db =& JFactory::getDBO();
                $req = 'SELECT #__mb_families.f_id AS family_id, #__mb_dates.d_day AS
                    day, #__mb_dates.d_mon AS
                    month, #__mb_dates.d_year AS year, #__mb_dates.d_fact AS
                    type , husband.n_id AS husband_id, husband.n_givn AS husband_givenname, husband.n_surname AS husband_surname, wife.n_id AS wife_id, wife.n_givn AS wife_givenname, wife.n_surname AS wife_surname
                    FROM #__mb_families
                    LEFT JOIN #__mb_dates ON #__mb_families.f_id = #__mb_dates.d_gid
                    LEFT JOIN #__mb_name AS husband ON husband.n_id = #__mb_families.f_husb
                    LEFT JOIN #__mb_name AS wife ON wife.n_id = #__mb_families.f_wife

                    WHERE #__mb_families.f_id = "'.$id.'"';
                $db->setQuery($req);

                $rows = $db->loadAssocList();
                if($rows == null)
                    return null;
                $sircar = $this->core->individuals->get($rows[0]['husband_id'], $lite);
                $spouse = $this->core->individuals->get($rows[0]['wife_id'], $lite);

                $events = $this->core->events->getFamilyEvents($rows[0]['family_id'], $lite);
                $marriage = null;
                $divorce = null;
                if($events != null){
                    foreach($events as $event){
                        if($event->Type=="MARR")
                             $marriage = $event;
                        if($event->Type=="DIV")
                             $divorce = $event;
                    }
                }
                $family = new Family($rows[0]['family_id'], $sircar, $spouse, $marriage, $divorce, $events);


                return $family;
        }
        function getNewId(){
            $db =& JFactory::getDBO();
            $req = 'SELECT MAX(SUBSTRING(f_id,2)+0) as id FROM #__mb_families';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null){
               $newid = 'F1' ;
            }else{
                $newid = 'F'.($rows[0]['id']+1) ;
            }
            return $newid;

        }
        function getFamilyChildrenIds($famId){
            $db =& JFactory::getDBO();
            $req = 'SELECT distinct l_to as id FROM #__mb_link
                    LEFT JOIN #__mb_dates ON (#__mb_dates.d_gid=#__mb_link.l_to AND #__mb_dates.d_fact="BIRT")
                    WHERE #__mb_link.l_from="'.$famId.'" AND #__mb_link.l_type="CHIL" ORDER BY #__mb_dates.d_year ASC';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows != null)
                return $rows;
            else
                return array();
        }
        function getPersonsChildFamilies($id, $lite=false){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_families.f_id AS family_id, #__mb_dates.d_day AS
                DAY , #__mb_dates.d_mon AS
                MONTH , #__mb_dates.d_year AS year, #__mb_dates.d_fact AS
                TYPE , husband.n_id AS husband_id, husband.n_givn AS husband_givenname, husband.n_surname AS husband_surname, wife.n_id AS wife_id, wife.n_givn AS wife_givenname, wife.n_surname AS wife_surname
                FROM #__mb_link
                INNER JOIN #__mb_families ON ( #__mb_families.f_id = #__mb_link.l_from
                AND #__mb_link.l_type = "CHIL" )
                LEFT JOIN #__mb_dates ON #__mb_families.f_id = #__mb_dates.d_gid
                LEFT JOIN #__mb_name AS husband ON husband.n_id = #__mb_families.f_husb
                LEFT JOIN #__mb_name AS wife ON wife.n_id = #__mb_families.f_wife
                WHERE #__mb_link.l_to = "'.$id.'"';
            $db->setQuery($req);
           
            $rows = $db->loadAssocList();
            $families = array();

            if($rows != null){
                foreach($rows as $row){
                    $sircar = $this->core->individuals->get($row['husband_id'],$lite);
                    $spouse = $this->core->individuals->get($row['wife_id'],$lite);

                    if(!$lite){
                        $events = $this->core->events->getFamilyEvents($row['family_id']);
                        $marriage = null;
                        $divorce = null;
                        if($events != null){
                            foreach($events as $event){
                                if($event->Type=="MARR")
                                     $marriage = $event;
                                if($event->Type=="DIV")
                                     $divorce = $event;
                            }
                        }
                    }else{
                        $events=null;
                        $marriage = null;
                        $divorce = null;
                    }
                    $families[] = new Family($row['family_id'], $sircar, $spouse, $marriage, $divorce, $events);
                }
                return $families;
            }
            return array();
        }
        function getPersonFamilies($id){
        	$db =& JFactory::getDBO();
        	$req = 'SELECT * FROM #__mb_families WHERE f_husb = "'.$id.'" OR f_wife = "'.$id.'"';
        	$db->setQuery($req);
        	$rows = $db->loadAssocList();
        	
        	$families = array();
        	$sircar = $this->core->individuals->get($id);	
        	if($rows != null){
        		foreach($rows as $row){
        			if($id==$row['f_wife']){
        				$spouse = $this->core->individuals->get($row['f_husb']);
        			}else{
        				$spouse = $this->core->individuals->get($row['f_wife']);
        			}
        			$families[] = new Family($row['f_id'], $sircar, $spouse);
        		}
        		return $families;
        	}
        	return array();
        }
        function getPersonsFamilies($id, $lite=false){
                $db =& JFactory::getDBO();

                $req = 'SELECT	#__mb_families.f_id AS family_id,
                		#__mb_dates.d_day AS day,
                		#__mb_dates.d_mon AS month,
                		#__mb_dates.d_year AS year,
                		#__mb_dates.d_fact AS type ,
                		husband.n_id AS husband_id,
                		husband.n_givn AS husband_givenname,
                		husband.n_surname AS husband_surname,
                		wife.n_id AS wife_id,
                		wife.n_givn AS wife_givenname,
                		wife.n_surname AS wife_surname
                	FROM #__mb_families
                	LEFT JOIN #__mb_dates ON #__mb_families.f_id = #__mb_dates.d_gid
                	LEFT JOIN #__mb_name AS husband ON husband.n_id = #__mb_families.f_husb
                	LEFT JOIN #__mb_name AS wife ON wife.n_id = #__mb_families.f_wife

                	WHERE #__mb_families.f_husb = "'.$id.'" OR #__mb_families.f_wife = "'.$id.'"
                	GROUP BY jos_mb_families.f_id';

                $req = 'SELECT #__mb_families.f_id AS family_id, #__mb_families.f_husb AS husband_id, #__mb_families.f_wife AS wife_id FROM #__mb_families
                	WHERE #__mb_families.f_husb = "'.$id.'" OR #__mb_families.f_wife = "'.$id.'"
                	GROUP BY #__mb_families.f_id';
                $db->setQuery($req);

                $rows = $db->loadAssocList();
                $families = array();
                $sircar = $this->core->individuals->get($id, $lite);
                if($rows != null){
                    foreach($rows as $row){
                        if($id==$row['wife_id']){
                            $spouse = $this->core->individuals->get($row['husband_id'],$lite);
                        }else{
                            $spouse = $this->core->individuals->get($row['wife_id'], $lite);
                        }

                        if(!$lite){
                            $events = $this->core->events->getFamilyEvents($row['family_id']);
                            $marriage = null;
                            $divorce = null;
                            if($events != null){
                                foreach($events as $event){
                                    if($event->Type=="MARR")
                                         $marriage = $event;
                                    if($event->Type=="DIV")
                                         $divorce = $event;
                                }
                            }
                        }else{
                            $events=null;
                            $marriage = null;
                            $divorce = null;
                        }
                        $families[] = new Family($row['family_id'], $sircar, $spouse, $marriage, $divorce, $events);
                    }
                    return $families;
                }
                return array();
                
        }
        function getBySpouseId($id){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT distinct #__mb_individuals . * , birth.d_day AS b_day, birth.d_mon AS b_mon, birth.d_year AS b_year,
                     death.d_day AS d_day, death.d_mon AS d_mon, death.d_year AS d_year, husb.n_full as husb_full, husb.n_surname as husb_surname, husb.n_givn as husb_given, husb.n_midd husb_middle, husb.n_suff as husb_suff,husb.n_id as husb_id, wife.n_full as  wife_full, wife.n_surname as wife_surname, wife.n_givn as wife_given, wife.n_midd as wife_middle, wife.n_suff as wife_suff,wife.n_id as wife_id, #__mb_families.*

                    FROM #__mb_individuals LEFT JOIN #__mb_dates AS birth ON (birth.d_gid = #__mb_individuals.i_id and  birth.d_fact="BIRT" )

                    left join #__mb_families on #__mb_families.f_husb = #__mb_individuals.i_id OR #__mb_families.f_wife = #__mb_individuals.i_id
                    LEFT JOIN #__mb_name as husb  ON (husb  .n_id = #__mb_families.f_husb )
                    LEFT JOIN #__mb_name as wife ON (wife .n_id = #__mb_families.f_wife )
                    LEFT JOIN #__mb_dates AS death ON (death.d_gid = #__mb_individuals.i_id and death.d_fact="DEAT")
                    WHERE #__mb_individuals.i_id = "'.$id.'" ');
            $rows = $db->loadAssocList();
            return $rows[0];
        }
        function maxChildren(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT sum( 1 ) AS counter, l_from
                            FROM `#__mb_link`
                            WHERE #__mb_link.l_type = "CHIL"
                            GROUP BY #__mb_link.l_from
                            ORDER BY `counter` DESC
                            LIMIT 1');
            $rows = $db->loadAssocList();
            $count = $rows[0]['counter'];

            $db->setQuery('SELECT REPLACE(REPLACE(husband.n_full, "@N.N.", ""), "@P.N.", "") AS husband, husband.n_id AS husband_id, REPLACE(REPLACE(wife.n_full, "@N.N.", ""), "@P.N.", "") AS wife, wife.n_id AS wife_id
                    FROM `#__mb_link`
                    LEFT JOIN #__mb_link AS husband_link ON (husband_link.l_from = "'.$rows[0]['l_from'].'" AND husband_link.l_type="HUSB")
                    LEFT JOIN #__mb_name AS husband ON husband.n_id = husband_link.l_to

                    LEFT JOIN #__mb_link AS wife_link ON (wife_link.l_from = "'.$rows[0]['l_from'].'" AND wife_link.l_type="WIFE")
                    LEFT JOIN #__mb_name AS wife ON wife.n_id = wife_link.l_to
                    LIMIT 1');
             
            $rows = $db->loadAssocList();
            $rows[0]['counter'] = $count;
            return $rows[0];
        }
        function averageChildren(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT count(*) as count FROM #__mb_families');
            $rows = $db->loadAssocList();
            $fam_count = $rows[0]['count'];


            $db->setQuery('SELECT COUNT(*) FROM `#__mb_link` WHERE l_type="CHIL"');
            $rows = $db->loadAssocList();
            $child_count = $rows[0]['COUNT(*)'];
            return $child_count/$fam_count;
        }
        */
    }
    
?>
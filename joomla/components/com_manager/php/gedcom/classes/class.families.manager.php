<?php
class FamiliesList{
	public $core;

	function  __construct($core) {
		require_once 'class.family.php';
		$this->core = $core;
		$this->db = new JMBAjax();
        }
        public function get($id, $lite=false){
        	if($id==NULL) { return null; }
        	$this->db->setQuery('SELECT id,husb,wife FROM #__mb_families WHERE id=?',$id);         
        	$rows = $this->db->loadAssocList();
        	if($rows == null) { return false; }
                return $this->setData($rows[0]['husb'] ,$rows[0], $lite);
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
		$this->db->setQuery($sqlString, $husb, $wife, $family->Type);    
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
		$this->db->setQuery($sqlString, $husb, $wife,$family->Type,$family->Id);    
        	$this->db->query();
        	return true;
        }
        public function delete($id){
        	if($id==NULL){ return false; }
        	$this->db->setQuery('DELETE FROM #__mb_families WHERE id=?',$id);    
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
		$this->db->setQuery($sqlString, $fId, $id, $fRel, $mRel);    
        	$this->db->query();
        }
        public function deleteChild($id){
           if ($id==null) {return false;}
           $pers=$this->core->individuals->get($id);
           $this->db->setQuery("DELETE FROM #__mb_childrens WHERE `gid`=?",$id);    
       	   $this->db->query();
           $this->core->individuals->delete($id);    
        }
        public function getPersonFamilies($indKey, $lite=false){
        	if($indKey==null){ return null; }
        	$this->db->setQuery('SELECT id, husb, wife, type FROM #__mb_families WHERE husb=? OR wife=?', $indKey, $indKey);         
        	$rows = $this->db->loadAssocList();
        	$families = array();
        	foreach($rows as $row){        		
        		$families[] = $this->setData($indKey, $row, $lite);
        	}
        	return $families;
        	
        }
        public function getFamilyChildrenIds($fId){
        	if($fId==null) { return null; }
        	$sqlString = "SELECT DISTINCT childrens.gid FROM #__mb_childrens as childrens
        		LEFT JOIN #__mb_events as events ON events.individuals_id = childrens.gid AND events.type = 'BIRT'
        		LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
        		WHERE fid=?
        		ORDER BY  dates.f_year DESC";
        	$this->db->setQuery($sqlString, $fId);         
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
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$this->db->setQuery($sqlString, $treeId, $type, $month, $sort[1]); 
        	} else {
        		$sqlString .= " GROUP BY family.id";
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$this->db->setQuery($sqlString, $treeId, $type, $month); 
        	}     
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }
        
        public function getFamilies($treeId){
		$sqlString = "SELECT family.id, family.husb, family.wife FROM #__mb_families as family
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = family.husb OR links.individuals_id = family.wife
				WHERE links.tree_id = ?
				GROUP BY family.id";
		$this->db->setQuery($sqlString, $treeId);
		return $this->db->loadAssocList();
        }
        
        public function getChilds($treeId){
        	$sqlString = "SELECT childs.fid, childs.gid FROM #__mb_childrens as childs
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = childs.gid
				WHERE links.tree_id = ?";
		$this->db->setQuery($sqlString, $treeId);
		return $this->db->loadAssocList();
        }
        
        
}    
?>
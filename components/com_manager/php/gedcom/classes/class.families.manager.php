<?php
class FamiliesList{
	/**
	* gedcom individuals object
	*/
	private $individuals;
	/**
	* gedcom events object
	*/
	private $events;

        /**
        * FamiliesList constructor
        * $individuals gedcom object
        * $events gedcom object
        */
        public function  __construct(&$ajax, &$individuals, &$events) {
            $this->ajax = $ajax;
            $this->individuals = $individuals;
            $this->events = $events;
            }
        /**
        *
        */
        public function get($id, $lite=false){
        	if($id==NULL) { return null; }
        	$this->ajax->setQuery('SELECT id,husb,wife FROM #__mb_families WHERE id=?',$id);
        	$rows = $this->ajax->loadAssocList();
        	if($rows == null) { return false; }
                return $this->setData($rows[0]['husb'] ,$rows[0], $lite);
        }
        /**
        * save family into db
        * $family gedcom family object
        */
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
            } else {
                return false;
            }

            $sqlString = "INSERT INTO #__mb_families (`id`, `husb`, `wife`,`type`) VALUES (NULL, ?, ?, ?)";
            $this->ajax->setQuery($sqlString, $husb, $wife, $family->Type);
        	$this->ajax->query();
        	return $this->ajax->insertid();
        }
        /**
        * update exists family in db
        * $family gedcom family object
        */
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
		$this->ajax->setQuery($sqlString, $husb, $wife,$family->Type,$family->Id);
        	$this->ajax->query();
        	return true;
        }
        /**
        * delete family from db
        * $id uid family record in db
        */
        public function delete($id){
        	if($id==NULL){ return false; }
        	$this->ajax->setQuery('DELETE FROM #__mb_families WHERE id=?',$id);
        	$this->ajax->query();
        	return true;
        }
        /**
        *	
        */
        public function setData($id, $row, $lite){
        	$sircar = $this->individuals->get($id, $lite);
        	if($id == $row['husb']){
        		$spouse = $this->individuals->get($row['wife'], $lite);
        	} else {
        		$spouse = $this->individuals->get($row['husb'], $lite);
        	}
        	$events = (!$lite)?$this->events->getFamilyEvents($row['id']):null;
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
        /**
        *
        */
        public function addChild($fId, $id, $fRel=null, $mRel=null){
        	if($fId==null||$id==null) { return false; }
        	$sqlString = "INSERT INTO #__mb_childrens (`fid`, `gid`, `frel`, `mrel`) VALUES (?,?,?,?)";
		    $this->ajax->setQuery($sqlString, $fId, $id, $fRel, $mRel);
        	$this->ajax->query();
        }
        /**
        *
        */
        public function deleteChild($id){
           if ($id==null) {return false;}
           $pers=$this->individuals->get($id);
           $this->ajax->setQuery("DELETE FROM #__mb_childrens WHERE `gid`=?",$id);
       	   $this->ajax->query();
           $this->individuals->delete($id);    
        }
        /**
        *
        */
        public function getPersonFamilies($indKey, $lite=false){
        	if($indKey==null){ return null; }
        	$this->ajax->setQuery('SELECT id, husb, wife, type FROM #__mb_families WHERE husb=? OR wife=?', $indKey, $indKey);
        	$rows = $this->ajax->loadAssocList();
        	$families = array();
        	foreach($rows as $row){        		
        		$families[] = $this->setData($indKey, $row, $lite);
        	}
        	return $families;
        	
        }
        /**
        *
        */
        public function getFamilyIdByPartnerId($husb, $wife){
        	$this->ajax->setQuery('SELECT id FROM #__mb_families WHERE husb=? AND wife=?', $husb, $wife);
        	$rows = $this->ajax->loadAssocList();
        	return ($rows!=null)?$rows[0]['id']:null;
        }
        /**
        *
        */
        public function getFamilyChildrenIds($fId){
        	if($fId==null) { return null; }
        	$sqlString = "SELECT DISTINCT childrens.gid FROM #__mb_childrens as childrens
        		LEFT JOIN #__mb_events as events ON events.individuals_id = childrens.gid AND events.type = 'BIRT'
        		LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
        		WHERE fid=?
        		ORDER BY  dates.f_year DESC";
        	$this->ajax->setQuery($sqlString, $fId);
        	$rows = $this->ajax->loadAssocList();
        	if($rows!=null){
        		return $rows;
        	} else{ 
        		return array();
        	}
        }
        /**
        *
        */
        public function getByEvent($treeId, $type, $month, $sort=false){
        	$sqlString = "SELECT family.id, family.husb, family.wife, date.f_year as event_year
				FROM #__mb_families AS family
				LEFT JOIN #__mb_tree_links AS tree_links ON family.husb = tree_links.individuals_id OR family.wife = tree_links.individuals_id
				LEFT JOIN #__mb_events AS event ON family.id = event.families_id
				LEFT JOIN #__mb_dates AS date ON event.id = date.events_id
				WHERE tree_links.tree_id =?";
        	$sqlString .= " AND event.type=?";
        	$sqlString .= " AND date.f_month=?";
        	if($sort){
        		$sqlString .= ((int)$sort[0]<0)?"AND date.f_year < ?":"AND date.f_year > ?";
        		$sqlString .= " GROUP BY family.id";
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$this->ajax->setQuery($sqlString, $treeId, $type, $month, $sort[1]);
        	} else {
        		$sqlString .= " GROUP BY family.id";
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$this->ajax->setQuery($sqlString, $treeId, $type, $month);
        	}
        	$rows = $this->ajax->loadAssocList();
        	return $rows;
        }
        /**
        *
        */
        public function getFamilies($treeId){
		$sqlString = "SELECT family.id, family.husb, family.wife FROM #__mb_families as family
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = family.husb OR links.individuals_id = family.wife
				WHERE links.tree_id = ?
				GROUP BY family.id";
		$this->ajax->setQuery($sqlString, $treeId);
		return $this->ajax->loadAssocList();
        }
        /**
        *
        */
        public function getChilds($treeId){
        	$sqlString = "SELECT childs.fid, childs.gid FROM #__mb_childrens as childs
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = childs.gid
				WHERE links.tree_id = ?";
		$this->ajax->setQuery($sqlString, $treeId);
		return $this->ajax->loadAssocList();
        }
        /**
        *
        */
        public function getFamiliesList($tree_id, $gedcom_id = false){
		$sqlString = "SELECT DISTINCT family.id as family_id, family.husb, family.wife
				FROM #__mb_families as family
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = family.husb OR links.individuals_id = family.wife";
		if($gedcom_id){
			$sqlString .= " WHERE links.tree_id = ? and links.individuals_id = ?";
			$this->ajax->setQuery($sqlString, $tree_id, $gedcom_id);
		} else {
			$sqlString .= " WHERE links.tree_id = ?";
			$this->ajax->setQuery($sqlString, $tree_id);
		}
		return $this->ajax->loadAssocList(array('husb','wife','F'=>'family_id'),'I');
        }
        /**
        *
        */
        public function getChildrensList($tree_id, $gedcom_id = false){
        	$sqlString = "SELECT childs.fid as family_id, childs.gid as gedcom_id, childs.frel as father_relation, childs.mrel as mother_relation 
        			FROM #__mb_childrens as childs
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = childs.gid";
		if($gedcom_id) {
			$sqlString .= " LEFT JOIN #__mb_families as family ON family.id = childs.fid";
			$sqlString .= " LEFT JOIN #__mb_tree_links as flinks ON flinks.individuals_id = family.husb OR flinks.individuals_id = family.wife";
			$sqlString .= " WHERE links.tree_id = ? and flinks.individuals_id = ?";
			$this->ajax->setQuery($sqlString, $tree_id, $gedcom_id);
		} else {
			$sqlString .= " WHERE links.tree_id = ?";
			$this->ajax->setQuery($sqlString, $tree_id);
		}
		return $this->ajax->loadAssocList(array('I'=>'gedcom_id','F'=>'family_id'));
        }
        
}    
?>
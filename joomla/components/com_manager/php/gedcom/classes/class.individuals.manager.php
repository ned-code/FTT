<?php
class JMBRelation {
	protected $core;
	
	protected function get_parents($id){
		$parents = $this->core->individuals->getParents($id);
		$father = $parents['fatherID'];
		$mother = $parents['motherID'];
		return array($father,$mother);
	}
		
	protected function set_ancestors($id, &$ancestors, $level = 1){
		if(!$id) return;
		$parents = $this->get_parents($id);
		if($parents[0]!=null){
			$ancestors[] = array($level, $parents[0]);
			$this->set_ancestors($parents[0], $ancestors, $level + 1);
		}
		if($parents[1]!=null){
			$ancestors[] = array($level, $parents[1]);
			$this->set_ancestors($parents[1], $ancestors, $level + 1);
		}
	}
	
	protected function get_gender($id){
		$ind = $this->core->individuals->get($id);
		return $ind->Gender;
	}
	
	protected function lowest_common_ancestor($a_id, $b_id){
		$a_ancestors = array();
		$b_ancestors = array();
		$a_ancestors[] = array(0, $a_id);
		$b_ancestors[] = array(0, $b_id);
		$this->set_ancestors($a_id, $a_ancestors);
		$this->set_ancestors($b_id, $b_ancestors);
		foreach($a_ancestors as $a_anc){
			foreach($b_ancestors as $b_anc){
				if($a_anc[1] == $b_anc[1]){
					return array($a_anc[1], $a_anc[0], $b_anc[0]);
				}
			}
		}
	}
	
	protected function ordinal_suffix($number){
		if ($number % 100 > 10 && $number %100 < 14) {
			$os = 'th';
		} else if ($number == 0) {
			$os = '';
		} else {
			$last = substr($number, -1, 1);
			switch($last) {
				case "1":
					$os = 'st';
				break;
				case "2":
					$os = 'nd';
				break;
				case "3":
					$os = 'rd';
				break;
				default:
					$os = 'th';
				break;
			}
		}
		return $number.$os;
	}
	
	protected function aggrandize_relationship($rel, $dist, $offset = 0){
		$dist -= $offset;
		switch ($dist) {
			case 1:
				return $rel;
			break;
			case 2:
				return 'grand'.$rel;
			break;
			case 3:
				return 'great grand'.$rel;
			break;
			default:
				return $this->ordinal_suffix($dist - 2).' great grand'.$rel;
			break;
		}
	}
	
	protected function format_plural($count, $singular, $plural){	
		return $count.' '.($count == 1 || $count == -1 ? $singular : $plural);
	}

	public function __construct(&$core){
		$this->core = $core;
	}

	public function get_relation($a_id, $b_id){
		if($a_id == $b_id){
			return 'self';
		}
		
		$spouses = $this->core->individuals->getSpouses($a_id);
		if($spouses!=null){
			foreach($spouses as $spouse){
				if($spouse==$b_id){
					return 'spouse';
				}
			}
		}
		
		$lca = $this->lowest_common_ancestor($a_id, $b_id);
		if (!$lca) {
			return false;
		}
		
		$a_level = $lca[1];
		$b_level = $lca[2];
		
		$gender = $this->get_gender($a_id);
		
		if($a_level == 0){
			$rel = ($gender=="M")?'father':'mother';	
			return $this->aggrandize_relationship($rel, $b_level);
		}
		
		if($b_level == 0){
			$rel = ($gender=="M")?'son':'daughter';
			return $this->aggrandize_relationship($rel, $a_level);
		}
		
		if($a_level == $b_level){
			switch($a_level){
				case 1:
					return ($gender=="M")?'brother':'sister';
				break;
				
				case 2:
					return 'cousin';
				break;
				
				default:
					return $this->ordinal_suffix($dist - 2).' cousin';
				break;
			}
		}
		
		if($a_level == 1){
			$rel = ($gender=="M")?'uncle':'aunt';
			return $this->aggrandize_relationship($rel, $b_level, 1);
		}
		
		if($b_level == 1){
			$rel = ($gender=="M")?'nephew':'niece';
			return $this->aggrandize_relationship($rel, $a_level, 1);
		}
		
		$cous_ord = min($a_level, $b_level) - 1;
		$cous_gen = abs($a_level - $b_level);
		return $this->ordinal_suffix($cous_ord).' cousin '.$this->format_plural($cous_gen, 'time', 'times').' removed';
		
	}
}

class IndividualsList{
	protected $db;
	protected $core;
	public $relation;
	
	/**
	*
	*/
	function  __construct($core) {
		require_once 'class.individual.php';
		$this->core=$core;
		$this->db = & JFactory::getDBO();
		$this->relation = new JMBRelation($core);
        }
        
        /**
        *
        */
        public function get($id, $lite=false){
        	if($id==null){ return null; }
        	$sqlString = "SELECT indivs.id as id, indivs.fid as fid, indivs.sex as sex, names.first_name as first_name,names.middle_name as middle_name,names.last_name as last_name,names.nick as nick,link.tree_id as tree_id,link.type as permission
        		FROM #__mb_individuals as indivs
        		LEFT JOIN #__mb_names as names ON indivs.id = names.gid
        		LEFT JOIN #__mb_tree_links as link ON indivs.id = link.individuals_id
        		WHERE indivs.id=?";
        	$sql = $this->core->sql($sqlString, $id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	if($rows==null) return null;
        	
        	$pers = new Individual(); 
        	$pers->Id = $rows[0]['id'];
		$pers->FacebookId = $rows[0]['fid'];
		$pers->Gender = $rows[0]['sex'];
		$pers->FirstName = $rows[0]['first_name'];
		$pers->MiddleName = $rows[0]['middle_name'];
		$pers->LastName = $rows[0]['last_name'];
		$pers->Nick = $rows[0]['nick'];
		$pers->TreeId = $rows[0]['tree_id'];
		$pers->Permission = $rows[0]['permission'];
		
		if(!$lite){
			$pers->Birth = $this->core->events->getPersonEventsByType($pers->Id,'BIRT');
			$pers->Death = $this->core->events->getPersonEventsByType($pers->Id,'DEAT');
		}
		return $pers;
        }
        
        /**
        *
        */
        public function save($pers){
        	if($pers==null){ return false; }
        	//insert to individuals table;
        	$sqlString = 'INSERT INTO #__mb_individuals (`id`, `fid`, `sex`) VALUES (NULL,?,?)'; 
        	$sql = $this->core->sql($sqlString, $pers->FacebookId, $pers->Gender);
        	$this->db->setQuery($sql);    
        	$this->db->query(); 
        	$id = $this->db->insertid();
        	//get params and insert to names table;
        	$givn = (($pers->FirstName!='')?$pers->FirstName:'').' '.(($pers->MiddleName!='')?$pers->MiddleName:'');
        	$sqlString = 'INSERT INTO #__mb_names (`gid`, `first_name`, `middle_name`, `last_name`, `prefix`, `givn`, `nick`, `surn_prefix`, `surname`, `suffix`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        	$sql = $this->core->sql($sqlString, $id, $pers->FirstName, $pers->MiddleName, $pers->LastName, $pers->Prefix, $givn, $pers->Nick, $pers->SurnamePrefix, $pers->LastName, $pers->Suffix);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	//insert in tree        	
        	$sql = $this->core->sql("INSERT INTO #__mb_tree_links (`individuals_id`,`tree_id`,`type`) VALUES (?,?,'MEMBER')",$id, $pers->TreeId);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        	return $id;
        }
        
        /**
        *
        */
        public function update($pers){
        	if($pers&&$pers->Id){
        		//update to individuals table;
        		$sql = $this->core->sql('UPDATE #__mb_individuals SET `sex`=?,`fid`=?, `change`=NOW() WHERE `id`=?', $pers->Gender,$pers->FacebookId,$pers->Id);
        		$this->db->setQuery($sql);    
        		$this->db->query();
        		//update to names table;
        		$givn = (($pers->FirstName!='')?$pers->FirstName:'').' '.(($pers->MiddleName!='')?$pers->MiddleName:'');
        		$sqlString = "UPDATE #__mb_names SET `first_name`=?, `middle_name`=?,`last_name`=?,`givn`=?,`nick`=?,`surname`=?,`change`= NOW() WHERE `gid`=?";        		
        		$sql = $this->core->sql($sqlString, $pers->FirstName, $pers->MiddleName, $pers->LastName, $givn, $pers->Nick, $pers->LastName, $pers->Id);
        		$this->db->setQuery($sql);    
        		$this->db->query();
        		return $pers;        		
        	}       
        	return false;
        }
        
        /**
        *
        */
        public function delete($id){
        	if($id==NULL){ return null; }
        	$sql = $this->core->sql('DELETE FROM #__mb_individuals WHERE id=?', $id);
        	$this->db->setQuery($sql);    
        	$this->db->query();
        }

        public function getParents($id){
        	if($id==null) { return null; }
        	$sqlString = "SELECT families.id as familyId, families.husb as fatherID, families.wife as motherID FROM #__mb_childrens as childrens
        		LEFT JOIN #__mb_families as families ON childrens.fid = families.id
        		WHERE childrens.gid=?";
        	$sql = $this->core->sql($sqlString, $id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	return ($rows==null)?null:$rows[0];
        }
        public function getChilds($id){
        	if($id==null){return null;}
        	$sqlString = "SELECT childrens.gid as gid, childrens.fid as fid, indivs.sex as sex, names.first_name as first_name, names.middle_name as middle_name, names.last_name as last_name   
        		FROM #__mb_families AS families
        		LEFT JOIN #__mb_childrens AS childrens ON childrens.fid = families.id
        		LEFT JOIN #__mb_individuals AS indivs ON indivs.id = childrens.gid
        		LEFT JOIN #__mb_names AS names ON names.gid = childrens.gid
        		WHERE families.husb =? OR families.wife =?";
        	$sql = $this->core->sql($sqlString, $id, $id);
        	$this->db->setQuery($sql); 
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }
        public function getChildsId($id){
        	if($id==null){return null;}
        	$sqlString = "SELECT child.gid as id FROM #__mb_families AS family
        			LEFT JOIN #__mb_childrens AS child ON child.fid = family.id
        			WHERE (family.husb =? OR family.wife =?) AND child.gid!='NULL'";
        	$sql = $this->core->sql($sqlString, $id, $id);
        	$this->db->setQuery($sql); 
        	return $this->db->loadAssocList();
        }
        public function getFamilyId($id, $type='FAMC'){
        	if($id==null){ return null; }
        	if($type=='FAMS'){ $sql = $this->core->sql('SELECT id as fid FROM #__mb_families WHERE husb =? OR wife =?', $id, $id); } 
        	elseif($type=='FAMC'){ $sql = $this->core->sql('SELECT fid FROM #__mb_childrens WHERE gid=?', $id); }
        	else{ return null; } 
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	if($rows==null) { return null; }
        	return $rows[0]['fid'];
        }
        public function getIdbyFId($fId){
        	if($fId==null){ return null; }
        	$sql = $this->core->sql('SELECT id FROM #__mb_individuals WHERE fid=?', $fId);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	return $rows[0]['id'];
        }
        public function getTreeIdbyFid($fId){
        	if($fId==null){ return null; }
        	$sql = $this->core->sql('SELECT link.tree_id as id FROM #__mb_individuals as ind LEFT JOIN #__mb_tree_links as link ON ind.id = link.individuals_id  WHERE ind.fid=?', $fId);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	return $rows[0]['id'];
        }
        public function getFirstParent($id, $line=false, $first=false){
        	$parents = $this->getParents($id);
        	if($first){
        		$parent = ($line == 'father')? $parents['fatherID'] : $parents['motherID'] ;  	
        	}
        	else {
        		$parent = $parents['fatherID'];
        	}
        	if(!$parent){
        		return $id;
        	}
        	return $this->getFirstParent($parent);
        }
        public function getSpouses($id){
        	if($id==null){ return null; }
        	$sql = $this->core->sql('SELECT wife,husb FROM #__mb_families WHERE husb =? OR wife =?', $id, $id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	if($rows!=null){
        		$spouses = array();
        		foreach($rows as $row){
        			$spouses[] = ($row['husb']==$id)?$row['wife']:$row['husb'];
        		}
        		return $spouses;
        	}
        	return null;
        }
        public function getRelatives($treeId, $type=false){
        	if($type){
        		$sql = $this->core->sql("SELECT individuals_id FROM #__mb_tree_links WHERE tree_id=? AND type=?",$treeId, $type);
        	} else {
        		$sql = $this->core->sql("SELECT individuals_id FROM #__mb_tree_links WHERE tree_id=?",$treeId);
        	}
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }
        public function getByEvent($treeId, $type, $month, $sort=false){
        	$sqlString = "SELECT ind.id as gid
        			FROM #__mb_individuals as ind 
        			LEFT JOIN #__mb_tree_links as tree_links ON ind.id = tree_links.individuals_id
        			LEFT JOIN #__mb_events as event ON ind.id = event.individuals_id
        			LEFT JOIN #__mb_dates as date ON event.id = date.events_id
        			WHERE tree_links.tree_id = ?";	
        	$sqlString .= " AND event.type=?";
        	$sqlString .= " AND date.f_month=?";
        	if($sort&&$sort[0]!=0){
        		$sqlString .= ($sort[0]>0)?" AND date.f_year >= ?":" AND date.f_year < ?";
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$sql = $this->core->sql($sqlString, $treeId, $type, $month, $sort[1]);
        	} else {
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$sql = $this->core->sql($sqlString, $treeId, $type, $month);
        	}
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }
        public function getIndivCount($treeId){
        	$sqlString = "SELECT COUNT( id ) FROM #__mb_individuals as indivs
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
        			WHERE links.tree_id = '".$treeId."'";
        	$this->db->setQuery($sqlString);
        	$rows = $this->db->loadAssocList();
        	return 0+$rows[0]['COUNT( id )'];
        }
        public function getIndivCountByFamilyLine($treeId, $renderType){
        	$sqlString = "SELECT COUNT ( id )
				FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				LEFT JOIN #__mb_family_line as line ON line.to = indivs.id
				WHERE links.tree_id = ? AND line.type = ?";
		$sql = $this->core->sql($sqlString, $treeId, $renderType);
		$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	return 0+$rows[0]['COUNT( id )'];
        }
        public function getLivingIndivCount($treeId, $count=false){
        	if(!$count) $count = $this->getIndivCount($treeId);
        	$sqlString = "SELECT COUNT( ind.id) FROM #__mb_individuals as ind
        			LEFT JOIN #__mb_events as event ON event.individuals_id = ind.id
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = ind.id
        			WHERE event.type = 'DEAT' AND links.tree_id = '".$treeId."'";
        	$this->db->setQuery($sqlString);
        	$rows = $this->db->loadAssocList();
        	return 0+$count-$rows[0]['COUNT( ind.id)'];
        }
        public function getLivingIndivCountByFamilyLine($treeId, $renderType, $count=false){
        	if(!$count) $count = $this->getIndivCountByFamilyLine($treeId, $renderType);
        	$sqlString = "SELECT COUNT( ind.id) FROM #__mb_individuals as ind
        			LEFT JOIN #__mb_events as event ON event.individuals_id = ind.id
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = ind.id
        			LEFT JOIN #__mb_family_line as line ON line.to = ind.id
        			WHERE event.type = 'DEAT' AND links.tree_id = ? AND line.type = ?";
        	$sql = $this->core->sql($sqlString, $treeId, $renderType);
        	$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	return 0+$count-$rows[0]['COUNT( ind.id)'];
        }
        public function getIdYoungestMember($treeId){
        	$sqlString = "SELECT indivs.id FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id
				LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				WHERE events.type = 'BIRT' AND dates.f_year != 'NULL' AND links.tree_id = '".$treeId."'
				ORDER BY dates.f_year DESC LIMIT 1";
        	$this->db->setQuery($sqlString);
        	$rows = $this->db->loadAssocList();
        	return 0+$rows[0]['id'];
        }
        public function getIdYoungestMemberByFamilyLine($treeId, $renderType){
        	$sqlString = "SELECT indivs.id FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id
				LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				LEFT JOIN #__mb_family_line as line ON line.to = indivs.id
				WHERE events.type = 'BIRT' AND dates.f_year != 'NULL' AND links.tree_id = ? AND line.type = ?
				ORDER BY dates.f_year DESC LIMIT 1";
		$sql = $this->core->sql($sqlString, $treeId, $renderType);		
        	$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	return 0+$rows[0]['id'];
        }
        public function getIdOldestMember($treeId){  
        	$sqlString = "SELECT indivs.id as id FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id
				LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				WHERE dates.f_year != 'NULL' AND links.tree_id = '".$treeId."'
				ORDER BY dates.f_year ASC 
				LIMIT 1";
        	$this->db->setQuery($sqlString);
        	$rows = $this->db->loadAssocList();
        	return 0+$rows[0]['id'];
        }        
          public function getIdOldestMemberByFamilyLine($treeId, $renderType){  
        	$sqlString = "SELECT indivs.id as id FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id
				LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				LEFT JOIN #__mb_family_line as line ON line.to = indivs.id
				WHERE dates.f_year != 'NULL' AND links.tree_id = ? AND line.type = ?
				ORDER BY dates.f_year ASC 
				LIMIT 1";
		$sql = $this->core->sql($sqlString, $treeId, $renderType);		
        	$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	return 0+$rows[0]['id'];
        }        
        public function getIdEarliestMember($treeId){
        	$sqlString = "SELECT indivs.id as id, events.type as birth, events2.type as death 
        			FROM #__mb_individuals as indivs
        			LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id AND events.type = 'BIRT'
        			LEFT JOIN #__mb_events as events2 ON events2.individuals_id = indivs.id AND events2.type = 'DEAT'
        			LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id 
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
        			WHERE dates.f_year != 'NULL' AND links.tree_id = ".$treeId." 
        			ORDER BY dates.f_year ASC";
        	$this->db->setQuery($sqlString);
        	$rows = $this->db->loadAssocList();
        	for($i=0;$i<sizeof($rows);$i++){
        		if($rows[$i]['death'] == null) return $rows[$i]['id'];
        	}
        	return null;
        }
         public function getIdEarliestMemberByFamilyLine($treeId, $renderType){
        	$sqlString = "SELECT indivs.id as id, events.type as birth, events2.type as death 
        			FROM #__mb_individuals as indivs
        			LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id AND events.type = 'BIRT'
        			LEFT JOIN #__mb_events as events2 ON events2.individuals_id = indivs.id AND events2.type = 'DEAT'
        			LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id 
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
        			LEFT JOIN #__mb_family_line as line ON line.to = indivs.id
        			WHERE dates.f_year != 'NULL' AND links.tree_id = ? AND line.type = ?
        			ORDER BY dates.f_year ASC";
        	$sql = $this->core->sql($sqlString, $treeId, $renderType);
        	$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	for($i=0;$i<sizeof($rows);$i++){
        		if($rows[$i]['death'] == null) return $rows[$i]['id'];
        	}
        	return null;
        }
        public function getLastLoginMembers($treeId){
        	$sqlString = "SELECT ind.*, links.tree_id, links.type, media.mid as avatar, names.first_name, names.middle_name, names.last_name FROM #__mb_individuals as ind
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = ind.id
        			LEFT JOIN #__mb_media_link as media ON media.gid = ind.id AND media.type = 'AVAT'
        			LEFT JOIN #__mb_names as names ON names.gid = ind.id
        			WHERE links.tree_id = ? AND ind.fid != '0'
        			ORDER BY ind.last_login DESC";
        	$sql = $this->core->sql($sqlString, $treeId);
        	$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }

        public function getMembersByFamLine($treeId, $ownerId, $renderType){
        	$sql = $this->core->sql("SELECT `to` as individuals_id FROM #__mb_family_line WHERE `from` = ? AND `tid` = ? AND `type`=?", $ownerId, $treeId, $renderType);
        	$this->db->setQuery($sql);
        	$rows = $this->db->loadAssocList();
        	return $rows;
        }
}
?>
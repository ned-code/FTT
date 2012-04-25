<?php
class IndividualsList{
        private $events;
        private $ajax;

        /**
        *
        */
        public function  __construct(&$ajax, &$events) {
            $this->ajax = $ajax;
            $this->events = $events;
        }

        public function create(){
            $ind = new Individual();
            return $ind;
        }

        /**
        *
        */
        public function get($id, $lite=false){
        	if($id==null){ return null; }
        	$sqlString = "SELECT indivs.id as id, indivs.fid as fid, indivs.sex as sex, indivs.creator as creator, names.first_name as first_name,names.middle_name as middle_name,names.last_name as last_name,names.nick as nick,link.tree_id as tree_id,link.type as permission
        		FROM #__mb_individuals as indivs
        		LEFT JOIN #__mb_names as names ON indivs.id = names.gid
        		LEFT JOIN #__mb_tree_links as link ON indivs.id = link.individuals_id
        		WHERE indivs.id=?";
        	$this->ajax->setQuery($sqlString, $id);
        	$rows = $this->ajax->loadAssocList();
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
            $pers->Creator = $rows[0]['creator'];
		
            if(!$lite){
                $pers->Birth = $this->events->getPersonEventsByType($pers->Id,'BIRT');
                $pers->Death = $this->events->getPersonEventsByType($pers->Id,'DEAT');
            }
            return $pers;
        }
                
        /**
        *
        */
        public function save($pers){
        	if($pers==null){ return false; }
        	//insert to individuals table;
        	$sqlString = 'INSERT INTO #__mb_individuals (`id`, `fid`, `sex`,`creator`,`create_time`) VALUES (NULL,?,?,?,NOW())';
        	$this->ajax->setQuery($sqlString, $pers->FacebookId, $pers->Gender, $pers->Creator);
        	$this->ajax->query();
        	$id = $this->ajax->insertid();
        	//get params and insert to names table;
        	$givn = (($pers->FirstName!='')?$pers->FirstName:'').' '.(($pers->MiddleName!='')?$pers->MiddleName:'');
        	$sqlString = 'INSERT INTO #__mb_names (`gid`, `first_name`, `middle_name`, `last_name`, `prefix`, `givn`, `nick`, `surn_prefix`, `surname`, `suffix`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        	$this->ajax->setQuery($sqlString, $id, $pers->FirstName, $pers->MiddleName, $pers->LastName, $pers->Prefix, $givn, $pers->Nick, $pers->SurnamePrefix, $pers->LastName, $pers->Suffix);
        	$this->ajax->query();
        	//insert in tree        	
        	$this->ajax->setQuery("INSERT INTO #__mb_tree_links (`individuals_id`,`tree_id`,`type`) VALUES (?,?,'MEMBER')",$id, $pers->TreeId);
        	$this->ajax->query();
        	return $id;
        }
        
        /**
        *
        */
        public function update($pers){
        	if($pers&&$pers->Id){
        		//update to individuals table;
        		$this->ajax->setQuery('UPDATE #__mb_individuals SET `sex`=?,`fid`=?, `change`=NOW() WHERE `id`=?', $pers->Gender,$pers->FacebookId,$pers->Id);
        		$this->ajax->query();
        		//update to names table;
        		$givn = (($pers->FirstName!='')?$pers->FirstName:'').' '.(($pers->MiddleName!='')?$pers->MiddleName:'');
        		$sqlString = "UPDATE #__mb_names SET `first_name`=?, `middle_name`=?,`last_name`=?,`givn`=?,`nick`=?,`surname`=?,`change`= NOW() WHERE `gid`=?";        		
        		$this->ajax->setQuery($sqlString, $pers->FirstName, $pers->MiddleName, $pers->LastName, $givn, $pers->Nick, $pers->LastName, $pers->Id);
        		$this->ajax->query();
        		return $pers;        		
        	}       
        	return false;
        }
        
        /**
        *
        */
        public function delete($id){
        	if($id==NULL){ return null; }
        	$this->ajax->setQuery('DELETE FROM #__mb_individuals WHERE id=?', $id);
        	$this->ajax->query();
        }

        public function unlink($tree_id, $gedcom_id){
            if($gedcom_id==NULL){ return null; }
            $sql_string = "UPDATE #__mb_individuals SET `fid` = '0' WHERE id = ?";
            $this->ajax->setQuery($sql_string, $gedcom_id);
            $this->ajax->query();

            $sql_string = "UPDATE #__mb_tree_links SET `type` = 'MEMBER' WHERE tree_id = ? AND individuals_id = ?";
            $this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
            $this->ajax->query();
        }

        public function getParents($id){
        	if($id==null) { return null; }
        	$sqlString = "SELECT families.id as familyId, families.husb as fatherID, families.wife as motherID FROM #__mb_childrens as childrens
        		LEFT JOIN #__mb_families as families ON childrens.fid = families.id
        		WHERE childrens.gid=?";
        	$this->ajax->setQuery($sqlString, $id);
        	$rows = $this->ajax->loadAssocList();
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
        	$this->ajax->setQuery($sqlString, $id, $id);
        	$rows = $this->ajax->loadAssocList();
        	return $rows;
        }
        public function getChildsId($id){
        	if($id==null){return null;}
        	$sqlString = "SELECT child.gid as id FROM #__mb_families AS family
        			LEFT JOIN #__mb_childrens AS child ON child.fid = family.id
        			WHERE (family.husb =? OR family.wife =?) AND child.gid!='NULL'";
        	$this->ajax->setQuery($sqlString, $id, $id);
        	return $this->ajax->loadAssocList();
        }
        public function getFamilyId($id, $type='FAMC'){
        	if($id==null){ return null; }
        	if($type=='FAMS'){ $this->ajax->setQuery('SELECT id as fid FROM #__mb_families WHERE husb =? OR wife =?', $id, $id);          }
        	elseif($type=='FAMC'){ $this->ajax->setQuery('SELECT fid FROM #__mb_childrens WHERE gid=?', $id); }
        	else{ return null; } 
        	$rows = $this->ajax->loadAssocList();
        	if($rows==null) { return null; }
        	return $rows[0]['fid'];
        }
        public function getIdbyFId($fId){
        	if($fId==null){ return null; }
        	$this->ajax->setQuery('SELECT id FROM #__mb_individuals WHERE fid=?', $fId);
        	$rows = $this->ajax->loadAssocList();
        	return $rows[0]['id'];
        }
        public function getTreeIdbyFid($fId){
        	if($fId==null){ return null; }
        	$this->ajax->setQuery('SELECT link.tree_id as id FROM #__mb_individuals as ind LEFT JOIN #__mb_tree_links as link ON ind.id = link.individuals_id  WHERE ind.fid=?', $fId);
        	$rows = $this->ajax->loadAssocList();
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
        	$this->ajax->setQuery('SELECT wife,husb FROM #__mb_families WHERE husb =? OR wife =?', $id, $id);
        	$rows = $this->ajax->loadAssocList();
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
        		$this->ajax->setQuery("SELECT individuals_id FROM #__mb_tree_links WHERE tree_id=? AND type=?",$treeId, $type);
        	} else {
        		$this->ajax->setQuery("SELECT individuals_id FROM #__mb_tree_links WHERE tree_id=?",$treeId);
        	}      
        	$rows = $this->ajax->loadAssocList();
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
        		$sqlString .= " GROUP BY ind.id";
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$this->ajax->setQuery($sqlString, $treeId, $type, $month, $sort[1]);
        	} else {
        		$sqlString .= " GROUP BY ind.id";
        		$sqlString .= ' ORDER BY  date.f_day ASC';
        		$this->ajax->setQuery($sqlString, $treeId, $type, $month);
        	}
        	$rows = $this->ajax->loadAssocList();
        	return $rows;
        }
        public function getLastLoginMembers($treeId){
        	$sqlString = "SELECT ind.id as gedcom_id FROM #__mb_individuals as ind
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = ind.id
        			WHERE links.tree_id = ? AND ind.fid != '0'
        			ORDER BY ind.last_login DESC";
        	$this->ajax->setQuery($sqlString, $treeId);
        	$rows = $this->ajax->loadAssocList();
        	return $rows;
        }
        public function getIndividualsList($tree_id, $owner_id, $gedcom_id = false){
        	$sqlString = "SELECT DISTINCT ind.id as gedcom_id, ind.fid as facebook_id, ind.sex as gender, ind.last_login, ind.default_family, ind.creator,
        				name.first_name, name.middle_name, name.last_name, name.nick, 
        				links.type as permission, rel.relation,
        				f_line.is_self, f_line.is_spouse, f_line.is_descendant, f_line.is_father, f_line.is_mother FROM #__mb_individuals as ind 
				LEFT JOIN #__mb_names as name ON name.gid = ind.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = ind.id
				LEFT JOIN #__mb_relations as rel ON rel.to = ind.id AND rel.tree_id = links.tree_id and rel.from = ?
				LEFT JOIN #__mb_family_line as f_line ON f_line.member_id = ind.id AND f_line.tid = links.tree_id AND f_line.gedcom_id = rel.from";
            if($gedcom_id){
                $sqlString .= " WHERE links.tree_id = ? and ind.id = ?";
                $this->ajax->setQuery($sqlString, $owner_id, $tree_id, $gedcom_id);
            } else {
                $sqlString .= " WHERE links.tree_id = ?";
                $this->ajax->setQuery($sqlString, $owner_id, $tree_id);
            }
		    $rows = $this->ajax->loadAssocList('gedcom_id');
        	return $rows;  	
        }

        /*
        * THIS MONTH
        */
        public function getIndividualsCount($tree_id, $permission='OWNER', $tree=false){
        	$sql_string = "SELECT indiv.id FROM #__mb_individuals as indiv 
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indiv.id 
        			WHERE links.tree_id = '".$tree_id."'";
        	$this->ajax->setQuery($sql_string);
        	$rows = $this->ajax->loadAssocList();
        	if($rows==null||$permission=='OWNER'){
        		return ($rows==null)?0:sizeof($rows);
        	}
        	if($tree){
        		$count = 0;
        		foreach($rows as $row){
        			if(isset($row['id'])&&isset($tree[$row['id']])){
        				$count++;
        			}
        		}
        		return $count;
        	}
        	return 0;
        }
        
        public function getLivingIndividualsCount($tree_id, $permission='OWNER', $tree=false){
        	$count = $this->getIndividualsCount($tree_id, $permission, $tree);
        	$sql_string = "SELECT COUNT ind.id FROM #__mb_individuals as ind
        			LEFT JOIN #__mb_events as event ON event.individuals_id = ind.id
        			LEFT JOIN #__mb_tree_links as links ON links.individuals_id = ind.id
        			WHERE event.type = 'DEAT' AND links.tree_id = '".$tree_id."'";
        	$this->ajax->setQuery($sql_string);
        	$rows = $this->ajax->loadAssocList();
        	if($rows==null||$permission=='OWNER'){
        		return ($rows==null)?$count:$count-sizeof($rows);
        	}
        	if($tree){
        		$death_count = 0;
        		foreach($rows as $row){
        			if(isset($row['id'])&&isset($tree[$row['id']])){
        				$death_count++;
        			}
        		}
        		return $count-$death_count;
        	}
        	return $count;
        }
        
        public function getYoungestId($tree_id, $permission='OWNER', $tree=false){
        	$sql_string = "SELECT indivs.id FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id
				LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				WHERE events.type = 'BIRT' AND dates.f_year != 'NULL' AND links.tree_id = '".$tree_id."'
				ORDER BY dates.f_year DESC";
		$this->ajax->setQuery($sql_string);
        	$rows = $this->ajax->loadAssocList();
        	if($rows==null||$permission=='OWNER'){
        		return ($rows==null)?null:$rows[0]['id'];
        	}
        	if($tree){
        		foreach($rows as $row){
        			if(isset($row['id'])&&isset($tree[$row['id']])){
        				return $row['id'];
        			}
        		}
        	}
        	return null;
        }
        
        public function getOldestId($tree_id, $permission='OWNER', $tree=false){
        	$sql_string = "SELECT indivs.id as id FROM #__mb_individuals as indivs
				LEFT JOIN #__mb_events as events ON events.individuals_id = indivs.id
				LEFT JOIN #__mb_dates as dates ON dates.events_id = events.id
				LEFT JOIN #__mb_tree_links as links ON links.individuals_id = indivs.id
				WHERE dates.f_year != 'NULL' AND links.tree_id = '".$tree_id."'
				ORDER BY dates.f_year ASC";
		$this->ajax->setQuery($sql_string);
        	$rows = $this->ajax->loadAssocList();
        	if($rows==null||$permission=='OWNER'){
        		return ($rows==null)?null:$rows[0]['id'];
        	}
        	if($tree){
        		foreach($rows as $row){
        			if(isset($row['id'])&&isset($tree[$row['id']])){
        				return $row['id'];
        			}
        		}
        	}
        	return null;
        }
        
        public function getEarliestInDocumentId($tree_id, $permission='OWNER', $tree=false){
        	//not supported by sources
        }
        public function addedCurrentPartner($family_id, $gedcom_id){
        	$sql_string = "UPDATE #__mb_individuals SET `default_family` = ? WHERE `id` = ?";
        	$this->ajax->setQuery($sql_string, $family_id, $gedcom_id);
        	$this->ajax->query();
        }
}
?>
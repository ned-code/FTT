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
		$cous_gen = abs($a_level, $b_level);
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
        	$sqlString = "SELECT indivs.id, indivs.fid, indivs.sex, names.first_name,names.middle_name,names.last_name,names.nick
        		FROM #__mb_individuals as indivs
        		LEFT JOIN #__mb_names as names ON indivs.id = names.gid
        		WHERE indivs.id=?";
        	$sql = $this->core->sql($sqlString, $id);
        	$this->db->setQuery($sql);         
        	$rows = $this->db->loadAssocList();
        	
        	$pers = new Individual(); 
        	$pers->Id = $rows[0]['id'];
		$pers->FacebookId = $rows[0]['fid'];
		$pers->Gender = $rows[0]['sex'];
		$pers->FirstName = $rows[0]['first_name'];
		$pers->MiddleName = $rows[0]['middle_name'];
		$pers->LastName = $rows[0]['last_name'];
		$pers->Nick = $rows[0]['nick'];
		
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
        	return $id;
        }
        
        /**
        *
        */
        public function update($pers){
        	if($pers->Id){
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
        function getFirstParent($id, $line=false, $first=false){
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
        /*
        function get($id, $lite=false){
            $db =& JFactory::getDBO();
            $req = 'SELECT distinct #__mb_individuals . * , birth.d_day AS b_day, birth.d_mon AS b_mon, birth.d_year AS b_year, 
                     death.d_day AS d_day, death.d_mon AS d_mon, death.d_year AS d_year, #__mb_name.n_full, #__mb_name.n_surname, #__mb_name.n_givn, #__mb_name.n_midd, #__mb_name.n_nick, #__mb_name.n_suff

                    FROM #__mb_individuals LEFT JOIN #__mb_dates AS birth ON (birth.d_gid = #__mb_individuals.i_id and  birth.d_fact="BIRT" )
                    LEFT JOIN #__mb_name  ON (#__mb_name.n_id = #__mb_individuals.i_id )

                    LEFT JOIN #__mb_dates AS death ON (death.d_gid = #__mb_individuals.i_id and death.d_fact="DEAT")
                    WHERE #__mb_individuals.i_id = "'.$id.'" LIMIT 1';
            $db->setQuery($req);         
            $rows = $db->loadAssocList();
            
            $pers = new Individual(); 
            $pers->Id = $rows[0]['i_id'];
            $pers->FirstName = $rows[0]['n_givn'];
            $pers->MiddleName = $rows[0]['n_midd'];
            $pers->LastName = $rows[0]['n_surname'];
            $pers->Nick = $rows[0]['n_nick'];
            $pers->Suffix = $rows[0]['n_suff'];
            $pers->Gender = $rows[0]["i_sex"];
            $pers->Occupation = $rows[0]["i_occupation"];
            $pers->FacebookId = $rows[0]['i_fid'];

            if(!$lite)
                $this->core->events->assignPersonsEvents($pers);
           
            return $pers;         

        }
        function save($ind){
             $db =& JFactory::getDBO();
             $req = 'INSERT INTO #__mb_individuals (`i_id`, `i_fid`,`i_file`,`i_rin`,`i_sex`,`i_occupation`) VALUES ("'.$ind->Id.'", "'.$ind->FacebookId.'", "","","'.$ind->Gender.'","'.$ind->Occupation.'")';
             $db->setQuery($req);
             $db->query();
             $surname = $ind->LastName != '' ? $ind->LastName : '@N.N.';
             $givenname = $ind->FirstName != '' ? $ind->FirstName : '@N.N.';
             $req = 'INSERT INTO #__mb_name (`n_id`,`n_num`,`n_type`,`n_sort`,`n_full`,`n_list`,`n_surname`,`n_surn`,`n_givn`,`n_nick`,`n_midd`,`n_suff`) VALUES ("'.$ind->Id.'","0","NAME",';
             $req .= '"'.strtoupper($surname.','.($ind->MiddleName!='' ? $ind->MiddleName.',' : '' ).$givenname.($ind->Suffix!='' ? ','.$ind->Suffix : '' ) ).'", "'.$givenname.','.($ind->MiddleName!='' ? $ind->MiddleName.',' : '' ).$surname.($ind->Suffix!='' ? ','.$ind->Suffix : '' ).'",';
             $req .= '"", "'.$surname.'", "'.strtoupper($surname).'", "'.$givenname.'", "'.$ind->Nick.'", "'.$ind->MiddleName.'", "'.$ind->Suffix.'" )';
             $db->setQuery($req);
             $db->query();
        }
        function getByName($firstName, $lastName, $lite=false){
            $db =& JFactory::getDBO();
            $req = 'SELECT distinct #__mb_individuals . * ,
                      #__mb_name.n_surname, #__mb_name.n_givn, #__mb_name.n_midd, #__mb_name.n_suff

                    FROM #__mb_individuals 
                    LEFT JOIN #__mb_name  ON (#__mb_name.n_id = #__mb_individuals.i_id )

                    
                    WHERE #__mb_name.n_surname = "'.$lastName.'" and #__mb_name.n_givn = "'.$firstName.'" LIMIT 1';
            $db->setQuery($req);
            $rows = $db->loadAssocList();
            if($rows == null)
                return null;
            $pers = new Individual($rows[0]['i_id'], $rows[0]['n_givn'], $rows[0]['n_midd'], $rows[0]['n_surname'], $rows[0]['n_suff'], $rows[0]["i_sex"], $rows[0]["i_occupation"]);

            if(!$lite)
                $this->core->events->assignPersonsEvents($pers);

            return $pers;
        }
        function getIdbyFId($fid){
        	$db =& JFactory::getDBO();
        	$req = 'SELECT i_id FROM #__mb_individuals WHERE i_fid='.$fid;
        	$db->setQuery($req);
        	$rows = $db->loadAssocList();
        	if($rows == null){ return false; }
        	return $rows[0]['i_id'];
        }
        function getNewId(){
            $db =& JFactory::getDBO();
            $req = 'SELECT SUBSTRING(i_id,2) as id FROM #__mb_individuals ORDER BY id+0 DESC';
            $db->setQuery($req);


            $rows = $db->loadAssocList();
            if($rows == null){
               $newid = 'I1' ;
            }else{
                $newid = 'I'.($rows[0]['id']+1) ;
            }
            return $newid;

        }
        public function update($person){
           if($person->Id){

                $db =& JFactory::getDBO();
                $req = "UPDATE #__mb_individuals SET i_sex='".$person->Gender."', i_occupation='".$person->Occupation."'  WHERE i_id='".$person->Id."'";
                $surname = ($person->LastName != "" ? $person->LastName : "@N.N.");
                $givenname =  ($person->FirstName != "" ? $person->FirstName : "@P.N.");
                
                $db->setQuery($req);
                $db->query();
                $req = "UPDATE #__mb_name SET n_sort='".strtoupper($surname.",".$givenname)."', n_full='".$surname." ".$givenname."', n_list='"
                            .$surname.", ".$givenname."', n_surname='".$surname."', n_surn='".strtoupper($surname)."', n_givn='"
                            .$givenname."', n_nick='".$person->Nick."', n_midd='".$person->MiddleName."', n_suff='".$person->Suffix."' WHERE n_id='".$person->Id."'";;
                $db->setQuery($req);
                $db->query();
            }
        }
        public function delete($id){
            if($id){
            	$ind = $this->get($id);
            	    
                $db =& JFactory::getDBO();
                $req = "DELETE FROM #__mb_individuals  WHERE i_id='".$id."'";
                $db->setQuery($req);
                $db->query();
                
                $req = "DELETE FROM #__mb_dates WHERE d_gid ='".$id."'";
                $db->setQuery($req);
                $db->query();

                $req = "DELETE FROM #__mb_name  WHERE n_id='".$id."'";
                $db->setQuery($req);
                $db->query();

                $req = "DELETE FROM #__mb_link  WHERE l_to='".$id."' OR l_from='".$id."'";
                $db->setQuery($req);
                $db->query();

                $req = "DELETE FROM #__mb_placelinks  WHERE pl_gid='".$id."'";
                $db->setQuery($req);
                $db->query();

                //$req = "UPDATE  #__mb_families SET f_numchil=(f_numchil -1), f_chill=REPLACE(REPLACE(f_chill, '".$id."," ."',''),'".",".$id ."', '') WHERE f_husb='".$id."' OR f_wife='".$id."' ";
                $fam_pos = ($ind->Gender == "M")?"f_husb":"f_wife";
                $req = "UPDATE #__mb_families SET ".$fam_pos." = '' WHERE f_husb = '".$id."' OR f_wife = '".$id."'";
                $db->setQuery($req);
                $db->query();
            }
        }
        function getAllIds(){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_individuals.i_id as id FROM #__mb_individuals';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            return $rows;
        }
        function getGedcomString($id){
            $individual = $this->core->individuals->get($id, true);
            $str = '';
            
            if($individual != null){
                $str .= "0 @{$individual->Id}@ INDI\n";
                $str .= "1 NAME {$individual->FirstName} {$individual->MiddleName} /{$individual->LastName}/ {$individual->Suffix}\n";
                $str .= "1 SEX {$individual->Gender}\n";
                if($individual->Occupation != ''){
                    $str .= "1 OCCU {$individual->Occupation}\n";
                }
                $events = $this->core->events->getPersonsEvents($id, true);
      
                if($events != null){
                    foreach ($events as $event){
                        $str .= $this->core->events->getGedcomString($event->Id);
                    }
                }

                $fams = $this->core->families->getPersonsFamilies($individual->Id, true);             
                if($fams != null)
                    foreach($fams as $fam){
                        $str .= "1 FAMS @{$fam->Id}@\n";
                    }
                
                $famc = $this->core->families->getPersonsChildFamilies($individual->Id, true);              
                if($famc != null)
                    foreach($famc as $fam){
                        $str .= "1 FAMC @{$fam->Id}@\n";
                    }
            
                $sources = $this->core->sources->getLinkedSources($individual->Id);
                if($sources != null)
                    foreach($sources as $sour){
                        $str .= "1 SOUR @{$sour->Id}@\n";
                    }

                $media = $this->core->media->getMediaByGedId($individual->Id);
                if($media != null)
                    foreach($media as $med){
                        $str .= "1 OBJE @{$med->Id}@\n";
                    }
                
                $notes = $this->core->notes->getLinkedNotes($individual->Id);
                if($notes != null)
                    foreach($notes as $note){
                        $str .= "1 NOTE @{$note->Id}@\n";
                    }
            }
            return $str;
        }
        function getDescendants(&$array, $id){
            $childs = $this->core->individuals->getChilds($id);
            foreach($childs as $child){
            	$array[] = $child;
                $this->getDescendants($array, $child['id']);
            }
        }
        function getOccupationFromArray($gedArray){
            $count = count($gedArray);
            $result = '';
            for($i=0; $i<$count; $i++){

                if(isset ($gedArray[$i][1]))
                    if($gedArray[$i][1]=='OCCU'){
                        $level = $gedArray[$i][0];
                        $j=0;
                        $i++;
                        while ($gedArray[$i][0] > $level){
                            if(isset ($gedArray[$i][1]) && $gedArray[$i][1]=='PLAC'){
                                $result = isset($gedArray[$i][2]) ? $gedArray[$i][2] : '';
                                break;
                            
                            }
                            $i++;
                        }
                        break;
                    }

            }
            return $result;

        }
        function splitGedcomString($gedString){
            $matches = array();
            preg_match_all('/([0-9] [A-Z]{3,4}.*)/', $gedString, $matches);
            if(isset($matches[0])){
                 $count = count($matches[0]);
              
                $processedArray;
              
                for($i=0; $i<$count; $i++){
                    $processedArray[] = explode(' ', $matches[0][$i]);
                }
            }
            return $processedArray;
        }
        function mergeGedcomArray($gedArray){
            $count = count($gedArray);
            for($i=0; $i<$count; $i++){
                $gedArray[$i] = addslashes(implode(' ',$gedArray[$i]));
            }
            $gedArray = implode('\n', $gedArray);
            
            return $gedArray;
        }
        function getFamilysChilds($family_id){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_link.l_to as id FROM #__mb_link where l_type="CHIL" and l_from="'.$family_id.'"';
            $db->setQuery($req);

            $rows = $db->loadAssocList();

            return $rows;
        }
        function getSiblings($id, $lite=false){
            $db =& JFactory::getDBO();
                $req = "SELECT siblings.l_to AS id
                        FROM #__mb_link
                        INNER JOIN #__mb_link AS siblings ON  #__mb_link.l_from = siblings.l_from
                        AND siblings.l_type = 'CHIL'
                        WHERE #__mb_link.l_type = 'CHIL'
                        AND #__mb_link.l_to = '".$id."'"; //selected persoun will be included in the list of siblings
            $db->setQuery($req);
           
           $rows = $db->loadAssocList();
           $siblings = array ();
           foreach($rows as $sibling){
               $siblings[] =$this->get($sibling['id'], $lite);
           }
           return $siblings;
        }
        function getFirstParent($id, $line=false, $first=false){
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
        function getParents($id){
            $db =& JFactory::getDBO();
            $req = "SELECT	family.f_id AS familyId,
            			family.f_husb AS fatherID, 
            			family.f_wife AS motherID,
            			date.d_day AS marriageDay,
            			date.d_mon AS marriageMonth,
            			date.d_year AS marriageYear
            	FROM jos_mb_link
            	LEFT JOIN jos_mb_families AS family ON jos_mb_link.l_from = family.f_id
            	LEFT JOIN jos_mb_dates AS date ON ( family.f_id = date.d_gid AND date.d_fact = 'MARR' )
            	WHERE jos_mb_link.l_to = '".$id."' AND jos_mb_link.l_type = 'CHIL'";
            $db->setQuery($req);
         
           $rows = $db->loadAssocList();
           return $rows[0];
        }
        function getFamilyId($id, $type){
        	$db =& JFactory::getDBO();
        	if($type == 'FAMS' || $type == 'FAMC'){
        		$req = "SELECT * FROM `#__mb_link` WHERE l_from = '".$id."'";
        	}
        	else {
        		$req = "SELECT * FROM `#__mb_link` WHERE l_to = '".$id."'";
        	}
        	$req .= "AND l_type ='".$type."'";
        	$db->setQuery($req);
        	$rows = $db->loadAssocList();
        	return ($type == 'FAMS' || $type == 'FAMC') ? $rows[0]['l_to'] : $rows[0]['l_from'];
        }
        function getChilds($id){
            $db =& JFactory::getDBO();
            $db->setQuery("SELECT #__mb_name.n_id as id, #__mb_individuals.i_sex as sex, REPLACE( REPLACE(#__mb_name.n_full, '@N.N.', '') , '@P.N.', '') as name,
                        #__mb_name.n_midd as middlename, #__mb_name.n_suff as suffix, #__mb_name.n_surname as surname,	#__mb_name.n_givn as givenname
                    FROM #__mb_link
                    INNER JOIN #__mb_link AS child ON #__mb_link.l_from = child.l_from
                    AND child.l_type = 'CHIL'
                    INNER JOIN #__mb_name ON #__mb_name.n_id = child.l_to
                    INNER JOIN #__mb_individuals ON #__mb_individuals.i_id = child.l_to
                    WHERE (#__mb_link.l_type = 'HUSB'
                    OR #__mb_link.l_type = 'WIFE')
                    AND #__mb_link.l_to = '".$id."'");
           $rows = $db->loadAssocList();
           return $rows;
        }
        function count($filter=null, $living=null){
            $db =& JFactory::getDBO();

            $req = 'SELECT COUNT(*)
                    FROM #__mb_individuals
                    LEFT JOIN #__mb_dates AS birth ON ( birth.d_gid = #__mb_individuals.i_id
                    AND birth.d_fact = "BIRT" )
                    LEFT JOIN #__mb_name ON ( #__mb_name.n_id = #__mb_individuals.i_id )
                    LEFT JOIN #__mb_dates AS death ON ( death.d_gid = #__mb_individuals.i_id
                    AND death.d_fact = "DEAT" )';
            if($filter !=null){ 
                $req .=' WHERE ';
                $req .= ' REPLACE( REPLACE(#__mb_name.n_full, "@N.N.", "") , "@P.N.", "") LIKE "%'.$filter.'%" OR #__mb_name.n_id LIKE "%'.$filter.'%"';
            } if($living !=null){
                if($filter !=null){
                    $req .=' AND death.d_fact is NULL';
                }else{
                    $req .=' WHERE death.d_fact is NULL';
                }
            }
          
            $db->setQuery($req);
             $rows = $db->loadAssocList();

             return $rows[0]['COUNT(*)'];
        }
        function youngestLivingMember(){
            $db =& JFactory::getDBO();   
            $date_time_array = getdate( time() );
            $date=$date_time_array['year'];
            $req = 'SELECT birth.d_year AS b_year, birth.d_mon AS b_mon,birth.d_day AS b_day,  birth.d_year AS b_year, #__mb_name.n_full AS fullname, #__mb_name.n_surname AS surname, #__mb_individuals.i_id AS id, #__mb_name.n_givn AS givenname, #__mb_name.n_midd AS middlename, #__mb_name.n_suff AS suffix,
                    #__mb_individuals.i_sex AS sex,
                    IF( death.d_year is NULL and birth.d_year is NULL, "",
                    IF(death.d_year is NULL, YEAR(NOW()) - birth.d_year , death.d_year - birth.d_year )) AS age, IF( (
                    death.d_year is NULL
                    ), "1", "0" ) AS living
                    FROM #__mb_individuals
                    LEFT JOIN #__mb_dates AS birth ON ( birth.d_gid = #__mb_individuals.i_id
                    AND birth.d_fact = "BIRT" )
                    LEFT JOIN #__mb_name ON ( #__mb_name.n_id = #__mb_individuals.i_id )
                    LEFT JOIN #__mb_dates AS death ON ( death.d_gid = #__mb_individuals.i_id
                    AND death.d_fact = "DEAT" ) WHERE death.d_fact is NULL and birth.d_year IS NOT NULL ORDER BY age+0 asc LIMIT 1';
            $db->setQuery($req);
            $rows = $db->loadAssocList();

            return $rows[0];
        }
        function oldestLivingMember(){
            $db =& JFactory::getDBO();

            $date_time_array = getdate( time() );
            $date=$date_time_array['year'];
            $req = 'SELECT birth.d_year AS b_year, birth.d_mon AS b_mon,birth.d_day AS b_day,  birth.d_year AS b_year, #__mb_name.n_full AS fullname, #__mb_name.n_surname AS surname,  #__mb_individuals.i_id AS id, #__mb_name.n_givn AS givenname, #__mb_name.n_midd AS middlename, #__mb_name.n_suff AS suffix,
                    #__mb_individuals.i_sex AS sex,
                    IF( death.d_year is NULL and birth.d_year is NULL, "",
                    IF(death.d_year is NULL, YEAR(NOW()) - birth.d_year , death.d_year - birth.d_year )) AS age, IF( (
                    death.d_year is NULL
                    ), "1", "0" ) AS living
                    FROM #__mb_individuals
                    LEFT JOIN #__mb_dates AS birth ON ( birth.d_gid = #__mb_individuals.i_id
                    AND birth.d_fact = "BIRT" )
                    LEFT JOIN #__mb_name ON ( #__mb_name.n_id = #__mb_individuals.i_id )
                    LEFT JOIN #__mb_dates AS death ON ( death.d_gid = #__mb_individuals.i_id
                    AND death.d_fact = "DEAT" ) WHERE death.d_fact is NULL  and birth.d_year IS NOT NULL and IF( death.d_year is NULL and birth.d_year is NULL, "",
                    IF(death.d_year is NULL, YEAR(NOW()) - birth.d_year , death.d_year - birth.d_year ))<120 ORDER BY age+0 desc LIMIT 1';
            $db->setQuery($req);
            $rows = $db->loadAssocList();

            return $rows[0];
        }
        function yearliestAncestor(){
            $db =& JFactory::getDBO();
            $start = $pageNum*$perPage;
            $end = $perPage;
            $date_time_array = getdate( time() );
            $date=$date_time_array['year'];
            $req = 'SELECT birth.d_year AS b_year, birth.d_mon AS b_mon,birth.d_day AS b_day,  birth.d_year AS b_year, death.d_year AS d_year, #__mb_name.n_full AS fullname, #__mb_name.n_surname AS surname, #__mb_individuals.i_id AS id, #__mb_name.n_givn AS givenname, #__mb_name.n_midd AS middlename, #__mb_name.n_suff AS suffix,
                    #__mb_individuals.i_sex AS sex,
                    IF( death.d_year is NULL and birth.d_year is NULL, "",
                    IF(death.d_year is NULL, YEAR(NOW()) - birth.d_year , death.d_year - birth.d_year )) AS age, IF( (
                    death.d_year is NULL
                    ), "1", "0" ) AS living
                    FROM #__mb_individuals
                    INNER JOIN #__mb_dates AS birth ON ( birth.d_gid = #__mb_individuals.i_id
                    AND birth.d_fact = "BIRT" )
                    LEFT JOIN #__mb_name ON ( #__mb_name.n_id = #__mb_individuals.i_id )
                    LEFT JOIN #__mb_dates AS death ON ( death.d_gid = #__mb_individuals.i_id
                    AND death.d_fact = "DEAT" ) ';

                $req .= ' WHERE birth.d_year!=0 and  birth.d_year is not null ORDER BY b_year ASC LIMIT 1';


            $db->setQuery($req);
            $rows = $db->loadAssocList();

            return $rows;
        }
        function allFormated($pageNum=0, $perPage=50, $id=null, $filter=null, $sort=null, $order=null){
            $db =& JFactory::getDBO();
            $start = $pageNum*$perPage;
            $end = $perPage;
            $date_time_array = getdate( time() );
            $date=$date_time_array['year'];
            $req = 'SELECT birth.d_id as b_id, death.d_id as d_id, birth.d_year AS b_year, birth.d_mon AS b_mon,birth.d_day AS b_day,  birth.d_year AS b_year, death.d_year AS d_year, #__mb_name.n_full AS fullname, #__mb_name.n_surname AS surname, #__mb_individuals.i_id AS id, #__mb_name.n_givn AS givenname, #__mb_name.n_midd AS middlename, #__mb_name.n_suff AS suffix,
                    #__mb_individuals.i_sex AS sex,
                    IF( death.d_year is NULL and birth.d_year is NULL, "",
                    IF(death.d_year is NULL, YEAR(NOW()) - birth.d_year , death.d_year - birth.d_year )) AS age, IF( (
                    death.d_year is NULL
                    ), "1", "0" ) AS living
                    FROM #__mb_individuals
                    LEFT JOIN #__mb_dates AS birth ON ( birth.d_gid = #__mb_individuals.i_id
                    AND birth.d_fact = "BIRT" )
                    LEFT JOIN #__mb_name ON ( #__mb_name.n_id = #__mb_individuals.i_id )
                    LEFT JOIN #__mb_dates AS death ON ( death.d_gid = #__mb_individuals.i_id
                    AND death.d_fact = "DEAT" )';
            if($id != null)
                $req .= ' WHERE #__mb_individuals.i_id="'.$id.'" ';
            if($filter !=null){
                if($id !=null)
                    $req .=' AND (';
                else{
                    $req .=' WHERE ';
                }
                $req .= ' REPLACE( REPLACE(#__mb_name.n_full, "@N.N.", "") , "@P.N.", "") LIKE "%'.$filter.'%" OR #__mb_name.n_id LIKE "%'.$filter.'%"';
                if($id !=null)
                    $req .=' )';
            }
            if($sort&&$order){
                 if(($sort == "name")){
                     $req.= " ORDER BY n_surn ".$order.", n_givn ".$order;}
                 elseif($sort == "age"){
                     $req.= " ORDER BY age+0 ".$order;
                 }elseif($sort == "birth"){
                     $req.= " ORDER BY b_year ".$order.", b_mon ".$order.", b_day ".$order;

                 }else
                     $req.= " ORDER BY ".$sort." ".$order;
             }
            $req .=  ' LIMIT '.$start . ', '.$end;
            
           
            $db->setQuery($req);
            $rows = $db->loadAssocList();

            return $rows;
        }
*/
}
?>
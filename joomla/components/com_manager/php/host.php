<?php
require_once('gedcom/core.gedcom.php');
require_once('gramps/core.gramps.php');
//class
class Host {
	/**
	*
	*/
	public $gedcom;
        public $modulesPath;
        public $gramps;    
	/**
	*
	*/
	function __construct($type){		
            $this->modulesPath = JPATH_ROOT."/components/com_manager/modules/";
            $this->gedcom = new Gedcom($this);
            $this->gramps = new Gramps($this);
	}
	
	/**
	*
	*/
        function getSettingsStructure($module){
            $properties = $this->getJsonProperties($module);
            return $properties[0]['structure'];
        }
        
        /**
        *
        */
        function getSettingsValues($module){
            $properties = $this->getJsonProperties($module);
            return $properties[0]['value'];
        }
        
        /**
        *
        */
        function setSettingsValues($module, $values){
            $this->saveJsonProperties($module, $values);
        }
        
        /**
         *
         * @param <string> $modulename
         * @param <string> $classname
         * @param <string> $method
         * @param <string> $arguments
         * @return <type>
         *
         */
        function callMethod($modulename,$classname, $method, $arguments){
            $args = explode("|", $arguments);
            $modulePath = $this->modulesPath.$modulename."/php/".$modulename.".php";
            if(!file_exists($modulePath)){
            	    return;
            }           
            require_once($modulePath);
            if($classname != null){
                $obj = new $classname;

                return call_user_func_array(array($obj, $method), $args);
            }else
                return call_user_func_array($method, $args);
        }
        
        /**
        *
        */
        function getAbsoluteRootPath(){
            return JPATH_BASE;
        }
        
        /**
        *
        */
        function getRootDirectory(){
            return JURI::base(true);
        }
        
        /**
        *
        */
        function getModuleName($nameOrId){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT name,id FROM #__mb_modules WHERE
                       (name = "'.$nameOrId.'" OR id="'.$nameOrId.'")');
              $rows = $db->loadAssocList();
              if(isset($rows[0]['name']))
                  return ($rows[0]['name']);
              else
                  return null;
        }
        
        /**
        *
        */
        function getModuleId($nameOrId){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT name,id FROM #__mb_modules WHERE
                       (name = "'.$nameOrId.'" OR id="'.$nameOrId.'")');
              $rows = $db->loadAssocList();
              if(isset($rows[0]['id']))
                  return ($rows[0]['id']);
              else
                  return null;
        }
        
        /**
        *
        */
        function encodeProperties($array){
            $json = '[';
            foreach($array as $property){
                if($property->type != "select" && $property->type != "radio" && $property->type != "checkbox")
                    $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","value":"'.$property->value.'"},';
                else{
                    if($property->type == "select"){
                        $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","selected":"'.$property->selected.'"},';
                    }elseif($property->type == "radio"){
                        $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","value":"'.$property->value.'","checked":"'.$property->checked.'"},';
                    }elseif($property->type == "checkbox"){
                        $json .= '{"type":"'.$property->type.'","name":"'.$property->name.'","checked":"'.$property->checked.'"},';
                    }
                }
            }
            $json = substr($json, 0, strlen($json)-1) . ']';
          
            return $json;
        }

         /**
         * get module properties
         *  @return <string> JSON encoded properies
         */
        function getJsonProperties($modulename){
            $name = $this->getModuleName($modulename);
            if($name == null)
                return null;
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT structure, value
                                FROM #__mb_settings
                                WHERE module_name = "'.$name.'"
                         ');
            $rows = $db->loadAssocList();
          
            $values = array();
            if($rows != null){
                $values = json_decode($rows[0]['value']);
            }
          
            $db->setQuery('SELECT "title" as name, #__mb_modules.title as value
                                FROM #__mb_modules
                                WHERE name = "'.$name.'"');
            $title = $db->loadAssocList();
            $ar = array ();

            $titl;
            $titl->type = "input";
            $titl->name = $title[0]['name'];
            $titl->value = $title[0]['value'];
            $ar[] = $titl;
          
            if(is_array($values))
                $values = array_merge($ar, $values);
            else {
                $values = $ar;
            }
        
            $rows[0]['value'] = $this->encodeProperties($values);
            //var_dump($rows[0]['value']);
            return $rows;
        }
        
        /**
        *
        */
        public function getSiteSettings($tab){
            if($tab == 'color'){
        	$sql = "SELECT name, value FROM #__mb_system_settings WHERE type='color'";
        	$db =& JFactory::getDBO();
        	$db->setQuery($sql);
		$s_array = $db->loadAssocList();
                
		return $s_array;
            }
        }
        
        /**
        *
        */
        public function sendSiteSettings($tab){
            $resp = $this->getSiteSettings($tab);
            if($resp != null)
                $resp = json_encode($resp);
            echo $resp;

        }
        
          /**
         * saves module properties
         *  @params: modulename, properties JSON string
         */
        function saveJsonProperties($modulename, $properties_json){
            $db =& JFactory::getDBO();
            $name = $this->getModuleName($modulename);
            $id = $this->getModuleId($modulename);
            if($name == null)
                return null;

            $properties_array = json_decode($properties_json);
            for($i=0; $i<count($properties_array); $i++){
                if($properties_array[$i]->name == 'title'){
                     $req = 'SELECT title FROM #__mb_modules WHERE name="'.$name.'"';
                     $db->setQuery($req);
                     $title = $db->loadAssocList();
                     $title = $title[0]['title'];
                     $req = 'UPDATE #__mb_modulesgrid SET json=REPLACE(#__mb_modulesgrid.json, "'.$title.'", "'.$properties_array[$i]->value.'")';
                     $db->setQuery($req);
                     echo $req;
                     $db->query();
                     
                     $req = 'UPDATE #__mb_modules SET title="'.$properties_array[$i]->value.'"
                                WHERE name = "'.$name.'"';
                     $db->setQuery($req);
                     $db->query();
                     unset($properties_array[$i]);
                }
            }
            $json = $this->encodeProperties($properties_array);

            $req = "UPDATE #__mb_settings SET value='".$json."'
                WHERE module_name = '".$name."'";

            $db->setQuery($req);
            $db->query();
               
        }

        /**
	* get all user info
	* @var $id gedcom individual id
	* @return array all info about individ
	*/
	public function getUserInfo($indKey, $indRel = false){
		if($indKey==null){ return null; }
		$indiv = $this->gedcom->individuals->get($indKey);
		if($indRel) $indiv->Relation = $this->gedcom->individuals->relation->get_relation($indKey, $indRel);
		$events = $this->gedcom->events->getAllEventsByIndKey($indKey);
		$parents = $this->gedcom->individuals->getParents($indKey);
		$children = $this->gedcom->individuals->getChilds($indKey);
		$families = $this->gedcom->families->getPersonFamilies($indKey, true);
		$spouses = array();	
		foreach($families as $family){
			if($family->Spouse == null) continue;
			$famevent = $this->gedcom->events->getFamilyEvents($family->Id);
			$childs = $this->gedcom->families->getFamilyChildrenIds($family->Id);
			$spouses[] = array('id'=>$family->Spouse->Id,'indiv'=>$family->Spouse,'children'=>$childs,'event'=>$famevent);
		}
		$notes = NULL;
		$sources = NULL;
		$photos = $this->gedcom->media->getMediaByGedId($indKey);
		$avatar = $this->gedcom->media->getAvatarImage($indKey);

		return array('indiv'=>$indiv,'events'=>$events,'parents'=>$parents,'families'=>$families,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
	}
	
	/**
	* @return array all invdividuals links with first parent
	* @var $id gedcom user id
	* @var &$individs array link of array
	*/
	/*
	public function getIndividsArray($indKey, &$individs, $indRel = false){
		if($indKey==NULL){ return false; }
		$individ = $this->getUserInfo($indKey, $indRel);
		$individs[$indKey] = $individ;
		
		//Fill the array of families
		foreach($individ['families'] as $family){
			if($family->Spouse!=null&&!array_key_exists($family->Spouse->Id, $individs)){
				$this->getIndividsArray($family->Spouse->Id, $individs, $indRel);
			}
		}

		//Fill the array of children
		foreach($individ['children'] as $child){
			if(!array_key_exists($child['gid'], $individs)){
				$this->getIndividsArray($child['gid'], $individs, $indRel);
			}
		}		
		
		//Fill the array of parents
		if($individ['parents'] != null){
			if($individ['parents']['fatherID'] != null && !array_key_exists($individ['parents']['fatherID'], $individs)){
				$this->getIndividsArray($individ['parents']['fatherID'], $individs, $indRel);
			}
			if($individ['parents']['motherID'] != null && !array_key_exists($individ['parents']['motherID'], $individs)){
				$this->getIndividsArray($individ['parents']['motherID'], $individs, $indRel);
			}
		}
	}        
	*/
	
	public function getLatestUpdates($treeId){
		$db =& JFactory::getDBO();
		$sql = $this->gedcom->sql("SELECT * FROM #__mb_updates WHERE tree_id = ?", $treeId);
		$db->setQuery($sql);
		return $db->loadAssocList();
		
	}
	
	// cash family line
	protected function convert($array, $index){
		$result = array();
		foreach($array as $el){
			$result[$el[$index]][] = $el;
		}
		return $result;
	}
	
	protected function getParents($indKey, $childs_assoc_id, $families){
		if(!isset($childs_assoc_id[$indKey])) return null;
		$family_id = $childs_assoc_id[$indKey][0]['fid'];
		return (isset($families[$family_id]))?$families[$family_id][0]:null;
	}
	
	protected function getChildsByIndKey($indKey, $childs_assoc_id, $childs_assoc_fid){
		if(!isset($childs_assoc_id[$indKey])) return null;
		$family_id = $childs_assoc_id[$indKey][0]['fid'];
		return (isset($childs_assoc_fid[$family_id]))?$childs_assoc_fid[$family_id]:null;
	}
	
	protected function getChildsByFamKey($family_id, $childs_assoc_fid){
		if(!isset($childs_assoc_fid[$family_id])) return null;
		return $childs_assoc_fid[$family_id];
	}
		
	protected function setParentFamLine($indKey, $type, &$line, &$childs_assoc_id, &$families){
		$line[$indKey]['key']= $indKey;
		$line[$indKey]['type'][] = $type;
		
		$parents = $this->getParents($indKey, $childs_assoc_id, $families);
		if($parents==null) return;
		$father = ($parents['husb']!=null)?$parents['husb']:false;
		$mother = ($parents['wife']!=null)?$parents['wife']:false;
		if($father){
			$this->setParentFamLine($father, $type, $line, $childs_assoc_id, $families);
		}
		if($mother){
			$this->setParentFamLine($mother, $type, $line, $childs_assoc_id, $families);
		}
	}
	
	protected function setChildFamLine($indKey, $type, &$line, &$childs_assoc_id, &$childs_assoc_fid, &$families, &$conflicts){
		$childs = $this->getChildsByIndKey($indKey, $childs_assoc_id, $childs_assoc_fid);
		if($childs==null) return;
		foreach($childs as $child){
			$parents = $this->getParents($indKey, $childs_assoc_id, $families);
			$father = ($parents['husb']!=null)?$parents['husb']:false;
			$mother = ($parents['wife']!=null)?$parents['wife']:false;
			if(isset($line[$father])&&isset($line[$mother])){
				$f_types = $line[$father]['type'];
				$m_types = $line[$mother]['type'];
				$types = array_merge($f_types, $m_types);
			} else if(isset($line[$father])){
				$types = $line[$father]['type'];
				$conflicts[$mother]['key'] = $mother;
			} else if(isset($line[$mother])){
				$types = $line[$mother]['type'];
				$conflicts[$father]['key'] = $father;
			} else {
				$conflicts[$father]['key'] = $father;
				$conflicts[$mother]['key'] = $mother;
				break;
				
			}
			$line[$child['gid']]['key']= $child['gid'];
			foreach($types as $t){
				$line[$child['gid']]['type'][] = $t;
			}
		}
	}
	
	protected function insertsToFamLine($treeId, $ownerId, $objects){
		$db =& JFactory::getDBO();
		$sql = "INSERT INTO #__mb_family_line (`tid`, `from`, `to`, `type`) VALUES ";
		foreach($objects as $obj){
			$types = array_keys(array_count_values($obj['type']));
			foreach($types as $type){
				$sql .= "('".$treeId."','".$ownerId."','".$obj['key']."','".$type."'),";
			}
		}
		$db->setQuery(substr($sql,0,-1));
		$db->query();
	}
	
	public function createCashFamilyLine($treeId, $ownerId){
		//get data		
		$families = $this->convert($this->gedcom->families->getFamilies($treeId), 'id');
		$childs = $this->gedcom->families->getChilds($treeId);

		$childs_assoc_id = $this->convert($childs, 'gid');
		$childs_assoc_fid = $this->convert($childs, 'fid');
		
		//parsse data
		$line = array();
		$conflicts = array();
	
		$owner_parents = $this->getParents($ownerId, $childs_assoc_id, $families);
		$father = ($owner_parents['husb']!=null)?$owner_parents['husb']:false;
		$mother = ($owner_parents['wife']!=null)?$owner_parents['wife']:false;
		
		if($father){
			$this->setParentFamLine($father, 'f', $line, $childs_assoc_id, $families);
		}
		if($mother){
			$this->setParentFamLine($mother, 'm', $line, $childs_assoc_id, $families);
		}
		
		foreach($line as $indiv){
			$this->setChildFamLine($indiv['key'], $indiv['type'], $line, $childs_assoc_id, $childs_assoc_fid, $families, $conflicts);
		}
		
		//insert to db
		$result = array_chunk($line, 50, true);
		foreach($result as $res){
			$this->insertsToFamLine($treeId, $ownerId, $res);
		}
	}
	
	public function getFamLine($indivs, $childs_assoc_id, $families, $members){
		$objects = array();
		$types = array();
		foreach($indivs as $indiv){
			$parents = $this->getParents($indiv, $childs_assoc_id, $families);
			$father = ($parents['husb']!=null)?$parents['husb']:false;
			$mother = ($parents['wife']!=null)?$parents['wife']:false;
			if($father){
				if(isset($members[$father])){
					$types[] = $members[$father];
				}
				$objects[] = $father;
			}
			if($mother){
				if(isset($members[$mother])){
					$types[] = $members[$mother];
				}
				$objects[] = $mother;
			}
		}
		if(empty($objects)){ return false; }
		if(!empty($types)){ 
			$result = array();
			foreach($types as $type){
				foreach($type as $t){
					$result[] = $t['type'];
				}
			}
			return $result;
		}
		return $this->getFamLine($objects,$childs_assoc_id, $families, $members);
	}
	
	public function checkCashFamilyLine($treeId, $ownerId){
		//get not cashed users
		$relatives = $this->convert($this->gedcom->individuals->getRelatives($treeId), 'individuals_id');
		$members = $this->convert($this->gedcom->individuals->getMembersByFamLine($treeId, $ownerId), 'individuals_id');
		$diff = array_diff_assoc($relatives, $members);
		
		//get data
		$families = $this->convert($this->gedcom->families->getFamilies($treeId), 'id');
		$childs = $this->gedcom->families->getChilds($treeId);
		$childs_assoc_id = $this->convert($childs, 'gid');
		
		$objects = array();
		foreach($diff as $user){
			$indKey = $user[0]['individuals_id'];
			$type = $this->getFamLine(array($indKey), $childs_assoc_id, $families, $members);
			if($type){
				$objects[$indKey] = array('key'=>$indKey,'type'=>$type);
			}
		}
		
		//insert to db
		$result = array_chunk($objects, 25, true);
		foreach($result as $res){
			$this->insertsToFamLine($treeId, $ownerId, $res);
		}
		
	}
}

?>

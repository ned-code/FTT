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
		$indiv->FamLine = $this->gedcom->individuals->getMemberFamLine($_SESSION['jmb']['tid'], $_SESSION['jmb']['gid'], $indKey);
		if($indRel){
			$indiv->Relation = $this->gedcom->individuals->relation->get_relation($indKey, $indRel);
		}
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
	
	public function array_merge_assoc($objects){
		$result = array();
		foreach($objects as $array){
			foreach($array as $k => $v){
				$result[$k] = $v;
			}
		}
		return $result;
	}
	
	public function convert2($array, $keys){
		$arr = array();
		foreach($keys as $key){
			$arr[] = $this->convert($array, $key);
		}
		return $this->array_merge_assoc($arr);
	}
	
	public function convert($array, $index){
		$result = array();
		$array = (array)$array;
		foreach($array as $el){
			if($el[$index]!=null){
				$result[$el[$index]][] = $el;
			}
		}
		return $result;
	}
	
	public function getTreeLib($treeId){	
		$families = $this->gedcom->families->getFamilies($treeId);
		$childs = $this->gedcom->families->getChilds($treeId);
		$lib = array();
		$lib['families']['gid'] = $this->convert2($families, array('husb','wife'));
		$lib['families']['fid'] = $this->convert($families, 'id');
		$lib['childrens']['gid'] = $this->convert($childs, 'gid');	
		$lib['childrens']['fid'] = $this->convert($childs, 'fid');
		return $lib;
	}
	
	public function getParents($indKey, $lib){
		if(!isset($lib['childrens']['gid'][$indKey])) return null;
		$family_id = $lib['childrens']['gid'][$indKey][0]['fid'];
		return (isset($lib['families']['fid'][$family_id]))?$lib['families']['fid'][$family_id][0]:null;
	}
	
	public function getSpouse($indKey, $lib){
		if(!isset($lib['families']['gid'][$indKey])) return null;
		$fam = $lib['families']['gid'][$indKey][0];
		return ($fam['husb']==$indKey)?$fam['wife']:$fam['husb'];
	}
	
	public function getSibling($indKey, $lib){
		if(!isset($lib['childrens']['gid'][$indKey])) return null;
		$family_id = $lib['childrens']['gid'][$indKey][0]['fid'];
		return $this->getChildsByFamKey($family_id, $lib);
	}
	
	public function getChildsByIndKey($indKey, $lib){
		if(!isset($lib['families']['gid'][$indKey])) return null;
		$family_id = $lib['families']['gid'][$indKey][0]['id'];
		return (isset($lib['childrens']['fid'][$family_id]))?$lib['childrens']['fid'][$family_id]:null;
	}
	
	public function getChildsByFamKey($family_id, $lib){
		return (isset($lib['childrens']['fid'][$family_id]))?$lib['childrens']['fid'][$family_id]:null;
	}
	
	public function getDescendantsCount($indKey, $lib){
		$childs = $this->getChildsByIndKey($indKey, $lib);
		if($childs==null) return 0;
		$count = sizeof($childs);
		foreach($childs as $child){
			$count += $this->getDescendantsCount($child['gid'], $lib);
		}
		return $count;
	}
	
	public function getParentTree($indKey, $lib, $level){
		$parents = $this->getParents($indKey, $lib);
		if($parents==null) return false;
		$result = array();
		if($parents['husb']){
			$result['father'] = $this->getParentTree($parents['husb'], $lib, $level + 1);
		}
		if($parents['wife']){
			$result['mother'] = $this->getParentTree($parents['wife'], $lib, $level + 1);
		}
		$count = $this->getDescendantsCount($indKey, $lib);
		return array('key'=>$indKey,'descendants'=>$count, 'level'=>$level, 'parents'=>$result);		
	}
	
		
	protected function setParentFamLine($indKey, $type, &$line, $lib){
		$line[$indKey]['key']= $indKey;
		$line[$indKey]['type'][] = $type;
		
		$parents = $this->getParents($indKey, $lib);
		if($parents==null) return;
		$father = ($parents['husb']!=null)?$parents['husb']:false;
		$mother = ($parents['wife']!=null)?$parents['wife']:false;
		if($father){
			$this->setParentFamLine($father, $type, $line, $lib);
		}
		if($mother){
			$this->setParentFamLine($mother, $type, $line, $lib);
		}
	}
	
	protected function setChildFamLine($indKey, $type, &$line, $lib){
		$childs = $this->getChildsByIndKey($indKey, $lib);
		if($childs==null) return;
		foreach($childs as $child){
			$parents = $this->getParents($indKey, $lib);
			$father = ($parents['husb']!=null)?$parents['husb']:false;
			$mother = ($parents['wife']!=null)?$parents['wife']:false;
			$types = false;
			if(isset($line[$father])&&isset($line[$mother])){
				$f_types = $line[$father]['type'];
				$m_types = $line[$mother]['type'];
				$types = array_merge($f_types, $m_types);
			} else if(isset($line[$father])){
				$types = $line[$father]['type'];
			} else if(isset($line[$mother])){
				$types = $line[$mother]['type'];
			}
			if($types){
				$line[$child['gid']]['key']= $child['gid'];
				foreach($types as $key => $value){
					$line[$child['gid']]['type'][$key] = $value;
				}
				$this->setChildFamLine($child['gid'], $line[$child['gid']]['type'], $line, $lib);
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
		$lib = $this->getTreeLib($treeId);
		
		//parsse data
		$line = array();

		$owner_parents = $this->getParents($ownerId, $lib);
		$father = ($owner_parents['husb']!=null)?$owner_parents['husb']:false;
		$mother = ($owner_parents['wife']!=null)?$owner_parents['wife']:false;
		
		if($father){
			$this->setParentFamLine($father, 'f', $line, $lib);
		}
		if($mother){
			$this->setParentFamLine($mother, 'm', $line, $lib);
		}
		
		foreach($line as $indiv){
			$this->setChildFamLine($indiv['key'], $indiv['type'], $line, $lib);
		}
		
		//insert to db
		$result = array_chunk($line, 50, true);
		foreach($result as $res){
			$this->insertsToFamLine($treeId, $ownerId, $res);
		}
		return array('line'=>$line);
	}
	
	public function getFamLine($indivs, $lib){
		$objects = array();
		$types = array();
		foreach($indivs as $indiv){
			$parents = $this->getParents($indiv, $lib);
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
			$childs = $this->getChildsByIndKey($indiv, $lib);
			$childs = (array)$childs;
			foreach($childs as $child){
				if(isset($members[$child['gid']])){
					$types[] = $members[$child['gid']];
				}
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
		return $this->getFamLine($objects, $lib);
	}
	
	public function checkCashFamilyLine($treeId, $ownerId){
		//get not cashed users
		$relatives = $this->convert($this->gedcom->individuals->getRelatives($treeId), 'individuals_id');
		$members = $this->convert($this->gedcom->individuals->getMembersByFamLine($treeId, $ownerId), 'individuals_id');
		$diff = array_diff_assoc($relatives, $members);
		
		//get data
		$lib = $this->getTreeLib($treeId);
		
		$owner_parents = $this->getParents($ownerId, $lib);
		$father = ($owner_parents['husb']!=null)?$owner_parents['husb']:false;
		$mother = ($owner_parents['wife']!=null)?$owner_parents['wife']:false;
		
		$objects = array();
		foreach($diff as $user){
			$indKey = $user[0]['individuals_id'];
			if($indKey == $ownerId){
				$objects[$indKey] = array('key'=>$indKey,'type'=>array('f','m'));
			} else if($father&&$indKey==$father){
				$objects[$indKey] = array('key'=>$indKey,'type'=>array('f'));
			} else if($mother&&$indKey==$mother){
				$objects[$indKey] = array('key'=>$indKey,'type'=>array('m'));
			} else {
				$type = $this->getFamLine(array($indKey), $lib);
				if($type){
					$objects[$indKey] = array('key'=>$indKey,'type'=>$type);
				}
			}
		}
		
		//insert to db
		$result = array_chunk($objects, 25, true);
		foreach($result as $res){
			$this->insertsToFamLine($treeId, $ownerId, $res);
		}
		return array('objects'=>$objects);
	}
	
	protected function getUserTree_($ind_key, $lib, &$objects){
		if($ind_key==null) return;
		//getParents,getChildsByIndKey,getChildsByFamKey,getSpouse,getSibling
		$spouse = $this->getSpouse($ind_key, $lib);
		$parents = $this->getParents($ind_key, $lib);
		$sibling = $this->getSibling($ind_key, $lib);
		$childrens = $this->getChildsByIndKey($ind_key, $lib);
		
		if($spouse!=null&&!isset($objects[$spouse])){
			$objects[$spouse] = $spouse;
		}

		if($parents['husb']!=null&&!isset($objects[$parents['husb']])){
			$objects[$parents['husb']] = $parents['husb'];
			$this->getUserTree_($parents['husb'], $lib, $objects);
		}
		
		if($parents['wife']!=null&&!isset($objects[$parents['wife']])){
			$objects[$parents['wife']] = $parents['wife'];
			$this->getUserTree_($parents['wife'], $lib, $objects);
		}
		
		if(!empty($sibling)){
			foreach($sibling as $ind){
				if(!isset($objects[$ind['gid']])){
					$objects[$ind['gid']] = $ind['gid'];
					$this->getUserTree_($ind['gid'], $lib, $objects);
				}
			}
		}
		if(!empty($childrens)){
			foreach($childrens as $ind){
				if(!isset($objects[$ind['gid']])){
					$objects[$ind['gid']] = $ind['gid'];
					$this->getUserTree_($ind['gid'], $lib, $objects);
				}
			}
		}
	}
	
	public function getUserTree($owner_id, $tree_id){
		$lib = $this->getTreeLib($tree_id);
		$objects = array();
		$spouse = $this->getSpouse($owner_id, $lib);
		$this->getUserTree_($owner_id, $lib, $objects, $int);
		$this->getUserTree_($spouse, $lib, $objects, $int);
		return $objects;
	}
	
	public function getOwnerTree($owner_id, $tree_id){
		$relatives = $this->gedcom->individuals->getRelatives($tree_id);
		$objects = array();
		foreach($relatives as $ind){
			$objects[$ind['individuals_id']] = $ind['individuals_id'];
		}
		return $objects;
	}
	
	public function getTree($owner_id, $tree_id, $permission){
		switch($permisssion){
			case "USER":
			case "MEMBER":
				return $this->getUserTree($owner_id, $tree_id);
			break;
		
			case "OWNER":
				return $this->getOwnerTree($owner_id, $tree_id);
			break;
		}
	}
	
}

?>

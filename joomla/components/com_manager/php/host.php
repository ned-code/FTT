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
	
	public function getDescendants($indKey, &$descendants, &$ignore){
		if(array_key_exists($indKey, $descendants)) return false;
		foreach($ignore as $i){
			if($i!=null&&$i==$indKey){
				return false;
			}
		}
		$descendants[$indKey] = true;
		$parents = $this->gedcom->individuals->getParents($indKey);
		if($parents!=null){
			if($parents['motherID']!=null){
				$this->getDescendants($parents['motherID'], $descendants, $ignore);
			}
			if($parents['fatherID']!=null){
				$this->getDescendants($parents['fatherID'], $descendants, $ignore);
			}
		}
		
		$families = $this->gedcom->families->getPersonFamilies($indKey, true);
		if(sizeof($families)>0){
			foreach($families as $family){
				if($family->Spouse!=null&&$family->Spouse->Id!=null){
					$this->getDescendants($family->Spouse->Id, $descendants, $ignore);
				}
				$childs = $this->gedcom->families->getFamilyChildrenIds($family->Id);
				foreach($childs as $child){
					$this->getDescendants($child['gid'], $descendants, $ignore);
				}
			}
		}
		
	}

	public function getFamilyLineType($indKey){
		//session vars
		$treeId = $_SESSION['jmb']['tid'];
		$ownerId = $_SESSION['jmb']['gid'];
		$facebookId = $_SESSION['jmb']['fid'];
		
		if($indKey == $ownerId){
			return 'both';
		} 
		
		$owner_parents = $this->gedcom->individuals->getParents($ownerId);
		if($owner_parents==null){
			return 'both';
		}
		
		$mother = ($owner_parents['motherID']!=null)?$owner_parents['motherID']:null;
		$father = ($owner_parents['fatherID']!=null)?$owner_parents['fatherID']:null;
		
		if($indKey==$mother) return 'mother';
		if($indKey == $father) return 'father';
		
		if($mother!=null){
			$mother_desc = array();
			$ignore = array($father,$ownerId);
			$this->getDescendants($mother, &$mother_desc, $ignore);
			if(array_key_exists($indKey, $mother_desc)){
				return 'mother';
			}
		}
		
		if($father!=null){
			$father_desc = array();
			$ignore = array($mother,$ownerId);
			$this->getDescendants($father, &$father_desc, $ignore);
			if(array_key_exists($indKey, $father_desc)){
				return 'father';
			}
		}
		return 'both';
	}
	
	public function cashFamilyLine(){
		$ownerId = $_SESSION['jmb']['gid'];
		$treeId = $_SESSION['jmb']['tid'];
		$db =& JFactory::getDBO();		
		$sql = $this->gedcom->sql('SELECT `to` as individuals_id FROM #__mb_family_line WHERE tid =?', $treeId);
		$db->setQuery($sql);
		$cashed_relatives = $db->loadAssocList();
		$relatives = $this->gedcom->individuals->getRelatives($treeId);
		$to_cash = ($cashed_relatives==null)?$relatives:array_diff_assoc($relatives,$cashed_relatives);
		if(empty($to_cash)) return null;
		foreach($to_cash as $to){
			$type = $this->getFamilyLineType($to['individuals_id']);
			$sql = $this->gedcom->sql('INSERT INTO #__mb_family_line (`id`,`tid`,`from`,`to`,`type`) VALUES (NULL,?,?,?,?)',$treeId,$ownerId,$to['individuals_id'],$type[0]);
			$db->setQuery($sql);
			$db->query();
		}
	}
	
}

?>

<?php
require_once('gedcom/core.gedcom.php');
//class
class Host {
	/**
	*
	*/
	public $gedcom;

        public $modulesPath = "../modules/";
	/**
	*
	*/
	function __construct($type){		
            $this->modulesPath = JPATH_ROOT."/components/com_manager/modules/";
            $this->gedcom = new Gedcom($this);
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
            require_once $this->modulesPath.$modulename."/php/".$modulename.".php";
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
        	/*
            $path = $_SERVER['DOCUMENT_ROOT'] . $this->getRootDirectory();
            return $path;
            */
            return JPATH_BASE;
        }
        
        /**
        *
        */
        function getRootDirectory(){
            /*
        	$allPath = realpath($this->modulesPath."../../../");
           
            $allPath = explode("/", $allPath);
   
            if(count($allPath) == 1){
                $allPath = explode("\\", $allPath[0]);
            }

            return "/" .$allPath[count($allPath) -1 ];
            */
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
	public function getUserInfo($indKey){
		$indiv = $this->gedcom->individuals->get($indKey);
		$parents = $this->gedcom->individuals->getParents($indKey);
		$children = $this->gedcom->individuals->getChilds($indKey);
		$families = $this->gedcom->families->getPersonsFamilies($indKey, true);
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

		return array('indiv'=>$indiv,'parents'=>$parents,'families'=>$families,'spouses'=>$spouses,'children'=>$children,'notes'=>$notes,'sources'=>$sources,'photo'=>$photos,'avatar'=>$avatar);
	}
	
	/**
	* @return array all invdividuals links with first parent
	* @var $id gedcom user id
	* @var &$individs array link of array
	*/
	public function getIndividsArray($indKey, &$individs){
		if($indKey==NULL){ return false; }
		$individ = $this->getUserInfo($indKey);
		$individs[$indKey] = $individ;
		
		//Fill the array of families
		foreach($individ['families'] as $family){
			if($family->Spouse!=null&&!array_key_exists($family->Spouse->Id, $individs)){
				$this->getIndividsArray($family->Spouse->Id, $individs);
			}
		}

		//Fill the array of children
		foreach($individ['children'] as $child){
			if(!array_key_exists($child['gid'], $individs)){
				$this->getIndividsArray($child['gid'], $individs);
			}
		}		
		
		//Fill the array of parents
		if($individ['parents'] != null){
			if($individ['parents']['fatherID'] != null && !array_key_exists($individ['parents']['fatherID'], $individs)){
				$this->getIndividsArray($individ['parents']['fatherID'], $individs);
			}
			if($individ['parents']['motherID'] != null && !array_key_exists($individ['parents']['motherID'], $individs)){
				$this->getIndividsArray($individ['parents']['motherID'], $individs);
			}
		}
	}
        

}

?>

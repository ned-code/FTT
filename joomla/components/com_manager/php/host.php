<?php
require_once('class.ajax.php');
require_once('class.usertree.php');
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
            $this->gedcom = new Gedcom();
            $this->usertree = new JMBUserTree($this->gedcom);
            
            //$this->gramps = new Gramps($this);
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
            return JPATH_ROOT;
        }
        
        public function getAbsoluePath(){
        	$jpath_base_explode = explode('/', JPATH_ROOT);
        	if(end($jpath_base_explode) == 'administrator'){
        		array_pop($jpath_base_explode); 
        	}
        	return implode('/', $jpath_base_explode);
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
            $db = new JMBAjax();
            $db->setQuery('SELECT name,id FROM #__mb_modules WHERE (name = "?" OR id="?")', $nameOrId, $nameOrId);
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
            $db = new JMBAjax();
            $db->setQuery('SELECT name,id FROM #__mb_modules WHERE (name = "?" OR id="?")', $nameOrId, $nameOrId);
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
            $db = new JMBAjax();
            $db->setQuery('SELECT structure, value
                                FROM #__mb_settings
                                WHERE module_name = "?"
                         ', $name);
            $rows = $db->loadAssocList();
          
            $values = array();
            if($rows != null){
                $values = json_decode($rows[0]['value']);
            }
          
            $db->setQuery('SELECT "title" as name, #__mb_modules.title as value
                                FROM #__mb_modules
                                WHERE name = "?"', $name);
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
        	$db = new JMBAjax();
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
            $db = new JMBAjax();
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
	/*
	* LANGUAGE
	*/ 
	protected function getDefaultLanguage(){
		$db = new JMBAjax();
		$sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language WHERE def='1'";
		$db->setQuery($sql_string);
		$rows = $db->loadAssocList();
		if($rows==null) return false;
		return $rows[0];
	}
	
	protected function getLanguage($lang_code){
		$db = new JMBAjax();
		$sql_string = "SELECT lang_id, lang_code, title, published FROM #__mb_language WHERE lang_code=?";
		$db->setQuery($sql_string, $lang_code);
		$rows = $db->loadAssocList();
		if($rows==null) return false;
		return $rows[0];
	}
	
	public function getLangList($module_name){
		$language = (isset($_SESSION['jmb']['language']))?$this->getLanguage($_SESSION['jmb']['language']):$this->getDefaultLanguage();
		if(!$language) return false;
		
		$module_path = JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'modules'.DS.$module_name;
		if(is_dir($module_path)){
			$lang_pack_path = $module_path.DS.'language'.DS.$language['lang_code'].'.'.$module_name.'.ini';
			$ini_array = parse_ini_file($lang_pack_path);
			if($ini_array){
				return $ini_array;
			}
		}		
		return false;
	}
	
	/* 
	* CONFIG
	*/
	public function getConfig(){
		$db = new JMBAjax();
		$db->setQuery("SELECT uid, name, alias, value, type, priority FROM #__mb_system_settings");
		$rows = $db->loadAssocList();
		if($rows == null) return array();
		$colors = array();
		foreach($rows as $row){
			switch($row['type']){
				case 'colors':
					$colors[$row['alias']] = strtolower($row['value']);
				break;
			}
		}
		return array('colors'=>$colors);
	}
	
	
}

?>

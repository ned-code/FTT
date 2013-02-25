<?php

class JMBAjax {
    private $db;
    private $query;

    private $modulesPath;

    public function __construct(){
        $this->db =& JFactory::getDBO();
        $this->modulesPath = $this->getModulesPath();
    }

    private function getModulesPath(){
        return JPATH_ROOT."/components/com_manager/modules/";
    }

    public function getQuery(){
        return str_replace("#__", "qt4yn_", $this->query);
    }

    public function callMethod($modulename,$classname, $method, $arguments){
        $args = explode("|", $arguments);
        $modulePath = $this->modulesPath.$modulename."/php/".$modulename.".php";
        if(file_exists($modulePath)){
            require_once($modulePath);
            if($classname != null){
                $obj = new $classname;
                return call_user_func_array(array($obj, $method), $args);
            }else {
                return call_user_func_array($method, $args);
            }
        }
    }
	
	public function setQuery(){
        	$args = func_get_args();
        	$tmpl =& $args[0];
        	$tmpl = str_replace("%", "%%", $tmpl);
        	$tmpl = str_replace("?", "%s", $tmpl);
        	foreach ($args as $i=>$v) {
        		if (!$i) continue;
        		if (is_int($v)) continue;
        		if($v==null || $v == '' ){
        			$args[$i] = "NULL";
        		} else {
        			$args[$i] = "'".mysql_escape_string($v)."'";
        		}
        	}
        	for ($i=$c=count($args)-1; $i<$c+20; $i++){ 
        		$args[$i+1] = "UNKNOWN_PLACEHOLDER_$i";
        	}
        	$this->query = call_user_func_array("sprintf", $args);
     }

    public function query(){
        $this->db->setQuery($this->query);
        $this->db->query();
    }

    public function loadAssocList($sort=false, $common_prefix=''){
        $this->db->setQuery($this->query);
        $rows = $this->db->loadAssocList();
        if(!empty($rows)){
            $assoc_array = array();
            foreach($rows as $row){
                if(!$sort){
                    $assoc_array[] = $row;
                } else {
                    if(is_array($sort)){
                        foreach($sort as $k => $s){
                            $prefix = (!is_string($k))?$common_prefix:$k;
                            $assoc_array[$prefix.$row[$s]][] = $row;
                        }
                    } else {
                        if(!empty($row[$sort])){
                            $assoc_array[$row[$sort]][] = $row;
                        }
                    }
                }
            }
            return $assoc_array;
        }
        return $rows;
    }
        
    public function insertid(){
        return $this->db->insertid();
    }
}
?>

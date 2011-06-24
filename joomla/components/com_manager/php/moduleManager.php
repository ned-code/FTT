<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

require JPATH_ROOT.'/components/com_manager/php/module.php';

class moduleManager{
	public $modulesPath;
	protected $partOfPath = '/components/com_manager/modules/';
	protected $stylesPath = 'css/';
	protected $scriptPath = 'js/';
     
     /**
     *
     */
     function __construct(){
     	     $this->modulesPath = JPATH_ROOT.'/components/com_manager/modules/';
     }
     
     /**
     *
     */
     function unpackModule(){
         $module = new module($this, 0);
	 return $module->unpack();
     }
     
     /**
     *
     */
     function installModule($title,$description,$name,$javascript,$stylesheets, $tables,$rollback){
         $module = new module($this, 0);
         $module->setName($name);
         $module->setTitle($title);
         $module->setDescription($description);
         return $module->install($title, $description, $name, $javascript, $stylesheets, $tables, $rollback);
     }

     /*
      * generates JS code to include module source files
      * @params: <module>
      */
      function appendModule($module){ 
      	      $query = "SELECT * FROM #__mb_pathinfo WHERE module_id=".$module->getId(). " AND ( extension='css' OR extension='js' )";
      	      $db =& JFactory::getDBO();
      	      $db->setQuery($query);
      	      $rows = $db->loadAssocList();
      	      $res = "<?xml version='1.0' encoding='iso-8859-1' ?>";
      	      $res .= "<files>";
      	      for($i=0;$i<sizeof($rows);$i++){
      	      	      switch($rows[$i]['extension']){
      	      	      	case "js":
      	      	      		$res .=  "<js path='".JURI::root(true).$this->partOfPath.trim($rows[$i]['path'])."?111'></js>";  
      	      	      	break;
      	      	      	      
      	      	      	case "css":
      	      	      		$res .=  "<css path='".JURI::root(true).$this->partOfPath.trim($rows[$i]['path'])."?111'></css>"; 
      	      	      	break;
      	      	      }
      	      }
      	      $res .= "</files>";
      	      return $res;       
    }

    /*
     * gets module object by id
     * @param: <int> id
     */
    function getModule($id){
    	$args = explode(':', $id);
        $request = ($args[0] == 'content_manager')? "SELECT * FROM #__mb_modules WHERE name='open_content_manager'" : "SELECT * FROM #__mb_modules WHERE id=".$id;
        $db =& JFactory::getDBO();
        $db->setQuery($request);
        $row = $db->loadAssocList();
        
        $module = new module($this, $row[0]["is_system"]);
        $module->setId($row[0]["id"]);
        $module->setCategory($row[0]["category"]);
        $module->setDescription($row[0]['description']);
        $module->setName($row[0]['name']);
        $module->setTitle($row[0]['title']);
        return $module;
     }

     /*
      * gets all system modyles
      * @returns: xml string
      */
     function getSystemModules(){
         return $this->getModulesXml('1');
     }
     
      /*
      * gets all user modyles
      * @returns: xml string
      */
     function getUserModules(){
         return $this->getModulesXml('0');
     }
     
      /*
      * generates xml string of modules 
      * @param : <int> is system
      * @returns: xml string
      */
     function getModulesXml($system){
         $modules = $this->_getModules(" ORDER BY is_system asc");
         $xml_string = "<?xml version='1.0' encoding='iso-8859-1' ?>";
         $xml_string .= "<modules>";
         for($i=0; $i < count($modules); $i++){
             if($modules[$i]['is_system']==$system||$system=="all")
                $xml_string .= "<module title='" . $modules[$i]['title'] ."' id='". $modules[$i]['id'] . "' description='". $modules[$i]['description'] . "' is_system='".$modules[$i]['is_system']."'></module>";
         }
         $xml_string .= "</modules>";
         return $xml_string;
     }
     
     function getContentPages(){
     	   ob_clean();
     	   $db =& JFactory::getDBO();
     	   $db->setQuery('SELECT id, title, layout_type FROM #__mb_content');
     	   $rows = $db->loadAssocList(); 		
     	   return $rows;
     }
     
     
     /*
      * generates tree structure of system modules
      * @returns: xml string
      */
     function getModulesXmlTree(){
         $modules = $this->_getModules(null);
         $xml_string = "<?xml version='1.0' encoding='iso-8859-1' ?>";
         $xml_string .= "<tree id='0'>";
         for($i=0; $i < count($modules); $i++){
            if(($modules[$i]['category']==0)&&($modules[$i]['is_system']==1)){
                $xml_string .= "<item text='" . $modules[$i]['title'] ."' id='". $modules[$i]['id'] . "' open='1'>";
                foreach($modules as $module){
                    if(($module['category'] == $modules[$i]['id'])&&($module['category'] != 0)){
                    	    $xml_string .= "<item text='" . $module['title'] ."' id='". $module['id'] . "'>";
                    	    if($module['name'] == 'content_manager'){
                    	    	    $pages = $this->getContentPages();
                    	    	    foreach($pages as $page){
                    	    	    	$xml_string .= "<item text='" . $page['title'] ."' id='content_manager:". $page['id'] . "'>";
                    	    	    	$xml_string .= "</item>";	    
                    	    	    }
                    	    }
                    	   $xml_string .= "</item>";
                    }
                }         
                $xml_string .= "</item>";
            }
        }
        $xml_string .= "</tree>";
        return $xml_string;
     }
     
     /*
      * get all modules from DB table
      * @returns: <array>
      */
      private function _getModules($param){
     	     $sql = "SELECT * FROM #__mb_modules".(isset($param) ? $param : "");
     	     $db =& JFactory::getDBO();
     	     $db->setQuery($sql);
     	     $s_array = $db->loadAssocList();
     	     $res = array();
     	     for($i=0;$i<sizeof($s_array);$i++){
     	     	     $res[$i]['id'] = $s_array[$i]['id'];
     	     	     $res[$i]['name'] = $s_array[$i]['name'];
     	     	     $res[$i]['title'] = htmlspecialchars($s_array[$i]['title']);
     	     	     $res[$i]['description'] = htmlspecialchars($s_array[$i]['discription']);
     	     	     $res[$i]['category'] = $s_array[$i]['category'];
     	     	     $res[$i]['is_system'] = $s_array[$i]['is_system'];
     	     }
     	     return $res;
     }

    /**
    *
    */
    function uninstallModules($ids){
        $modules = explode(",",$ids);
        foreach($modules as $id){
            $module = $this->getModule($id);
            echo $module->uninstall();
        }       
    }
    
    /**
    *
    */
    function getAbsoluteModulesPath(){
        $allPath = explode("/", __FILE__);
        if(count($allPath) == 1){
            $allPath = explode("\\", __FILE__);
        }
        $path = "/com_manager/modules/";
        $i = count($allPath)-4;
        while($i >= count($allPath)-5){
            $path = "/" .$allPath[$i]. $path;
            $i--;
        }
        return $path;
    }
    
    /**
    *
    */
    function  __destruct() {
    }

 }
?>

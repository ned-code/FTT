<?php
require_once('class.ajax.php');
require_once('class.usertree.php');
require_once('class.image.php');
require_once('class.language.php');
require_once('class.config.php');
require_once('class.user.php');
require_once('gedcom/core.gedcom.php');
require_once('gramps/core.gramps.php');

//class
class FamilyTreeTopHostLibrary {
    private static $instance = null;
    private $config;

    private $modulesPath;
    private $baseurl;

    public $ajax;

    public $gedcom;
    public $gramps;
    public $usertree;
    public $familyLine;

    public $images;

    public $language;

    public $jfbConnect;
    public $jSession;

    public $user;

    public $mobile = false;

    private function __construct( $directCall = true ) {
        if ( $directCall ) {
            return false;
        }
        $this->modulesPath = $this->getModulesPath();
        $this->baseurl = JURI::base();


        $this->ajax = new JMBAjax();

        $this->gedcom = new Gedcom($this->ajax);
        $this->gramps = new Gramps($this->ajax, $this->gedcom);
        $this->usertree = new JMBUserTree($this->ajax, $this->gedcom);

        $this->images = new JMBImage($this->gedcom);

        $this->language = new JMBHostLanguage($this->ajax);
        $this->config = new JMBHostConfig($this->ajax);

        $this->jSession =& JFactory::getSession();
        $this->jfbConnect = JFBConnectFacebookLibrary::getInstance();

        $this->user = new FTTUserLibrary($this);

        $useragent=$_SERVER['HTTP_USER_AGENT'];
        if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))){
            $this->mobile = true;
        }

    }

    public function &getInstance() {
        if (null === self::$instance)
        {
            self::$instance = new self( false );
        }

        return self::$instance;
    }

    private function getModulesPath(){
            return JPATH_ROOT."/components/com_manager/modules/";
    }

    public function callMethod($modulename,$classname, $method, $arguments){
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

    /*
    * ------------------------------------------------------------------------------------------
    */
    /*
    public function getSettingsStructure($module){
        $properties = $this->getJsonProperties($module);
        return $properties[0]['structure'];
    }
    public function getSettingsValues($module){
        $properties = $this->getJsonProperties($module);
        return $properties[0]['value'];
    }
    public function setSettingsValues($module, $values){
        $this->saveJsonProperties($module, $values);
    }
    public function callMethod($modulename,$classname, $method, $arguments){
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
    public function getAbsoluteRootPath(){
            return JPATH_ROOT;
    }
    public function getAbsoluePath(){
        $jpath_base_explode = explode('/', JPATH_ROOT);
        if(end($jpath_base_explode) == 'administrator'){
            array_pop($jpath_base_explode);
        }
        return implode('/', $jpath_base_explode);
    }
    public function getRootDirectory(){
        return JURI::base(true);
    }
    public function getModuleName($nameOrId){
        $db = new JMBAjax();
        $db->setQuery('SELECT name,id FROM #__mb_modules WHERE (name = "?" OR id="?")', $nameOrId, $nameOrId);
        $rows = $db->loadAssocList();
        if(isset($rows[0]['name']))
            return ($rows[0]['name']);
        else
            return null;
     }
    public function getModuleId($nameOrId){
        $db = new JMBAjax();
        $db->setQuery('SELECT name,id FROM #__mb_modules WHERE (name = "?" OR id="?")', $nameOrId, $nameOrId);
        $rows = $db->loadAssocList();
        if(isset($rows[0]['id']))
            return ($rows[0]['id']);
        else
            return null;
     }
    public function encodeProperties($array){
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
    public function getJsonProperties($modulename){
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

            $titl = new Object();
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
    public function getSiteSettings($tab){
            if($tab == 'color'){
        	$sql = "SELECT name, value FROM #__mb_system_settings WHERE type='color'";
        	$db = new JMBAjax();
        	$db->setQuery($sql);
		$s_array = $db->loadAssocList();
                
		return $s_array;
            }
    }
    public function sendSiteSettings($tab){
            $resp = $this->getSiteSettings($tab);
            if($resp != null)
                $resp = json_encode($resp);
            echo $resp;

    }
    public function saveJsonProperties($modulename, $properties_json){
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
    */
    /*
    * ------------------------------------------------------------------------------------------
    */



	public function getLangList($module_name){
		return $this->language->getLangList($module_name);
	}
	
	public function getLanguages(){
		return $this->language->getLanguages();
	}

    public function getComponentString(){
        return $this->language->getComponentString();
    }


	public function getConfig(){
        return $this->config->getConfig();
	}

    public function getViews($moduleName){
        $path = JPATH_ROOT.DS.'components'.DS.'com_manager'.DS.'modules'.DS.$moduleName.DS.'views'.DS;
        $order = array("\r\n", "\n", "\r");
        $replace = "";
        $views = array();
        if (is_dir($path)) {
            if ($dh = opendir($path)) {
                while (($file = readdir($dh)) !== false) {
                    $filePath = $path.$file;
                    if(is_file($filePath)){
                        $fileName = explode('.', $file);
                        $fileContent = file_get_contents($filePath);
                        $views[$fileName[0]] = preg_replace('| +|', ' ', str_replace($order, $replace, $fileContent));

                    }
                }
                closedir($dh);
            }
        }
        return $views;
    }

    public function deleteJoomlaUser($facebook_id){
        $sql_string = "SELECT * FROM #__jfbconnect_user_map as map WHERE fb_user_id = ?";
        $this->ajax->setQuery($sql_string, $facebook_id);
        $rows = $this->ajax->loadAssocList();

        if(empty($rows)) return false;

        $this->ajax->setQuery('DELETE FROM #__jfbconnect_user_map WHERE fb_user_id = ?', $facebook_id);
        $this->ajax->query();

        $this->ajax->setQuery('DELETE FROM #__users WHERE id = ?', $rows[0]['j_user_id']);
        $this->ajax->query();

        $this->ajax->setQuery('DELETE FROM #__user_usergroup_map WHERE user_id = ?', $rows[0]['j_user_id']);
        $this->ajax->query();

        $this->ajax->setQuery('DELETE FROM #__session WHERE userid = ?', $rows[0]['j_user_id']);
        $this->ajax->query();
        return true;
    }

    public function getCurrentAlias(){
        $menu   = &JSite::getMenu();
        $active   = $menu->getActive();
        return (is_object($active))?$active->alias:false;
    }

    public function getIndividualsInSystem($facebook_id){
        if(empty($facebook_id)) return false;
        $sqlString = "SELECT link.individuals_id as gedcom_id, link.tree_id as tree_id, link.type as permission
                    FROM #__mb_tree_links as link
                    LEFT JOIN #__mb_individuals as ind ON ind.id = link.individuals_id
                    WHERE ind.fid=?";
        $this->ajax->setQuery($sqlString, $facebook_id);
        $data = $this->ajax->loadAssocList();
        return (empty($data))?false:$data[0];
    }
}
?>

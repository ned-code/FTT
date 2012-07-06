<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

require JPATH_ROOT.'/components/com_manager/php/lib/Unpacker.php';
require JPATH_ROOT.'/components/com_manager/php/module_base.php';

class module extends module_base {
        /*unpacking uploaded module
         *@returns: XML Sting
         */
        public function unpack(){
          if(!is_dir("tmp/"))
            mkdir("tmp/");
            copy($_FILES["browse"]["tmp_name"],"tmp/".$_FILES["browse"]["name"]);
            header('Content-type: text/html;');
            $json_string = "";
            $json_string .= "{";
            if(!is_dir($this->core->modulesPath)){
                mkdir($this->core->modulesPath);
            }
            if(!is_dir($this->core->modulesPath."tmp")){
                mkdir($this->core->modulesPath."tmp");
            }

            $unpacker = new Unpacker();
            $list = $unpacker->unpack("tmp/".$_FILES["browse"]["name"], $this->core->modulesPath."tmp/");
            unlink("tmp/".$_FILES["browse"]["name"]);
            //if error during unpacking
            if(!$list){
                $this->deleteFiles($this->core->modulesPath."tmp/",$log);         
                $json_string .= '"error":"Couldn`t unpack file"';

            }else{
                //writing log
                $i=count($list) - 1;
                    for($i; $i >= 0; $i--){
                        $list[$i] .= "\n";
                    }
                $log_file = fopen($this->core->modulesPath."tmp/log.ini", "w+");                
                fwrite($log_file, implode($list));
                fclose($log_file);
             
                $json_string .=  $this->getConfig();
            }
            
            
            if(substr($json_string, strlen($json_string)-1) == ',')
                    $json_string = substr($json_string, 0, strlen($json_string)-1);
            $json_string .= "}";
            return $json_string;
        }
        
        function getConfig(){	
            if(is_file($this->core->modulesPath."tmp/config.xml")){
                $xmlStr = file_get_contents($this->core->modulesPath."tmp/config.xml");
		$xmlObj = simplexml_load_string($xmlStr);
                if(is_object($xmlObj)){
                    if(isset($xmlObj->title)&&isset($xmlObj->description)&&isset($xmlObj->name)){
                       $this->name = $xmlObj->name;
                       return $this->install($xmlObj->title, $xmlObj->description, $xmlObj->name, (isset($xmlObj->files)&&isset($xmlObj->files->javascript)? $xmlObj->files->javascript : ''), (isset($xmlObj->files)&&isset($xmlObj->files->css)? $xmlObj->files->css : ''), $xmlObj->DBTables, false, (isset($xmlObj->files)&&isset($xmlObj->files->languages)? $xmlObj->files->languages : ''));
                    }
                }
                else{
                    return '"error":"invalid xml config"'; //invalid xml config
                }
            }
            else{
            return '"error":"config file not exist"';}//file not exist
        }
        /*
         * Installing module, registering it in db, if rollback if true deletes files and aborts installation
         * @params:  <string>,...
         * @returns: XML Sting
         */
        function install($title,$description,$name,$javascript,$stylesheets, $tables, $rollback, $languages = ''){
            $json_string = '';

            if(is_dir($this->core->modulesPath."tmp/")&&($rollback==false )&&(!is_dir($this->core->modulesPath.$name))){
                $success = rename($this->core->modulesPath."tmp/", $this->core->modulesPath.$name."/");
                
                $query = "INSERT INTO #__mb_modules (`name`, `category`, `description`, `title`, `is_system`, `id`) VALUES ('".mysql_real_escape_string($name)."',0,'".mysql_real_escape_string($description)
                    ."', '".mysql_real_escape_string($title)."', 0, '')";
                $db =& JFactory::getDBO();
                $db->setQuery($query);
      	        $db->query();
                
                $id = $db->insertid();
                
                $this->id=$id;
             
                $json_string .= '"js":[';
                $json_string .= $this->registerInSystem($javascript, "js");
                $json_string .= '],';
                $json_string .= '"css":[';
                $json_string .= $this->registerInSystem($stylesheets, "css");
                $json_string .= '],';
                $this->installLanguages($languages);
                if(!$this->createModuleTables($tables)){
                    $json_string .= '"db":"database tables has not been created"';
                }

                if($success){
                    $json_string .= '"result":"Module has been installed"';
                    if(substr($json_string, strlen($json_string)-1) == ',')
                            $json_string = substr($json_string, 0, strlen($json_string)-1);
                   return $json_string;//.= "}";
                }

            }else{
                      if(is_dir($this->core->modulesPath."tmp")){                    
                      $this->deleteFiles($this->core->modulesPath."tmp");                                         
                 }
                 if((isset($name))&&is_dir($this->core->modulesPath.$name)){
                      $json_string .= '"error":"module with same name has already been installed",';
                 }
                 $json_string .= '"result":"Module hasn`t been installed"';
            }
            if(substr($json_string, strlen($json_string)-1) == ',')
                 $json_string = substr($json_string, 0, strlen($json_string)-1);
            return $json_string;// .= "}";
        }
        /*
         * Insert into jos_mb_pathinfo paths or dbTables names
         * @params: <string> files, <string> extension
         * @returns: string
         */
        function registerInSystem($filesString, $ext){
                $pth =  $this->core->getAbsoluteModulesPath();

                $request = "INSERT INTO #__mb_pathinfo VALUES ";
                $count = count($filesString->file);

                $resp = "";
                for($i=0; $i < $count; $i++){

                    if(file_exists($this->core->modulesPath.mysql_real_escape_string($this->name). "/" . $filesString->file[$i])){
                        //$request .= " (".$this->id.",'".$pth.mysql_real_escape_string($this->name)."/".$filesString->file[$i]."','".$ext."', 0),";
                        $request .= " (".$this->id.",'".mysql_real_escape_string($this->name)."/".$filesString->file[$i]."','".$ext."', 0),";
                    }
                    else{                       
                        $resp .= '"'.mysql_real_escape_string($filesString->file[$i]).'",';
                    }
                }
               
                if(substr($resp, strlen($resp)-1) == ',')
                    $resp = substr($resp, 0, strlen($resp)-1);
                
                $db =& JFactory::getDBO();
                $db->setQuery(substr($request, 0, strlen($request)-1));
      	        $db->query();
                
                return $resp;
        }
        /*
         * copying language files into component`s languages directory
         * language name are symbols before first dot in the file name(e.g. "some_dir/en-GB.some_module.xml" - language name is en-GB, "en-GB.xml" - language name is en-GB, "en-GB" - language name is undefined,)
         * is there in com_manager/language is no already created directory for selected language(which means that language is not defined in JMB system) language file wouldn be installed
         * language file name will be generated like <language name>.mod_<module name>.xml, source file name is not significant, the only requirement - file name should start with
         * language name endind by dot
         */
        function installLanguages($lang){
            if($lang != ''){
            	    foreach($lang->file as $file){
            	    	 $paths = explode('/', $file);
            	    	 $parts = explode('.', $paths[1]);
            	    	 $sFile = file_get_contents($this->core->modulesPath.$this->name.'/'.$file);
	 	 	 $fileHandle = @fopen(JPATH_ROOT.'/language/'.$parts[0].'/'.$paths[1], 'r');
	 	 	 $nFile = '';
	 	 	 while(!feof($fileHandle)){
	 	 	 	 $line = fgets($fileHandle);
	 	 	 	 if(trim($line) != ''){
	 	 	 	 	 $nFile .= $line;
	 	 	 	 }
	 	 	 }
	 	 	 fclose($fileHandle);
	 	 	 file_put_contents(JPATH_ROOT.'/language/'.$parts[0].'/'.$paths[1], $nFile.$sFile);
            	    } 
            }
        }
        /*
         * creates db tables defined in module, if errot occured rollbacs changes
         * @params: <string> tables config
         * @returns: <bool> success
         */
        function createModuleTables($tablesString){
            if($tablesString != ""){
                $succesfull = true;
                $tableArray = explode("[TABLE]", $tablesString);
                
                for($j=1; $j<(count($tableArray)); $j++){

                    $params = explode("[PARAM]", $tableArray[$j]);
                    $request = "CREATE TABLE IF NOT EXISTS `".$params[1]."` ( ";
                    for($i=2; $i<(count($params) - 2 ); $i++){
                        $request .= $params[$i] . ", ";
                    }
                        $request .= $params[count($params) - 2] . " )";

                    if(mysql_query($request)){
                        $insertedTables[] = "`".$params[1]."`";
                    }else{
                        $request = "DROP TABLE ";
                        for($k=0; $k<count($insertedTables); $k++)
                            $request .= $insertedTables[$k].",";
                        $request = substr($request,0, strlen($request)-1);
                        mysql_query($request);
                        $succesfull = false;
                        break;
                    }
                }
                if($succesfull){
                    $request = "INSERT INTO #__mb_pathinfo VALUES ";
                    $count = count($insertedTables);
                    $resp = "";
                    for($i=0; $i < $count; $i++){
                        $request .= " (".$this->id.",'".$insertedTables[$i]."','dbTable', 0),";
                    }
                    
                    $db =& JFactory::getDBO();
                    $db->setQuery(substr($request, 0, strlen($request)-1));
                    $db->query();
                    return true;
                }
                return false;
                
            }
            return true;
        }
        /*
         * deletes db tables defined in module
         */
        function deleteModuleTables(){
            $query = "SELECT * FROM #__mb_pathinfo WHERE module_id=".$this->id. " AND extension='dbTable'";
            $db =& JFactory::getDBO();
            $db->setQuery($query);
            if($resp = $db->query()){
                $request = "DROP TABLE ";
                $rows = $db->loadAssocList();
                for($i=0;$i<sizeof($rows);$i++){
                	$request .= $rows[$i]['path'].",";
                }
                $request = substr($request,0, strlen($request)-1);
                $db->setQuery($query);
                $db->query();
            }
        }
        /*
         * deletes module directory, if log file is not found does nothing
         * @params: <string> path
         * @returns: <int> (0-1)
         */
        function deleteFiles($path){
            if(file_exists($path."/log.ini")){
                $file = file_get_contents(($path."/log.ini"));
                $log = explode("\n", $file);
            }else return 0;
               // var_dump(explode("\n", $file));
            $i=count($log) - 2;
            for($i; $i >= 0; $i--){
               if(is_dir($path."/".$log[$i])){
                   rmdir($path."/".$log[$i]);
               }
               else{
                   unlink($path."/".$log[$i]);
               }
            }
            if(file_exists($path."/log.ini"))
                unlink($path."/log.ini");
            rmdir($path);
            return 1;
        }
        
        /**
        *
        */
        function deleteLanguage($path){
        	$lang_path = JPATH_ROOT.'/language/';
        	if(is_dir($lang_path)){
        		if ($dh = opendir($lang_path)) {
        			while(($f = readdir($dh)) !== false) {
        				if(is_dir($lang_path.$f) && $f != '.' && $f != '..'){
        					if($h = opendir($lang_path.$f)){
        						while(($file = readdir($h)) !== false){
        							if($file != '.' && $file != '..'){
        								if($file == $f.'.com_manager.ini'){
        									$fileHandle = @fopen($lang_path.$f.'/'.$f.'.com_manager.ini', 'r');
        									$pattern = strtoupper("/COM_MANAGER_MOD_".$path."/");
        									$result = '';
        									while(!feof($fileHandle)){
        										$line = fgets($fileHandle);
        										if(!preg_match($pattern, $line)){
        											if(trim($line) != "[".$path."]"){
        												$result .= $line;
        											}
        										}
        									}
        									fclose($fileHandle);
        									unlink($lang_path.$f.'/'.$f.'.com_manager.ini');
        									file_put_contents($lang_path.$f.'/'.$f.'.com_manager.ini', $result);
        								}
        							}
        						}
        					}
        				}
        			}
        			closedir($dh);
        		}
        	}
        }

        /*
         * uninstalling module, deletes module files, deletes module records from db
         *
         */
        function uninstall(){
        	$db =& JFactory::getDBO();
        	$request = "SELECT * FROM #__mb_modules where id=".$this->id;
        	$db->setQuery($request);
            	$query = $db->query();
            	if($query) {
            		$rows = $db->loadAssocList();
            	}

            	$request = "DELETE FROM #__mb_modules where id=".$this->id;
            	$db->setQuery($request);
            	$db->query();
            
            	$this->deleteModuleTables();
            	$request = "DELETE FROM #__mb_pathinfo where module_id=".$this->id;
            	$db->setQuery($request);
            	$db->query();


            	$this->deleteFiles($this->core->modulesPath.$rows[0]['name']);
            	$this->deleteLanguage($rows[0]['name']);
            	
            	$request = "SELECT * FROM #__mb_modulesgrid WHERE json LIKE '%".$rows[0]['title']."%'";
            	$db->setQuery($request);   	
            	$rows = $db->loadAssocList();
            	for($x=0;$x<sizeof($rows);$x++){
            		$modulesgrid = json_decode($rows[$x]['json']);
            		$changed = false;
            		foreach($modulesgrid as $key=>$column){
            			if(is_object($column)){
            				$count = $column->divLength;
            				for($i=0; $i<$column->divLength; $i++){
            					$Prew = (string)$i;                       
            					$Follow = (string)($i+1);
            					if($column->$Prew->id == $this->id){
            						while(isset($column->$Follow)){
								$column->$Prew = $column->$Follow;
								$Prew = (string)(++$i);
								$Follow = (string)(++$i);
							}
							unset($column->$Prew);
							$count--;
							$changed = true;
            					}
            				}
            				$column->divLength=$count;
            			}
            		}
            		$newJson = json_encode($modulesgrid);
            		if($changed){
            			$request = "UPDATE #__mb_modulesgrid SET json='".mysql_real_escape_string($newJson). "' WHERE page_id=".$rows[$x]['page_id'];
            			$db->setQuery($request);
            			$db->query();
            		}
            	}            	
        }

        /**
        *
        */
        function __construct($core, $issystem){
            parent::__construct($core, $issystem);   
        }
        
        /*
        * load render file from module
        * @params: mode
        * @returns: html string
        */
        function render($mode){
           $path = $this->core->modulesPath.'/'.$this->name."/index.php";
           $str = "";
           if(file_exists($path)){
               include ($path);
                if($this->issystem){
                    return render();
                }else {
                     return $str . render();
                }
           }
           else
               return "invalid module";
        }
        
        /*
         * initialize module after render
         * @params: mode
         * @returns: js code
         */
        function initialize($mode){
            $path = $this->core->modulesPath.'/'.$this->name."/initialize.js";
            if(file_exists($path)){
                return file_get_contents($path);
            }
            return "";
        }

}
?>
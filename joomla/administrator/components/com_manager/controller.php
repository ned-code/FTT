<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

require JPATH_ROOT.'/components/com_manager/php/pageManager.php';
require JPATH_ROOT.'/components/com_manager/php/moduleManager.php';
require JPATH_ROOT.'/components/com_manager/php/host.php';

jimport('joomla.application.component.controller' );
class ManagerController extends JController
{
	/**
	*
	*/
        function callMethod(){                    	
            ob_clean();
            require_once "../components/com_manager/php/host.php";
            $host = new Host('joomla');
            echo $host->callMethod(JRequest::getVar('module'),JRequest::getVar('class'),JRequest::getVar('method'),JRequest::getVar('args'));
            die;
        }
        
        /**
        *
        */
        function callHostMethod(){
            ob_clean();
             require_once "../components/com_manager/php/host.php";
            $host = new Host('joomla');
            if((JRequest::getVar('module')!=null)){
                $params = array(JRequest::getVar('module'),JRequest::getVar('args'));
            }else
                $params = array(JRequest::getVar('args'));
            echo call_user_func_array(array($host, JRequest::getVar('method')), $params);
            die;
        }
        
        /**
        *
        */
        public function getModule(){	
        	ob_clean();
        	header('Content-Type: text/html');
        	$id = JRequest::getVar('id');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager();
        	if($task == 'module'){
        		$module = $manager->getModule($id);
        		echo $module->render(true);
        	}
        	die;
        }
        
        /**
        *
        */
        public function moduleScript(){
        	ob_clean();
        	header('Content-type: text/javascript');
        	$id = JRequest::getVar('id');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager();
        	if($task=='append'){
        		$module = $manager->getModule($id);
        		echo $manager->appendModule($module);
        	}
        	if($task=='init'){
        		$module = $manager->getModule($id);
        		echo $module->initialize(true);
        	}
        	die;
        }
        
        /**
        *
        */
        public function getModules(){
        	ob_clean();
        	header('Content-Type: text/xml');
        	$task = JRequest::getVar('f');
        	$manager = new moduleManager();
        	if(isset($task)){
        		if($task=='modules'){
        			echo $manager->getUserModules();
        		}else if($task=='system'){
        			echo $manager->getSystemModules();
        		}else if($task=='uninstall'){
        			$manager->uninstallModules(JRequest::getVar('ids'));
        		}else if($task=='all'){
        			echo $manager->getModulesXml("all");
        		}
        	}else if(isset($_POST)){
        		if(isset($_FILES['browse'])){
        			echo $manager->unpackModule();
        		}else if(isset($_POST["rollback"])){
        			echo $manager->installModule($_POST['title'],$_POST['description'],$_POST['name'],$_POST['javascript'],$_POST['stylesheets'],$_POST['tables'],$_POST['rollback']);
        		}else if(isset($_POST["method"])){
        			$manager->callMethod($_POST["module"],$_POST["method"],$_POST["arguments"]);
        		}
        	}	
        	die;
        }
        
        /**
        *
        */
        public function getXML(){
        	ob_clean();
        	header('Content-Type: text/xml');
        	$task = JRequest::getVar('f');     	
        	$manager = new moduleManager();
        	if($task =='tree')
        		echo $manager->getModulesXmlTree();
        	else if($task =='module'){
        		$module = $manager->getModule(JRequest::getVar('id'));
        		$manager->appendModule($module);
        		return $module->render();
        	}else if($task =='custom'){
        		echo $manager->getUserModules();
        	}else if($task =='system'){
        		echo $manager->getSystemModules();
        	}else if($task =='pages'){
        		$page = new pageManager();
        		echo $page->getPagesSet(JRequest::getVar('pages'));
        	}else if($task =='append'){
        		$module = $manager->getModule(JRequest::getVar('id'));
        		echo $manager->appendModule($module);
        	}
        	die;
        }
        
	/**
	* Method to display the view
	*
	* @access    public
	*/
	function display(){
		parent::display();
	}

	/**
	* Create a new article in the system joomla.
	* @param string $page_name
	*/
	function createPage(){
            $page_name = JRequest::getVar('page_name');
            $db =& JFactory::getDBO();
            $sql = "INSERT INTO `#__mb_content` (`id` ,`title` ,`layout_type`) VALUES ( NULL , '".$page_name."', 'double')";
            $db->setQuery($sql);
            $db->query();
            $id = mysql_insert_id();
            echo $id;
            die;
	}
	/**
	* Get a list of pages created by content manager.
	* @return rows (due to the fact that joomla adds the characters at the beginning of the transfer) with the values of id, title, layout_type.
	*/
	function getContentPages(){
           
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT id, title, layout_type FROM #__mb_content');
            $rows = $db->loadAssocList();
            
            ob_clean();

            header("Content-type: text/xml");
            echo '<?xml version="1.0" encoding="utf-8" ?>';
            echo '<rows>';
                    for($i=0;$i<sizeof($rows);$i++){
                            echo '<row>';
                                    $title = $rows[$i]['title'];
                                    if($title == 'null'){
                                            $title = 'No title';
                                    }

                                    echo '<id>'.$rows[$i]['id'].'</id>';
                                    echo '<title>'.$rows[$i]['title'].'</title>';
                                    echo '<layoutType>'.$rows[$i]['layout_type'].'</layoutType>';
                            echo '</row>';
                    }
            echo '</rows>';
            die;
	}
	
	/**
	* Changes the type of layout.
	* @param int $id
	* @param string $type (layout_type in db)
	*/
	/**
	* Changes the type of layout.
	* @param int $id
	* @param string $type (layout_type in db)
	*/
	function changeLayoutType(){
            $id = JRequest::getVar('id');
            $type = JRequest::getVar('layout_type');
            $db =& JFactory::getDBO();
            $sql = "UPDATE #__mb_content SET layout_type = '".$type."' WHERE id='".$id."'";
            $db->setQuery($sql);
            $db->query();

            $db->setQuery("SELECT * FROM #__mb_modulesgrid WHERE page_id=".$id);

            $rows = $db->loadAssocList();

            $modulesgrid = json_decode($rows[0]['json']);echo"!!!";

            $col_count;
            switch (JRequest::getVar('layout_type')){
                case "single":{
                    $col_count = 1;
                    break;
                }
                case "double":{
                    $col_count = 2;
                    break;
                }
                case "triple":{
                    $col_count = 3;
                    break;
                }
            }
            $count = $col_count;

            if($modulesgrid->tdLength > $col_count){

                while($modulesgrid->tdLength > $col_count){
                    $index = (string)($modulesgrid->tdLength-1);
                    unset($modulesgrid->$index);
                    $modulesgrid->tdLength--;

                }
            }elseif($modulesgrid->tdLength < $col_count){
                while($modulesgrid->tdLength < $col_count){

                    $index = (string)($modulesgrid->tdLength);
                    $modulesgrid->$index->divLength = 0;
                    $modulesgrid->tdLength++;
                }
            }
            $newJson = json_encode($modulesgrid);
            echo $newJson;
            $sql = "UPDATE #__mb_modulesgrid SET json='".mysql_real_escape_string($newJson). "' WHERE page_id=".$id;
            $db->setQuery($sql);
            $db->query();


            die;
	}
	
	
	/**
	* Changes title in _content table
	* @param int $id
	* @param string $page_name
	*/
	function changePageName(){
            $id	=	JRequest::getVar('id');
            $page_name	= JRequest::getVar('page_name');
            $db =& JFactory::getDBO();
            $sql = "UPDATE #__mb_content SET title = '".$page_name."' WHERE id='".$id."'";
            $db->setQuery($sql);
            $db->query();
            die;
	}
	
	/**
	* delete rows in _content and _mb_content table
	* @param int $id
	*/
	function deleteRow(){
            $id = JRequest::getVar('id');
            $db =& JFactory::getDBO();
            $sql = 'DELETE FROM `#__mb_content` WHERE `id` ='.$id;
            $db->setQuery($sql);
            $db->query();

            $sql = 'DELETE FROM `#__mb_modulesgrid` WHERE `page_id` ='.$id;
            $db->setQuery($sql);
            $db->query();
            die;
	}
	
	/**
	*
	*/
	function savePage(){
            $page_id = JRequest::getVar('page_id');
            $json = JRequest::getVar('json');
            $db =& JFactory::getDBO();
            $sql = "SELECT uid FROM #__mb_modulesgrid WHERE page_id ='".$page_id."'";
            $db->setQuery($sql);
            $result = $db->loadResult();
            if($result){
                    $sql = "UPDATE `#__mb_modulesgrid` SET `json` = '".$json."' WHERE page_id ='".$page_id."'";
                    $db->setQuery($sql);
                    $db->query();
            }
            else{
                    $sql = "INSERT INTO `#__mb_modulesgrid` (`uid` ,`page_id`,`json`)VALUES (NULL , '".$page_id."', '".$json."');";
                    $db->setQuery($sql);
                    $db->query();
            }
            die;
	}
	
	/**
	*
	*/
	function loadPage(){
            $page_id = JRequest::getVar('page_id');
            $db =& JFactory::getDBO();
            $sql = "SELECT uid, page_id, json FROM #__mb_modulesgrid WHERE page_id='".$page_id."'";
            $db->setQuery($sql);
            $rows = $db->loadAssocList();
            echo $rows[0]['json'];
            die;
	}
	
	/**
	*
	*/
	function gedcom(){
            $db =& JFactory::getDBO();
            switch(JRequest::getVar('f')){
                    case 'getUserInfo':
                            $sql = "SELECT * FROM #__mb_indiv WHERE indkey ='".JRequest::getVar('id')."'";
                            $db->setQuery($sql);
                            $rows = $db->loadAssocList();
                            echo $rows[0]['indkey'].'-'.$rows[0]['surname'].'-'.urldecode($rows[0]['givenname']).'-'.$rows[0]['sex'];
                    break;

                    case 'parser':
                            require_once('modules/descendant_tree/php/class.databaseproxy.php');
                            require_once('modules/descendant_tree/php/class.gedcom.php');
                            $ged = new GedcomParser;
                            $ged->Open($_FILES['gedcom']['tmp_name']);
                            $ged->ParseGedcom();
                    break;
            }

            die;
	}

	function host(){
            ob_clean();
            $host = new Host('joomla');
            switch(JRequest::getVar('f')){
                    case 'createPage':
                            $page_name	=	JRequest::getVar('pageName');
                            echo $host->contentManager->createPage($page_name);
                    break;

                    case 'getContentPages':
                            header("Content-type: text/xml");
                            echo $host->contentManager->getContentPages();
                    break;

                    case 'changeLayoutType':
                            $id	=	JRequest::getVar('id');
                            $type	=	JRequest::getVar('layoutType');
                            $host->contentManager->changeLayoutType($id, $type);
                    break;

                    case  'changePageName':
                            $id	=	JRequest::getVar('id');
                            $page_name	=	JRequest::getVar('pageName');
                            $host->contentManger->changePageName($id, $page_name);
                    break;

                    case 'deleteRow':
                            $id	=	JRequest::getVar('id');
                            $host->contentManager->deleteRow($id);
                    break;

                    case 'savePage':
                            $page_id	=	JRequest::getVar('page_id');
                            $json	=	JRequest::getVar('json');
                            $host->contentManager->savePage($page_id, $json);
                    break;

                    case 'loadPage':
                            $pageId	=	JRequest::getVar('pageId');
                            echo $host->contentManager->loadPage($pageId);
                    break;

                    case 'saveModuleInfo':
                            $mod_id	=	JRequest::getVar('mod_id');
                            $title	=	JRequest::getVar('title');
                            $host->contentManager->saveModuleInfo($mod_id, $title);
                    break;
            }
            die;
	}
}
?>




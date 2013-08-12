<?php
class ContentManager {
	private $host;
	/**
        *
        */
        function __construct(){
        	$this->host = &FamilyTreeTopHostLibrary::getInstance();
        }
        
        /*
        * content.manager.js
        */
        
        /**
	* Get a list of pages created by content manager.
	* @return rows (due to the fact that joomla adds the characters at the beginning of the transfer) with the values of id, title, layout_type.
	*/
	function getContentPages(){
		ob_clean();
		$db =& JFactory::getDBO();
  		$db->setQuery('SELECT id, title, layout_type FROM #__mb_content');
  		$rows = $db->loadAssocList(); 		
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
        *
        */
	function createPage($page_name){
		$db =& JFactory::getDBO();
		$sql = "INSERT INTO `#__mb_content` (`id` ,`title` ,`layout_type`) VALUES ( NULL , '".$page_name."', 'double')";		
		$db->setQuery($sql);
		$db->query();
		$id = mysql_insert_id(); 
		echo $id;
		die;
	}
	
	/**
	* Changes title in _content table
	* @param int $id
	* @param string $page_name
	*/
	function changePageName($attrs){
		$attrs = explode(';', $attrs);
		$id = $attrs[0];
		$page_name = $attrs[1];
		$db =& JFactory::getDBO();
		$sql = "UPDATE #__mb_content SET title = '".$page_name."' WHERE id='".$id."'";
		$db->setQuery($sql);
		$db->query();
		die;
	}
	
	/**
	*
	*/
	function getIcons($args){
		ob_clean();
		$args = explode(';', $args);
		$id = $args[0];
		$title_id = $args[1];
		$path = str_replace('\\', '/', JPATH_ROOT.'/components/com_manager/icons/'.$id.'.jpg');
		if(file_exists($path)){
			return  $title_id.'::'.JURI::root().'components/com_manager/icons/'.$id.'.jpg';
		}
		return '0';
	}
	
	/**
	*
	*/
	private function createImage($file){
		$type = exif_imagetype($file);
		switch($type){
			case 1:
				return imagecreatefromgif($file);			
			case 2:
				return imagecreatefromjpeg($file);
			case 3:
				return imagecreatefrompng($file);
			default:
				return false;
		}
	}
	
	/**
	*
	*/
	function uploadIcon($id){
		$file = $_FILES["userfile"]["tmp_name"];
		$im = $this->createImage($file);
		if(!$im) return 'Incorrect image type...';
		
		list($width, $height) = getimagesize($file);
		
		$ims = imagecreatetruecolor(32, 32);
		imagecopyresampled($ims, $im, 0, 0, 0, 0, 32, 32, $width, $height);
		
		imagejpeg($ims, JPATH_ROOT.'/components/com_manager/icons/'.$id.'.jpg');
		imagedestroy($ims);
	}
	
	/**
	*
	*/
	function deleteIcon($id){
		$path = JPATH_ROOT.'/components/com_manager/icons/'.$id.'.jpg';
		if(file_exists($path)){
			unlink($path);
		}
		return;
	}
	
	/**
	* delete rows in _content and _mb_content table
	* @param int $id
	*/
	function deleteRow($id){
		$db =& JFactory::getDBO();
		$sql = 'DELETE FROM `#__mb_content` WHERE `id` ='.$id;
		$db->setQuery($sql);
		$db->query();
		die;
	}
	
	/*
        * layout.manipulator.js
        */
	
	/**
	* Changes the type of layout.
	* @param int $id
	* @param string $type (layout_type in db)
	*/
	function changeLayoutType($args){
		$args = explode(';', $args);
		$id = $args[0];
		$type = $args[1];
		$db =& JFactory::getDBO();
		$sql = "UPDATE #__mb_content SET layout_type = '".$type."' WHERE id='".$id."'";
		$db->setQuery($sql);
		$db->query();

                $db->setQuery("SELECT * FROM #__mb_modulesgrid WHERE page_id=".$id);
  		$rows = $db->loadAssocList();
                $modulesgrid = json_decode($rows['json']);
                $col_count;
                switch ($type){
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
                        $col_count++;
                        $index = (string)($col_count-1);
                        unlink($modulesgrid->$index);
                        
                    }
                }elseif($modulesgrid->tdLength < $col_count){
                    while($modulesgrid->tdLength < $col_count){
                        $col_count--;
                        $index = (string)($col_count-1);
                        $modulesgrid->$index->divLength = 0;
                        
                    }
                }
                $modulesgrid->tdLength = $count;
                $newJson = json_encode($modulesgrid);
                echo $newJson;
                $sql = "UPDATE #__mb_modulesgrid SET json='".mysql_real_escape_string($newJson). "' WHERE page_id=".$id;
		$db->setQuery($sql);
		$db->query();
		die;
	}
	
}
?>

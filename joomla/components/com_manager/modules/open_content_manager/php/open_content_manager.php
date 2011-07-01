<?php
class OpenContentManager {
	private $host;
	/**
        *
        */
        function __construct(){
        	$this->host = new Host('Joomla'); 
        }
	
        public function search($id){
        	ob_clean();
        	$ind = $this->host->gedcom->individuals->get($id);
        	$name =	trim(str_replace('@P.N.', '', str_replace('@N.N.', '', $ind->FirstName.' '.$ind->MiddleName.' '.$ind->LastName)));
        	header('Content-Type: text/xml');
		$xml = '<?xml version="1.0" encoding="utf-8" ?>';
		$xml .= '<indiv>';
			$xml .= '<name>'.$name.'</name>';
		$xml .= '</indiv>';
		return $xml;
        }
	
        /**
        *
        */
        public function loadPageInfo($page_id){
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
	public function getPageInfo($args){
		$args = explode(':', $args);
		$page_id = $args[1];
		ob_clean();
		$db =& JFactory::getDBO();
  		$db->setQuery("SELECT id, title, layout_type FROM #__mb_content WHERE id='".$page_id."'");
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
}
?>

	
	

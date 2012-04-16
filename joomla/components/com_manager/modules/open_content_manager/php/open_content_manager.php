<?php
class FTTOpenContentManagerClass {
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
            $sql = "SELECT uid, page_id, json FROM #__mb_modulesgrid WHERE page_id=?";
            $this->host->ajax->setQuery($sql, $page_id);
            $rows = $this->host->ajax->loadAssocList();
            echo ($rows!=null)?$rows[0]['json']:false;
            exit;
	}
	
	/**
	*
	*/
	public function getPageInfo($args){
		$args = explode(':', $args);
		$page_id = $args[1];
        $sql_string = "SELECT id, title, layout_type FROM #__mb_content WHERE id= ?";
        $this->host->ajax->setQuery($sql_string, $page_id);
  		$rows = $this->host->ajax->loadAssocList();
        $result = array();
        foreach($rows as $row){
            $result[] = array('id'=>$row['id'], 'title'=>$row['title'], 'layoutType'=>$row['layout_type']);
        }
        echo json_encode(array('data'=>$result));
        die;
	}
}
?>

	
	

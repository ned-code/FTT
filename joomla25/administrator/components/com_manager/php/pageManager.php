<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

class pageManager{
	/**
	*
	*/
        public function __construct(){
        }
        
        /**
        *
        */
        public function getPagesList(){
            $request = "SELECT * FROM {$this->preffics}content";
            return $this->_sendRequestAndGenerateResponse($request);
        }
        
        /**
        *
        */
        public function getPagesSet($pages){
            if($pages!=""){
                $pages_array = explode("|", $pages);
                $request = "SELECT * FROM #__mb_content WHERE id=".$pages_array[0];
                
                if($count = count($pages_array))
                    for($i=1; $i < $count; $i++)
                        $request .= " OR id=".$pages_array[$i];
                
                return $this->_sendRequestAndGenerateResponse($request);
            }
        }
        
        /**
        *
        */
        private function _sendRequestAndGenerateResponse($request){
        	$db =& JFactory::getDBO();
        	$db->setQuery($request);
        	$rows = $db->loadAssocList();
        	$response = "<?xml version='1.0' encoding='iso-8859-1' ?>";
        	$response .= "<pages>";
        	for($i=0;$i<sizeof($rows);$i++){
        		$response .= "<page id='".$rows[$i]['id']."' title='".$rows[$i]['title']."' layout_type='".$rows[$i]['layout_type']."'></page>";
        	}
        	$response .="</pages>";
            
            return $response;
        }
        
        /**
        *
        */
        public function getLayout($id){
            
        }
        
        /**
        *
        */
        public function renderPage($id){

        }
    }
?>
<?php
class JMBFamilies {
	protected $host;
	
	function __construct(){
		$this->host = new Host('Joomla');
	}
	
	
	protected function _getColors(){
		$config = $_SESSION['jmb']['config'];
                $color = array();
                foreach($config['color'] as $key => $element){
                	switch($key){
                	    case "female":
                                    $color['F'] = $element;
                            break;
                            
                            case "male":
                                    $color['M'] = $element;
                            break;
                            
                            case "location":
                                    $color['L'] = $element;
                            break;
                            
                    	    case "famous_header":
                    	    	    $color['famous_header'] = $element;
                    	    break;
                    
                    	    case "family_header":
                    	    	    $color['family_header'] = $element;
                    	    break;
                	}
                }
                return $color;
	}
	
	public function getFamilies(){
		$tree_id = $_SESSION['jmb']['tid'];
		$gedcom_id = $_SESSION['jmb']['gid'];
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		$user = $usertree[$gedcom_id];
		$colors = $this->_getColors();
		
		return json_encode(array(
			'colors'=>$colors,
			'user'=>$user,
			'usertree'=>$usertree
		));
		
	}
	
}
?>

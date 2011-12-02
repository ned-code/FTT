<?php
class JMBRecentVisitors {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function getColors(){
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
	
	protected function get_objects($res){
		$objects = array();
		$owner_id = $_SESSION['jmb']['gid'];
		foreach($res as $obj){
			$objects[$obj['id']] = $this->host->getUserInfo($obj['id'], $owner_id);
		}
		return $objects;
	}
	
	protected function sortByPermission($response){
		if($_SESSION['jmb']['permission'] == 'OWNER' || empty($response)) return $response;
		$tree = $_SESSION['jmb']['tree'];
		$result = array();
		foreach($response as $user){
			if(isset($tree[$user['id']])){
				$result[] = $user;
			}
		}
		return $result;
	}
	
	public function get_recent_visitors($render_type){
		$result = $this->sortByPermission($this->host->gedcom->individuals->getLastLoginMembers($_SESSION['jmb']['tid']));
		$time = date('Y-m-d H:i:s');
		$objects = $this->get_objects($result);
		$path = "";
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		$lang = $this->host->getLangList('recent_visitors');
		$colors = $this->getColors();	
		$config = array('alias'=>$_SESSION['jmb']['alias'],'login_type'=>$_SESSION['jmb']['login_type'],'colors'=>$colors);
		return json_encode(array('config'=>$config,'response'=>$result,'objects'=>$objects,'time'=>$time,'path'=>$path,'fmbUser'=>$fmbUser,'lang'=>$lang));		
	}
}
?>

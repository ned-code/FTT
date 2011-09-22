<?php
class JMBRecentVisitors {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	protected function get_objects($res){
		$objects = array();
		$owner_id = $_SESSION['jmb']['gid'];
		foreach($res as $obj){
			$objects[$obj['id']] = $this->host->getUserInfo($obj['id'], $owner_id);
		}
		return $objects;
	}
	
	public function get_recent_visitors(){
		ob_clean;
		$response = $this->host->gedcom->individuals->getLastLoginMembers($_SESSION['jmb']['tid']);
		$time = date('Y-m-d H:i:s');
		$objects = $this->get_objects($response);
		$path = JURI::root(true);
		$fmbUser = $this->host->getUserInfo($_SESSION['jmb']['gid']);
		return json_encode(array('response'=>$response,'objects'=>$objects,'time'=>$time,'path'=>$path,'fmbUser'=>$fmbUser));		
	}
}
?>

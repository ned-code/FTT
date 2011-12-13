<?php
class JMBAncestors {	
	
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function get($indKey){
		$owner_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$usertree = $this->host->usertree->load($tree_id, $owner_id);
		$user = $usertree[$owner_id];
		return json_encode(array('usertree'=>$usertree,'user'=>$user));
	}
	
	
	
}
?>

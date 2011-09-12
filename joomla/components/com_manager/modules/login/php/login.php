<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function get($fid){
		$ownerId = $_SESSION['jmb']['gid'];
		$fmbUser = $this->host->getUserInfo($ownerId, $ownerId); 
		$path = JURI::root(true);
		return json_encode(array('fmbUser'=>$fmbUser,'imgPath'=>$path));
	}
}
?>

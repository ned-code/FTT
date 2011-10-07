<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function profile(){
		return json_encode(array('session'=>$_SESSION['jmb']));
	}

	public function get(){
		$ownerId = $_SESSION['jmb']['gid'];
		$fmbUser = $this->host->getUserInfo($ownerId, $ownerId); 
		$path = JURI::root(true);
		return json_encode(array('fmbUser'=>$fmbUser,'imgPath'=>$path));
	}
}
?>

<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function status(){
		$alias = $_SESSION['jmb']['alias'];
		$fid = $_SESSION['jmb']['fid'];
		$gid = $_SESSION['jmb']['gid'];
		$login_type = $_SESSION['jmb']['login_type'];
		$permission = $_SESSION['jmb']['permission'];
		$tid = $_SESSION['jmb']['tid'];
		$ind = $this->host->gedcom->individuals->get($gid);
		return json_encode(array('alias'=>$alias,'facebook_id'=>$fid,'gedcom_id'=>$gid,'login_type'=>$login_type,'permission'=>$permission,'tree_id'=>$tid,'individ'=>$ind));
	}

	public function familyLogout(){
		$_SESSION['jmb']['tid'] = null;
		$_SESSION['jmb']['gid'] = null;
		$_SESSION['jmb']['permission'] = null;
		$_SESSION['jmb']['alias'] = 'famous-family';
	}
	
	public function get(){
		$ownerId = $_SESSION['jmb']['gid'];
		$fmbUser = $this->host->getUserInfo($ownerId, $ownerId); 
		$path = JURI::root(true);
		return json_encode(array('fmbUser'=>$fmbUser,'imgPath'=>$path));
	}
}
?>

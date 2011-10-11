<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function status(){
		$alias = (isset($_SESSION['jmb']['alias']))?$_SESSION['jmb']['alias']:null;
		$fid = (isset($_SESSION['jmb']['fid']))?$_SESSION['jmb']['fid']:null;
		$tid = (isset($_SESSION['jmb']['tid']))?$_SESSION['jmb']['tid']:null;
		$gid = (isset($_SESSION['jmb']['gid']))?$_SESSION['jmb']['gid']:null;
		$login_type = (isset($_SESSION['jmb']['login_type']))?$_SESSION['jmb']['login_type']:null;
		$permission = (isset($_SESSION['jmb']['permission']))?$_SESSION['jmb']['permission']:null;
		
		$path = JURI::root(true);
		$ind = $this->host->gedcom->individuals->get($gid);
		$avatar = $this->host->gedcom->media->getAvatarImage($gid);		
		return json_encode(array('alias'=>$alias,'facebook_id'=>$fid,'gedcom_id'=>$gid,'login_type'=>$login_type,'permission'=>$permission,'tree_id'=>$tid,'individ'=>$ind,'avatar'=>$avatar,'path'=>$path));
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

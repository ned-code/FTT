<?php
class JMBLogin {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function facebook($args){
		$args = json_decode($args);
		require_once(JPATH_BASE.DS.'components'.DS.'com_manager'.DS.'php'.DS.'facebook.php');
		$facebook = new Facebook(array('appId'=>$_SESSION['jmb']['JMB_FACEBOOK_APPID'],'secret'=>$_SESSION['jmb']['JMB_FACEBOOK_SECRET'],'cookie'=>$_SESSION['jmb']['JMB_FACEBOOK_COOKIE']));
		$facebook->setAccessToken($args->access_token);
		return true;
	}
	public function user(){
		$gedcom_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		$this->host->usertree->init($tree_id, $gedcom_id, $permission);
		$usertree = $this->host->usertree->load($tree_id, $gedcom_id);
		return json_encode(array('user_id'=>$gedcom_id, 'usertree'=>$usertree));
	}
	public function famous($args){
		if($args == 'logout'){
			$_SESSION['jmb']['tid'] = null;
			$_SESSION['jmb']['gid'] = null;
			$_SESSION['jmb']['permission'] = null;
			$_SESSION['jmb']['alias'] = 'home';
			return true;
		}
	}
}
?>

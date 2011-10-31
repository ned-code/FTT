<?php
class JMBLoginButtonClass {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function setAccessToken($access_token){
		$facebook = new Facebook(array('appId'=>$_SESSION['jmb']['facebook_appid'],'secret'=>$_SESSION['jmb']['facebook_secret'],'cookie'=>$_SESSION['jmb']['facebook_cookie']));
		$facebook->setAccessToken($access_token);
	}
}
?>

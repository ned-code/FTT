<?php
class JMBRecentVisitors {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function get_recent_visitors(){
		ob_clean;
		
		return json_encode(array('response'=>$this->host->gedcom->individuals->getLastLoginMembers($_SESSION['jmb']['tid']),'time'=>date('Y-m-d H:i:s')));		
	}
}
?>

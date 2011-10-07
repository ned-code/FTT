<?php
class JMBHome {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function page($args){
		switch($args){
			case 'myfamily':
				$_SESSION['jmb']['login_type'] = 'family_tree';
			break;
			
			case 'famous-family':
				$_SESSION['jmb']['login_type'] = 'famous_family';
			break;
		}
		$_SESSION['jmb']['alias'] = $args;
	}
}
?>

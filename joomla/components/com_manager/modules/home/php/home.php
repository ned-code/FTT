<?php
class JMBHome {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
	
	public function page($args){
		$session = JFactory::getSession();
		switch($args){
			case 'myfamily':
				$session->set('login_method', 'family_tree');
			break;
			
			case 'famous-family':
				$session->set('login_method', 'famous_family');
			break;
		}
		$session->set('alias', $args);
		return true;
	}
}
?>

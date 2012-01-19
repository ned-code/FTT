<?php
class JMBFamilyLine {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}

	public function get(){
		$gedcom_id = $_SESSION['jmb']['gid'];
		$tree_id = $_SESSION['jmb']['tid'];
		$permission = $_SESSION['jmb']['permission'];
		return $this->host->usertree->saveFamilyLine($tree_id, $gedcom_id, $permission);
	}
}
?>

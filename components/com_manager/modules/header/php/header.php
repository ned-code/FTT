<?php
class JMBHeader {
	protected $host;
	
	public function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}
}
?>

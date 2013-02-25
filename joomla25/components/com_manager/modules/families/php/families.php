<?php
class JMBFamilies {
	protected $host;
	
	function __construct(){
		$this->host = &FamilyTreeTopHostLibrary::getInstance();
	}	
}
?>

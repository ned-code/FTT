<?php
class JMBHeader {
	protected $host;
	
	public function __construct(){
		$this->host = new Host('Joomla');
	}
}
?>

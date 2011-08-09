<?php
class Gramps{
        public $parser;
        public $core;
        public function __construct(&$core){
        	$grampsPath = JPATH_BASE.DS.'components'.DS.'com_manager'.DS.'php'.DS.'gramps'.DS.'classes';
        	
        	if(file_exists($grampsPath.DS.'class.parser.manager.php')){
        		require_once $grampsPath.DS.'class.parser.manager.php';
        		 $this->parser = new ParserList($this);
        	}
        	$this->core = $core;
        }  
}
?>
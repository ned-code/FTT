<?php
class Gramps{
        public $parser;
        public $core;
        public function __construct(&$core){
        	$jpath = $core->getAbsoluePath();
        	$grampsPath = $jpath.DS.'components'.DS.'com_manager'.DS.'php'.DS.'gramps'.DS.'classes';
        	
        	if(file_exists($grampsPath.DS.'class.parser.manager.php')){
        		require_once $grampsPath.DS.'class.parser.manager.php';
        		 $this->parser = new ParserList($this);
        	}
        	if(file_exists($grampsPath.DS.'class.merge.manager.php')){
        		require_once $grampsPath.DS.'class.merge.manager.php';
        		 $this->merge = new MergeList($this);
        	}
        	$this->core = $core;
        }  
}
?>
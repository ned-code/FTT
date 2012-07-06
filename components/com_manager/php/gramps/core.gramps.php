<?php
require_once 'classes/class.parser.php';
require_once 'classes/class.parser.manager.php';

class Gramps{
        public $parser;

        public function __construct(&$ajax, &$gedcom){
            $this->parser = new ParserList($ajax, $gedcom);
        }  
}
?>
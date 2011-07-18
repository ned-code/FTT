<?php
require_once 'class.data.php';
    class Media{
        public $Id;
        public $Form;
        public $Title;
        public $Path;        
        function  __construct() {
            $this->Id = null;
            $this->Form = null;
            $this->Title = null;
            $this->Path = null;            
        }
 
    }
?>
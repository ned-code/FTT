<?php
class Media{
        public $Id;
        public $Type;
        public $Title;
        public $FilePath;        
        function  __construct() {
            $this->Id = null;
            $this->Type = null;
            $this->Title = null;
            $this->FilePath = null;            
        }
 
    }
?>
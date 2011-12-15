<?php
class Media{
        public $Id;
        public $Type;
        public $Title;
        public $FilePath;  
        public $Size;
        function  __construct() {
            $this->Id = null;
            $this->Type = null;
            $this->Title = null;
            $this->FilePath = null; 
            $this->Size = null;
        }
 
    }
?>
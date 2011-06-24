<?php
require_once 'class.data.php';
    class Tag{
        public $Id;
        public $Name;
        
        function  __construct($id, $name) {
            $this->Id = $id;
            $this->Name = $name;
            
        }
 
    }
?>
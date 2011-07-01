<?php
require_once 'class.data.php';
    class Note{
        public $Id;
        public $Text;
        public $Level;
        function  __construct($id, $text, $level='0') {
            $this->Id=$id;
            $this->Text=$text;
            $this->Level=$level;
        }
 
    }
?>
<?php
require_once 'class.data.php';
    class Source{
        public $Id;
        public $Title;
        public $Author;
        public $Publication;
        public $Repository;
        public $Level;
        function  __construct($id, $title, $author='', $publication='',$repository='', $level='0') {
            $this->Id = $id;
            $this->Title = $title;
            $this->Author = $author;
            $this->Publication = $publication;
            $this->Repository = $repository;
            $this->Level = $level;
        }
 
    }
?>
<?php
# Check to ensure this file is included in Joomla!
defined('_JEXEC') or die( 'Restricted access' );

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
    class module_base{
        /**
        *
        */
    	protected $name;
        protected $title;
        protected $category;
        protected $description;
        protected $id;
        protected $core;
        protected $issystem;
        
        /**
        *
        */
        function uninstall(){}
        function render($mode){}
        function install(){}
        
        /**
        *
        */
        function  __construct($n_core, $system) {
            $this->issystem = $system;
            $this->core = $n_core;
        }
        
        function getName(){
            return $this->name;
        }
        function getTitle(){
            return $this->title;
        }
        function getCategory(){
            return $this->category;
        }
        function getDescription(){
            return $this->description;
        }
        function getId(){
            return $this->id;
        }
        function setName($value){
            return $this->name=$value;
        }
        function setTitle($value){
            return $this->title=$value;
        }
        function setCategory($value){
            return $this->category=$value;
        }
        function setDescription($value){
            return $this->description=$value;
        }
        function setId($value){
            return $this->id=$value;
        }
        function isSystem($value){
            return $this->issystem;
        }
        
    }
?>

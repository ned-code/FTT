<?php
Class Conflict{
    
    public $Id;
    public $ConflictTarget; 
    public $Method; 
    public $Property; 
    public $Value; 
    
    public function __construct() {
        $Id = null;
        $ConflictTarget = null;
        $Method = null;
        $Property = null;
        $Value = null;        
    }
}
?>
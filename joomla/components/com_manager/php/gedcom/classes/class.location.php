<?php
class Location{ 
	public $Name;
	public $Cont;
	public $Adr1;
	public $Adr2;
	public $City;
	public $State;
	public $Post;
	public $Country;
	public $Phones;
        public function __construct(){
        	$this->Name = NULL;
        	$this->Cont = NULL;
        	$this->Adr1 = NULL;
        	$this->Adr2 = NULL;
        	$this->City = NULL;
        	$this->State = NULL;
        	$this->Post = NULL;
        	$this->Country = NULL;
        	$this->Phones = NULL;
        }
}

class Place{
        public $Id;
        public $Name;
        public $Locations;
        public function  __construct() {
            $this->Id = NULL;
            $this->Name = NULL;
            $this->Locations = array();
        }
}
?>
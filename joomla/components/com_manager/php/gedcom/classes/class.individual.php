<?php
class Individual{
	public $TreeId;
	//individuals
	public $Id;
	public $FacebookId;
	public $Gender;
	//names
	public $FirstName;
	public $MiddleName;
	public $LastName;
	public $Nick;
	//events
	public $Events;
	public $Birth;
	public $Death;
	//for parser
	public $Prefix;
	public $GivenName;
	public $SurnamePrefix;
	public $Surname;
	public $Suffix;
	public $Relation;
	
	public function __construct(){
		$this->Id = null;
		$this->FacebookId = null;
		$this->Gender = null;
		$this->FirstName = null;
		$this->MiddleName = null;
		$this->LastName = null;
		$this->Nick = null;
		$this->Events = null;
		$this->Birth = null;
		$this->Death = null;
		$this->Prefix = null;
		$this->GivenName = null;
		$this->SurnamePrefix = null;
		$this->Surname = null;
		$this->Suffix = null;
		$this->Relation = null;
		$this->TreeId = null;
       }
}
?>
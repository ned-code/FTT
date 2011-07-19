<?php
class Individual{
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

	public function __construct($id=null, $fname="", $mname="", $lname="", $suffix="", $sex=null, $occupation='', $events=null, $birth=null, $death=null, $fid=null){
		$this->Id = null;
		$this->FacebookId = null;
		$this->Gender = null;
		$this->FirstName = '';
		$this->MiddleName = '';
		$this->LastName = '';
		$this->Nick = '';
		$this->Events = null;
		$this->Birth = null;
		$this->Death = null;
       }
}
?>
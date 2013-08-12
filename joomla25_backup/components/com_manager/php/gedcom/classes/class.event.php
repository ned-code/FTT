<?php
class EventDate{
	public $Day;
	public $Month;
	public $Year;
	public function __construct(){
		$this->Day = NULL;
		$this->Month = NULL;
		$this->Year = NULL;
	}
}

class Events {
	public $Id;
	public $Name;
	public $Type;
	public $DateType;
	public $From;
	public $To;
	public $Caus;
	public $ResAgency;
	public $Place;
	public $Note;
	public $IndKey;
	public $FamKey;
	public $Notes;
	public $Sources;

	public function __construct() {
		$this->Id = NULL;
		$this->Name = NULL;
		$this->Type = NULL;
		$this->DateType = NULL;
		$this->From = new EventDate();
		$this->To = new EventDate();
		$this->Caus = NULL;
		$this->ResAgency = NULL;
		$this->Place = NULL;
		$this->IndKey = NULL;
		$this->FamKey = NULL;
		$this->Notes = NULL;
		$this->Sources = NULL;
	}
}
?>
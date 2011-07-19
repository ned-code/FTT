<?php
class FamilyEvent{
	public $Id;
	public $Day;
	public $Spouse;
	public $Spouse2;
	public $Month;
	public $Year;
	public $Type;
	public $FamilyId;
	public $Place;
	public $Notes;
	public $Sources;
	function  __construct(){
		$this->Id = NULL;
		$this->Spouse = NULL;
		$this->Spouse2 = NULL;
		$this->Day = NULL;
		$this->Month = NULL;
		$this->Year = NULL;
		$this->Type = NULL;
		$this->Place = NULL;
		$this->FamilyId = NULL;
		$this->Notes = NULL;
		$this->Sources = NULL;
          }
}

class Family{

    	public $Id;
    	public $Type;
	public $Sircar;
	public $Spouse;
	public $Marriage;
	public $Divorce;
	public $Events;

	function  __construct($id="",$sircar=null, $spouse=null, $marriage=null, $divorce=null, $events=null) {
            $this->Id = NULL;
            $this->Type = NULL;
            $this->Sircar = NULL;
            $this->Spouse = NULL;
            $this->Marriage = NULL;
            $this->Divorce = NULL;
            $this->Events = NULL;
        }  
    }
?>
<?php
require_once 'class.data.php';
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
        function  __construct($id="",$spouse=null, $spouse2=null, $day=null, $month=null, $year=null, $type=null, $familyId = null, $place = null, $notes = array(), $sources=array()) {
            $this->Id = $id;
            $this->Spouse = $spouse;
            $this->Spouse2 = $spouse2;
            $this->Day = $day;
            $this->Month = $month;
            $this->Year = $year;
            $this->Type = $type;
            $this->Place = $place;
            $this->FamilyId = $familyId;
            $this->Notes = $notes;
            $this->Sources = $sources;
          }
    }
    class Family{
        public $Id;
        public $Sircar;
        public $Spouse;
        public $Marriage;
        public $Divorce;
        public $Events;
        function  __construct($id="",$sircar=null, $spouse=null, $marriage=null, $divorce=null, $events=null) {
            $this->Id = $id;
            $this->Sircar = $sircar;
            $this->Spouse = $spouse;
            $this->Marriage = $marriage;
            $this->Divorce = $divorce;
            $this->Events = $events;
        }  
    }
?>
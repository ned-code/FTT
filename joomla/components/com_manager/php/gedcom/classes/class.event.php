<?php
//require_once 'class.data.php';


    class Events {//extends {//DataType{
        public $Id;
        public $Type;
        public $Day;
        public $Month;
        public $Year;
        public $Place;
        public $Note;
        public $IndKey;
        public $Notes;
        public $Sources;

        public function __construct($id="", $type="", $day="", $month="", $year="", $indkey="", $place=null, $notes = array(), $sources = array()) {
            $this->Id = $id;
            $this->Type = $type;
            $this->Day = $day;
            $this->Month = $month;
            $this->Year = $year;
            $this->Place = $place;
            $this->IndKey = $indkey;
            $this->Notes = $notes;
            $this->Sources = $sources;
            $this->checkDate();

        }
        public function checkDate(){
            if($this->Year != ""){
                if(strlen($this->Year)<4)
                        while(strlen($this->Year)<4)
                             $this->Year = "0".$this->Year;
                while(strlen($this->Day)<2)
                             $this->Day = "0".$this->Day;
                while(strlen($this->Month)<2)
                             $this->Month = "0".$this->Month;
                }else{
                    $this->Year = "";
                    $this->Day = "";
                    $this->Month = "";
                }
        }
        public function Update(){         // on edit event data edit #__mb_individuals.i_gedcom
            
            if($this->Id){
                $this->checkDate();
                $db =& JFactory::getDBO();
                $req = "UPDATE #__mb_dates SET d_year='".$this->Year."', d_mon='".$this->Month."', d_day='".$this->Day."', d_month='' WHERE d_id='".$this->Id."'";
            //
                $db->setQuery($req);
                $db->query();
            }
        }
        public function Save(){
            if($this->IndKey){
              // $this->checkDate();d_id 	d_day 	d_month 	d_mon 	d_year 	d_julianday1 	d_julianday2 	d_fact 	d_gid 	d_file 	d_type
                $db =& JFactory::getDBO();
                $req = "INSERT INTO  #__mb_dates (`d_id` ,`d_day` ,`d_month` ,`d_mon` ,`d_year` ,`d_julianday1` ,`d_julianday2` ,`d_fact` ,`d_gid` ,`d_file`, `d_type`)
		VALUES (
		'','".$this->Day."','','".$this->Month."','".$this->Year."','','','".$this->Type."','".$this->IndKey."',
		'"."', '@#DGREGORIAN@')";
               
                $db->setQuery($req);
                $db->query();//*/
            }
        }
        public function Delete($id){
            $db =& JFactory::getDBO();
            $req = 'DELETE FROM #__mb_dates WHERE d_id='.$this->Id;
            $db->setQuery($req);
            
            $db->query();
        }
    }
?>
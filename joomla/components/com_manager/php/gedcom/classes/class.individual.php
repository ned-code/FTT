<?php
define('MAX_AGE', 120);
require_once 'class.data.php';
    class Individual{
       public $Id;
       public $FirstName;
       public $MiddleName;
       public $LastName;
       public $Nick;
       public $Suffix;
       public $Gender;
       public $Occupation;
       public $Events;
       public $Birth;
       public $Death;
       public $FacebookId;
       
       public function __construct($id=null, $fname="", $mname="", $lname="", $suffix="", $sex=null, $occupation='', $events=null, $birth=null, $death=null, $fid=null){
           $this->Id = $id;
           $this->FirstName = $fname;
           $this->MiddleName = $mname;
           $this->LastName = $lname;
           $this->Suffix = $suffix;
           $this->Gender = $sex;
           $this->Events = $events;
           $this->Birth = $birth;
           $this->Death = $death;
           $this->Occupation = $occupation;
           $this->FacebookId = $fid;

       }
       public function getFullName(){
        $str = "";
        if($this->FirstName != '' && strcmp($this->FirstName, '@P.N.'))
     
                $str.=$this->FirstName;
        if($this->MiddleName != '')
                $str.=($str!=''?' ':'').$this->MiddleName;
        if($this->LastName != ''&& strcmp($this->LastName, '@N.N.'))
    
                $str.=($str!=''?' ':'').$this->LastName;
        if($this->Suffix != '')
                $str.=($str!=''?' ':'').$this->Suffix;
           return $str;
       }
       public function isLiving(){
           if($this->Birth == null){
               if($this->Death == null)
                   return true;
               else
                   return false;
           }elseif($this->Death == null){
               if(date('Y') - $this->Birth->Year > MAX_AGE)
                       return false;
               else return true;
           }
       }
       public function getAge(){
           if($this->Birth != null){
               if($this->Death != null){
                   if($this->Death->Year - $this->Birth->Year > MAX_AGE)
                       return false;
                   else return $this->Death->Year - $this->Birth->Year;
               }else {
                   if(date('Y') - $this->Birth->Year > MAX_AGE)
                       return false;
                   else return date('Y') - $this->Birth->Year;
               }
           }
           else{
               return false;
           }
       }
       public function Save(){

       }
       public function Update(){
           if($this->Id){
           
                $db =& JFactory::getDBO();
                $req = "UPDATE #__mb_individuals SET i_sex='".$this->Gender."', i_occupation='".$this->Occupation."' WHERE i_id='".$this->Id."'";
              
                $surname = ($this->LastName != "" ? $this->LastName : "@N.N.");
                $givenname =  ($this->FirstName != "" ? $this->FirstName : "@P.N.");
                $db->setQuery($req);
                $db->query();
                $req = "UPDATE #__mb_name SET n_sort='".strtoupper($surname.",".$givenname)."', n_full='".$surname." ".$givenname."', n_list='"
                            .$surname.", ".$givenname."', n_surname='".$surname."', n_surn='".strtoupper($surname)."', n_givn='"
                            .$givenname."', n_midd='".$this->MiddleName."', n_suff='".$this->Suffix."' WHERE n_id='".$this->Id."'";;
                $db->setQuery($req);
                $db->query();
            }
        }
        public function Delete(){
            if($this->Id){

                $db =& JFactory::getDBO();
                $req = "DELETE FROM #__mb_individuals  WHERE i_id='".$this->Id."'";
                $db->setQuery($req);
                $db->query();

                $req = "DELETE FROM #__mb_name  WHERE n_id='".$this->Id."'";
                $db->setQuery($req);
                $db->query();

                $req = "DELETE FROM #__mb_link  WHERE l_to='".$this->Id."' OR l_from='".$this->Id."'";
                $db->setQuery($req);

                $req = "DELETE FROM #__mb_placelinks  WHERE pl_gid='".$this->Id."'";
                $db->setQuery($req);

                $req = "UPDATE  #__mb_families SET f_numchil=(f_numchil -1), f_chill=REPLACE(REPLACE(f_chill, '".$this->Id."," ."',''),'".",".$this->Id ."', '') WHERE f_husb='".$this->Id."' OR f_wife='".$this->Id."' ";
                $db->setQuery($req);

                $db->query();
            }
        }
    }
?>
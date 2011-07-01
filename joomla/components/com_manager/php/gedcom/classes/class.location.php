<?php

    class Location{
        public $Hierarchy = null;
        
        public function __construct($places=null){
            if($places != null)
                foreach($places as $p){
                    $this->Hierarchy[$p->Level] = $p;
                    //$this->Hierarchy[$h[]
                }
        }
        public function toString(){
            $str = '';
           // var_dump($this->Hierarchy);
        //    var_dump($this->Hierarchy);
            for($i = count($this->Hierarchy)-1; $i>=0; $i--){
              
                $str .= $this->Hierarchy[$i]->Name;
                if($i>0)
                    $str .= ', ';
            }
            return $str;
        }
    }
    class Place{
        public $Id;
        public $Name;
        public $Level;
        public $ParentId;
        public function  __construct($id='', $name='', $level='0', $parent_id='0') {
            $this->Id = $id;
            $this->Name = $name;
            $this->Level = $level;
            $this->ParentId = $parent_id;

        }
       

    }
?>
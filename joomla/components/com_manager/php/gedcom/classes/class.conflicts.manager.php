<?php
class ConflictsList {
      public $core;

     function __construct(&$core){
       	 require_once 'class.conflict.php';
       	 $this->core=$core;
       	 $this->db = & JFactory::getDBO();
     }
    
    public function get($id){
      if($id==null){ return null; }        	
      $sql = $this->core->sql("SELECT * FROM #__mb_conflicts WHERE `id`=? ",$id);
      $this->db->setQuery($sql);
      $rows = $this->db->loadAssocList();
      $conflict = $this->setConflictData($rows[0]);
      return $conflict;  
    }
    public function save($conflict, $key, $key_type='IND'){
      $sqlString = "INSERT INTO #__mb_conflicts (`id`,`conflict_target`,`method`,`property`,`value`,";
      $sqlString .= ($key_type=="IND")?"`individuals_id`":"`families_id`";
      $sqlString .= ") VALUES (NULL, ?, ?, ?, ?, ?)";
      $sql = $this->core->sql($sqlString, $conflict->ConflictTarget, $conflict->Method, $conflict->Property, $conflict->Value, $key);
      $this->db->setQuery($sql);
      $this->db->query();
      $id = $this->db->insertid();
      return $id;
    }
    public function update($conflict){
      $sqlString = "UPDATE #__mb_conflicts SET `conflict_target`=?, `method`=?, `property`=?, `value`=? WHERE `id`=?";
      $sql = $this->core->sql($sqlString, $conflict->ConflictTarget, $conflict->Method, $conflict->Property, $conflict->Value, $conflict->Id);
      $this->db->setQuery($sql);
      $this->db->query();  
    }
    public function getIndividualConflicts($id){
      $sqlString = "SELECT * FROM #__mb_conflicts WHERE `individuals_id`=?";
      $sql = $this->core->sql($sqlString,$id);
      $this->db->setQuery($sql);
      $rows = $this->db->loadAssocList();
      if($rows == null) {return false;}
      $conflicts = array();
      foreach($rows as $row){
        $conflicts[] = $this->setConflictData($row);
      }
      return $conflicts;  
    }
    
    public function getFamilyConflicts($id){
      $sqlString = "SELECT * FROM #__mb_conflicts WHERE `families_id`=?";
      $sql = $this->core->sql($sqlString,$id);
      $this->db->setQuery($sql);
      $rows = $this->db->loadAssocList();
      if($rows == null) {return false;}
      $conflicts = array();
      foreach($rows as $row){
        $conflicts[] = $this->setConflictData($row);
      }
      return $conflicts;  
    }
    public function setConflictData($row){
        $conflict = new Conflict();
        $conflict->Id = $row['id'];
        $conflict->ConflictTarget = $row['conflict_target'];
        $conflict->Method = $row['method'];
        $conflict->Property = $row['property'];
        $conflict->Value = $row['value'];
        return $conflict;
    }
     public function getPropCoord($prop,$owner_id=null){
       $prop = explode(".",$prop);
       $table=null;
       $field=null;
       $id=null;
       switch (count($prop)){
            case 1:{
               if ($prop[0]=='Gender') {
                    $table=' #__mb_individuals ';
                    $field=' `sex` '; 
               } else {
                    $table=' #__mb_names ';
                    switch ($prop[0]){
                        case 'FirstName': $field=' `first_name` '; break;
                        case 'LastName': $field=' `last_name` '; break;
                        case 'Nick': $field=' `nick` '; break;
                        case 'MiddleName': $field=' `miidle_name` '; break;
                        case 'Prefix': $field=' `prefix` '; break;
                        case 'Suffix': $field=' `suffix` '; break;
                        case 'SurnamePrefix': $field=' `surn_prefix` '; break;                        
                    }
               }
               $id = $owner_id;
            break;}
            case 2:{
               if ($prop[1]=='DateType'){
                    $table=' #__mb_dates ';
                    $field=' `type` ';
               } else {
                    $table=' #__mb_events ';
                    switch ($prop[1]){
                        case 'Caus': $field=' `caus` '; break;
                        case 'Type': $field=' `type` '; break;
                        case 'ResAgency': $field=' `res_agency` '; break;                    
                    }
               }
               if ($owner_id!=null){
                    switch ($prop[0]){
                        case 'Birth': $type='BIRT'; break;
                        case 'Death': $type='DEAT'; break;
                    }
                    $this->core->sql('SELECT * FROM #__mb_events WHERE `individuals_id`=? and `type`=?',$owner_id,$type);
                    $this->db->setQuery($sql);
                    $rows = $this->db->loadAssocList();
                    $id = $rows[0]['id'];    
               } 
            break;}
            case 3:{
               if ($prop[1]=='Place'){
                    if ($prop[2]=='Name'){
                        $table = ' #__mb_places';
                        $field= ' `name` ';
                    } else {
                      $table=' #__mb_locations ';
                      switch ($prop[2]){
                          case 'Adr1': $field=' `adr1` '; break;
                          case 'Adr2': $field=' `adr2` '; break;
                          case 'City': $field=' `city` '; break;
                          case 'Country': $field=' `country` '; break;
                          case 'LocationName': $field=' `name` '; break;
                          case 'Post': $field=' `post` '; break;
                          case 'State': $field=' `state` '; break;                                                                                                                                                    
                      }  
                    }
               } else {
                    $table = ' #__mb_dates ';
                    switch ($prop[1]){
                        case 'From': $field=' `f_'; break;
                        case 'To': $field=' `t_'; break;
                    }
                    switch ($prop[2]){
                        case 'Day': $field.='day` '; break;
                        case 'Month': $field.='month` '; break;
                        case 'Year': $field.='year` '; break;
                    }
                   if ($owner_id!=null){
                        switch ($prop[0]){
                            case 'Birth': $type='BIRT'; break;
                            case 'Death': $type='DEAT'; break;
                        }
                        $sql=$this->core->sql('SELECT * FROM #__mb_events WHERE `individuals_id`=? and `type`=?',$owner_id,$type);
                        $this->db->setQuery($sql);
                        $rows = $this->db->loadAssocList();
                        $id = $rows[0]['id'];    
                   } 
               }
            break;}  
       }
       switch ($table) {
            case ' #__mb_dates ': $key_field=' `events_id` '; break;
            case ' #__mb_locations ': $key_field=' `place_id` '; break;
            case ' #__mb_names ': $key_field=' `gid` '; break;
            case ' #__mb_events ': $key_field=' `id` '; break;
            case ' #__mb_individuals ': $key_field=' `id` '; break;
       }
      return array("table"=>$table,"field"=>$field,"id"=>$id,"key_field"=>$key_field);    
    }
}


?>
     

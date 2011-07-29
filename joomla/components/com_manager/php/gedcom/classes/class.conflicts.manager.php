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
}


?>
     

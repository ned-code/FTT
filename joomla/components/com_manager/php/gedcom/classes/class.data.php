<?php

   class DataType{
        public $table;
        public $key;

        public function count(){
                 
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT COUNT(*) FROM '.$this->table);
            $rows = $db->loadAssocList();
            return $rows[0]['COUNT(*)'];
        }
        public function all(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT * FROM '.$this->table);
            $rows = $db->loadAssocList();

            return $rows;
        }
        public function delete($id){
            $db =& JFactory::getDBO();
            $db->setQuery('DELETE FROM '.$this->table. ' WHERE '.$this->key.'="'.$id.'"');
            
            $db->query();
        }
        public function getById($id){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT * FROM '.$this->table. ' WHERE '.$this->key.'="'.$id.'"');
            $rows = $db->loadAssocList();
            
            if(isset ($rows[0]))
                return $rows[0];
            else return null;
        }
    }
?>
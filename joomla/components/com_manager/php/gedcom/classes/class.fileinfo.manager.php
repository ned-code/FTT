<?php
require_once 'class.data.php';
    class FileInfo{
        
        public $core;
        private $_soft_name = null;
        private $_file_name = null;
        private $_vers = null;
        private $_date = null;
        function  __construct($core) {
            $this->core = $core;
        }
        function getFileName(){
            if(!$this->_file_name){
                $db =& JFactory::getDBO();
                $req = "SELECT * FROM #__mb_other WHERE o_id='FILE'";
                $db->setQuery($req);
                $rows = $db->loadAssocList();
                $this->_file_name = $rows[0]["o_gedcom"];
            }
            return $this->_file_name;
        }
        function getSoftName(){
            if(!$this->_soft_name){
                $db =& JFactory::getDBO();
                    //echo 'SELECT '.$func.'(date1),type FROM '.$this->table. ' WHERE type="'.$type.'" AND date1 !=""';
                $req = 'SELECT o_gedcom FROM #__mb_other WHERE o_id="HEAD"';

                $db->setQuery($req);
                $rows = $db->loadAssocList();
                $text = $rows[0]['o_gedcom'];
                $text = preg_replace ('/\r\n|\n|\r/', '|', $text);
                $start = strpos($text, 'NAME');
                $end = strpos($text, '|', $start+1);
                $this->_soft_name = substr($text, $start+5, $end-$start-5);
            }
                   // var_dump($rows);
            return $this->_soft_name;
        }
        function getSoftVersion(){
             if(!$this->_vers){
             $db =& JFactory::getDBO();
                    //echo 'SELECT '.$func.'(date1),type FROM '.$this->table. ' WHERE type="'.$type.'" AND date1 !=""';
                    $req = 'SELECT o_gedcom FROM #__mb_other WHERE o_id="HEAD"';


                    $db->setQuery($req);
                    $rows = $db->loadAssocList();
                    $text = $rows[0]['o_gedcom'];
                    $text = preg_replace ('/\r\n|\n|\r/', '|', $text);
                    $start = strpos($text, 'VERS');
                    $end = strpos($text, '|', $start+1);
                    $this->_vers = substr($text, $start+5, $end-$start-5);
                   // var_dump($rows);
             }
              return $this->_vers;
        }
        function getCreationDate(){
               if(!$this->_date){
                    $db =& JFactory::getDBO();
                    //echo 'SELECT '.$func.'(date1),type FROM '.$this->table. ' WHERE type="'.$type.'" AND date1 !=""';
                    $req = 'SELECT o_gedcom FROM #__mb_other WHERE o_id="HEAD"';

                    $db->setQuery($req);
                    $rows = $db->loadAssocList();
                    $text = $rows[0]['o_gedcom'];
                    $text = preg_replace ('/\r\n|\n|\r/', '|', $text);
                    $start = strpos($text, 'DATE');
                    $end = strpos($text, '|', $start+1);
                    $this->_date = substr($text, $start+5, $end-$start-5);
                   // var_dump($rows);
               }
                    return $this->_date;
        }
    }
?>
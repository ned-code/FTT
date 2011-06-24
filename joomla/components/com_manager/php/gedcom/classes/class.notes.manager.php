<?php
require_once 'class.data.php';
    class NotesList extends DataType{
        
        public $core;

        function  __construct($core) {
            require_once 'class.note.php';
            $this->core=$core;
            
        }
        
        function get($id){
            $db =& JFactory::getDBO();

            $req = 'SELECT o_gedcom FROM #__mb_other WHERE o_type="NOTE" and o_id="'.$id.'"';

            $db->setQuery($req);

            $rows = $db->loadAssocList();
            return $this->processRawNote($rows[0]["o_gedcom"]);
        }
        function save($note, $foreignKey){
            $db =& JFactory::getDBO();
            $req = 'INSERT INTO #__mb_other (o_id, o_file, o_type, o_gedcom) VALUES ("'.$note->Id.'","0","NOTE","'.$this->getGedcomString($note, false).'")';
            $db->setQuery($req);


           
          
            $db->query();
            $req = 'INSERT INTO #__mb_link (l_file, l_from, l_type, l_to) VALUES ("0", "'.$foreignKey.'", "NOTE", "'.$note->Id.'")';
            $db->setQuery($req);
          
            $db->query();                
        }
        function update($note){
           // var_dump($note);
            $db =& JFactory::getDBO();
            $req = 'UPDATE #__mb_other SET o_gedcom="'.$this->getGedcomString($note, false).'" WHERE o_id="'.$note->Id.'"';
            ///echo $req;
            $db->setQuery($req);
            $db->query();
        }
        function delete($id){
            $db =& JFactory::getDBO();
            $db->setQuery('DELETE FROM #__mb_other WHERE o_id="'.$id.'"');
            $db->query();
            $db->setQuery('DELETE FROM #__mb_link WHERE l_from="'.$id.'" or l_to="'.$id.'"');
            $db->query();
        }
        function getNewId(){
            $db =& JFactory::getDBO();
            $req = 'SELECT SUBSTRING(o_id,2) as id FROM #__mb_other ORDER BY id+0 DESC';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
         
            if($rows == null){
               $newid = 'N1' ;
            }else{
                $newid = 'N'.($rows[0]['id']+1) ;
            }
            return $newid;

        }
        function getAllIds(){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_other.o_id as id FROM #__mb_other WHERE o_type = "NOTE"';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            return $rows;
        }
      
        function count(){
            $db =& JFactory::getDBO();
            $req = 'SELECT COUNT(*) FROM #__mb_other WHERE o_type="NOTE" ';
           
          //  echo $req;
            $db->setQuery($req);
            
            $rows = $db->loadAssocList();

            return $rows[0]['COUNT(*)'];
        }
        function processRawNote($gedcomString){
            if($gedcomString != null){
                $fSpace = strpos($gedcomString, ' ');
                $sSpace = strpos($gedcomString, ' ', $fSpace+1);

                $level = substr($gedcomString, 0, $fSpace);
                $id = substr($gedcomString, $fSpace+2, $sSpace - $fSpace -3);
                $value = substr($gedcomString, $sSpace+6);
                return new Note($id, $value, $level);
            }
            return null;
        }


        
         //is standart=true returns valid Gedcom record, else returns simplified gedcom string used in program logic
        function getGedcomString($note, $standart=true){
            if($standart == false){
                $gedcomString = $note->Level.' @'.$note->Id.'@ NOTE '.$note->Text;
                return $gedcomString;
            }else{
               
                $maxLength = 90;
                $level = '1';
                $pos = $maxLength;
                $str = '';
                $line = $note->Text;
            
                if($note != null){
                    do{
                    // Split on a non-space (standard gedcom behaviour)
                        while ($pos && substr($line, $pos-1, 1)==' ') {
                                --$pos;
                        }
                        if (strlen($line) > 3&&$pos==strpos($line, ' ', 3)) {
                                // No non-spaces in the data! Can't split it
                                break;
                        }
                        $newrec.="\n".$level.' CONC '.substr($line, 0, $pos);//.;
                        $line= substr($line, $pos);
                    }while (strlen($line)>$maxLength);
                    
                    $newrec.=($line != '' ?("\n".$level.' CONC '.substr($line, 0)):'');
                    $str = "0 @{$note->Id}@ NOTE";
                    $str .= $newrec;
                    $str = preg_replace ( '/(\n\t){1,2}|(\n\n)/' , "\n{$level} CONT\n{$level} CONC " , $str);
                  
                }
                return $str."\n";
            }
        }


        function getLinkedNotes($personId){
            $db =& JFactory::getDBO();

            $req = 'SELECT o_gedcom FROM #__mb_link
                    INNER JOIN #__mb_other ON (#__mb_link.l_to = #__mb_other.o_id AND #__mb_other.o_type="NOTE" )
                    WHERE  #__mb_link.l_from="'.$personId.'"';

            $db->setQuery($req);

            $rows = $db->loadAssocList();
            $notes = array();

            if($rows != null)
                for($i=0; $i<count($rows); $i++){
                    $notes[] = $this->processRawNote($rows[$i]['o_gedcom']);
                }
            
            return $notes;
        }

        
    }
?>
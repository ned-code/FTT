<?php
require_once 'class.data.php';
    class SourcesList extends DataType{

        public $core;

        function  __construct($core) {     
            require_once 'class.source.php';
            $this->core=$core;      
        }
        function count(){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT COUNT(*) FROM #__mb_sources');
            $rows = $db->loadAssocList();
            return $rows[0]['COUNT(*)'];
        }
        function get($id){
            $db =& JFactory::getDBO();
            $db->setQuery('SELECT * FROM #__mb_sources WHERE s_id="'.$id.'"');
            $rows = $db->loadAssocList();
            return $this->processRawSource($rows[0]['s_gedcom'], $id);
        }
        function save($source, $foreignKey){
            $db =& JFactory::getDBO();
            $db->setQuery('INSERT INTO #__mb_sources (s_id, s_file,s_gedcom) VALUES ("'.$source->Id.'","0","'.$this->getGedcomString($source, false).'")');
            $db->query();
            $db->setQuery('INSERT INTO #__mb_link (l_file, l_from, l_type, l_to) VALUES ("0", "'.$foreignKey.'", "SOUR", "'.$source->Id.'")');
            $db->query();            
        }
        function update($source){
            $db =& JFactory::getDBO();
            $req = "UPDATE #__mb_sources SET  s_gedcom='".$this->getGedcomString($source, false)."' WHERE s_id='".$source->Id."'";
            $db->setQuery($req);
            $db->query();
        }
        function delete($id){
            $db =& JFactory::getDBO();
            $db->setQuery('DELETE FROM #__mb_sources WHERE s_id="'.$id.'"');
            $db->query();
            $db->setQuery('DELETE FROM #__mb_link WHERE l_from="'.$id.'" or l_to="'.$id.'"');
            $db->query();
        }
        function getNewId(){
            $db =& JFactory::getDBO();
            $req = 'SELECT SUBSTRING(s_id,2) as id FROM #__mb_sources ORDER BY id+0 DESC';
            $db->setQuery($req);


            $rows = $db->loadAssocList();
            if($rows == null){
               $newid = 'S1' ;
            }else{
                $newid = 'S'.($rows[0]['id']+1) ;
            }
            return $newid;

        }

     

        function processRawSource($gedcomString, $source_id){
            $text = preg_replace ('/\r\n|\n|\r/', '|', $gedcomString);
            $lines = explode("|", $text);
            unset($lines[0]);
            $repository=""; $title=""; $publication=""; $author="";
         
            foreach ($lines as $line){
                if(strlen($line)>5){
                 
                    $fSpace = strpos($line, ' ');

                    $sSpace = strpos($line, ' ', $fSpace+1);

                    $level = substr($line, 0, $fSpace);
                    $id = substr($line, $fSpace+1, $sSpace - $fSpace -1);
                    $value = substr($line, $sSpace+1);

                    switch ($id){
                        case 'AUTH':{
                            $author = $value;
                            break;
                        }
                        case 'REPO':{
                            $repository = substr($value, 1, strlen($value)-2);
                            break;
                        }
                        case 'TITL':{
                            $title = $value;
                            break;
                        }
                        case 'PUBL':{
                            $publication = $value;
                            break;
                        }
                    }
                }
            }
            return new Source($source_id, $title, $author,$publication,$repository , '0');
        }
        

        //is standart=true returns valid Gedcom record, else returns simplified gedcom string used in program logic
        function _processStringForGedcom($level, $text){
             $maxLength = 70;

                $pos = $maxLength;
                $str = '';
                $line = $text;
                $i = 0;
                    do{
                    // Split on a non-space (standard gedcom behaviour)
                        while ($pos && substr($line, $pos-1, 1)==' ') {
                                --$pos;
                        }
                        if (strlen($line) > 3&&$pos==strpos($line, ' ', 3)) {
                                // No non-spaces in the data! Can't split it
                                break;
                        }
                        $newrec.=(!$i ? '' : "\n$level CONC ").substr($line, 0, $pos);
                        $i++;
                       
                        $line= substr($line, $pos);
                    }while (strlen($line)>$maxLength);

                    $str = $newrec;
                    $str = preg_replace ( '/(\n\t){1,2}|(\n\n)/' , "\n{$level} CONT\n{$level} CONC " , $str);
                return $str;

        }
        function getGedcomString($source, $standart=true){
            if(!$standart){
                $gedcomString = $source->Level.' @'.$source->Id.'@ SOUR\n';
                $levels = $source->Level;
                $levels++;
                $gedcomString .= $levels.' AUTH '.$source->Author.'\n';
                $gedcomString .= $levels.' TITL '.$source->Title.'\n';
                $gedcomString .= $levels.' PUBL '.$source->Publication.'\n';
                $gedcomString .= $levels.' REPO @'.$source->Repository."@";
                return $gedcomString;
            }else{
             
                $str = '';
                $level = 1 + $source->Level;
                if($source != null){
                    $str = "{$source->Level} @{$source->Id}@ SOUR\n";
                    $str .= "{$level} AUTH ".$this->_processStringForGedcom(1+$level, $source->Author)."\n";
                    $str .= "{$level} TITL ".$this->_processStringForGedcom(1+$level, $source->Title)."\n";
                    $str .= "{$level} PUBL ".$this->_processStringForGedcom(1+$level, $source->Publication)."\n";
                    $str .= "{$level} REPO @{$source->Repository}@\n";
                }
                return $str;
            }
        }
        function getAllIds(){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_sources.s_id as id FROM #__mb_sources';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            return $rows;
        }
        function getLinkedSources($personId){
            $db =& JFactory::getDBO();

            $req = 'SELECT s_id, s_gedcom FROM #__mb_link
                    INNER JOIN #__mb_sources ON (#__mb_link.l_to = #__mb_sources.s_id)
                    WHERE  #__mb_link.l_from="'.$personId.'"';
                  //  echo $req;
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            $sources = array();
           // var_dump($rows);
            if($rows != null)
                foreach($rows as $row){
                    $sources[] = $this->processRawSource($row['s_gedcom'], $row['s_id']);
                }
            return $sources;
        }
       
    }
?>
<?php
require_once 'class.data.php';
    class MediaList extends DataType{
        
        public $core;

        function  __construct($core) {
            require_once 'class.media.php';
            $this->core=$core;
            
        }
        function getAvatarImage($id){
            $db =& JFactory::getDBO();
            $req = 'SELECT * FROM #__mb_link WHERE l_type="AVAT" AND l_from="'.$id.'" LIMIT 1';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return null;
            return $this->get($rows[0]['l_to']);
        }
        function setAvatarImage($persId, $imgId){
            $db =& JFactory::getDBO();
            $req = 'DELETE FROM #__mb_link WHERE l_type="AVAT" AND l_from="'.$persId.'" LIMIT 1';
            $db->setQuery($req);
            $db->query();
            $req = 'INSERT INTO #__mb_link (`l_from`, `l_type`, `l_to`) VALUES ("'.$persId.'", "AVAT", "'.$imgId.'")';
            $db->setQuery($req);
            $db->query();

        }
        function get($id){
            $db =& JFactory::getDBO();

            $req = 'SELECT * FROM #__mb_media WHERE m_id="'.$id.'" LIMIT 1';

            $db->setQuery($req);
          
            $rows = $db->loadAssocList();
           
            if($rows == 0)
                return null;
         
         // ($id, $filePath, $fileName, $description='', $type='', $date='',$isCirca='0', $photographer='', $source='', $tags = array(), $onPhoto=array()) {
            $rec = new Media($rows[0]['m_id'], $rows[0]['m_file'], $rows[0]['m_name'], $rows[0]['m_description'], $rows[0]['m_type'], $rows[0]['m_date'], $rows[0]['m_circa'], $rows[0]['m_photographer'], $rows[0]['m_source'], $this->core->tags->getAllRelatedTags($rows[0]['m_id']), $this->getLinkedIndividuals($rows[0]['m_id']));
         
         
            return $rec;
        }
        function getMediaByTag($tagname){
            $db =& JFactory::getDBO();
          
            $tag = $this->core->tags->getByName($tagname);
            if($tag != null){
                $req = 'SELECT #__mb_media.m_id as id FROM #__mb_taglink LEFT JOIN #__mb_media ON #__mb_taglink.media_id=#__mb_media.m_id WHERE #__mb_taglink.tag_id="'.$tag->Id.'"';
                $db->setQuery($req);
               
                $rows = $db->loadAssocList();
                $media = array();
                for($i = 0; $i < count($rows); $i++){
                    $media[] = $this->get($rows[$i]['id']);
                }
               
                return $media;
            }else return array();
      
        }
        function getLinkedIndividuals($mediaId){
            $db =& JFactory::getDBO();
            $req = 'SELECT * FROM #__mb_link WHERE l_to="'.$mediaId.'" and l_type="MEDI"';
            $db->setQuery($req);
            $rows = $db->loadAssocList();
           
            if($rows == null)
                return array();
            $inds = array();
           
            foreach ($rows as $row){
                $inds[] = $row['l_from'];
            }
            return $inds;
        }
        function clearLinks($mediaId){
             $db =& JFactory::getDBO();
             $req = 'DELETE FROM #__mb_link WHERE l_to="'.$mediaId.'" AND l_type="MEDI"';

             $db->setQuery($req);
             $db->query();
        }
        function link($mediaId, $foreignKey){
             $db =& JFactory::getDBO();
             $req = 'INSERT INTO #__mb_link (`l_file`, `l_from`, `l_type`, `l_to`) VALUES (0, "'.$foreignKey.'", "MEDI", "'.$mediaId.'")';
             $db->setQuery($req);
            // var_dump($req);
             $db->query();
        }
        function getMediaByGedId($gedid, $search="", $category=""){
            $db =& JFactory::getDBO();
            $tagsearch = null;
            $req = 'SELECT #__mb_media.* FROM `#__mb_link` LEFT JOIN #__mb_media ON #__mb_link.l_to=#__mb_media.m_id WHERE #__mb_link.l_from ="'.$gedid.'" AND #__mb_link.l_type = "MEDI" ';
            if($search != ""){
                $req .= " AND (m_name LIKE '%".$search."%' OR m_date LIKE '%".$search."%' OR m_description LIKE '%".$search."%' OR m_photographer LIKE '%".$search."%' OR  m_source LIKE '%".$search."%' )";
                $tagsearch = $this->getMediaByTag($search);
            }
            if($category != ""){
                $expr = "";
                switch($category){
                    case 'all':
                    break;
                    case 'self':
                        $expr = "MID(`m_type`,1,1)='1'";
                    break;
                    case 'family':
                        $expr = "MID(`m_type`,2,1)='1'";
                    break;
                    case 'other':
                        $expr = "MID(`m_type`,3,1)='1'";
                    break;
                }
                if($expr != "")
                    $req .= " AND ".$expr;
            }

            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            $media = array();
            foreach($rows as $row){
                $media[] = new Media($row['m_id'], $row['m_file'], $row['m_name'], $row['m_description'], $row['m_type'], $row['m_date'], $row['m_circa'], $row['m_photographer'], $row['m_source'], $this->core->tags->getAllRelatedTags($row['m_id']), $this->getLinkedIndividuals($row['m_id']));
            }
            if($tagsearch != null){
                $media = array_merge($media , $tagsearch);
            }
            return $media;
            
        }
        function getMediaPath(){
            $jspath = $this->core->core->getRootDirectory()."/components/com_manager/media";
            return $jspath;
        }
        function save($foreignkey, $filepath, $name){
            if(is_file($filepath)){    
                $db =& JFactory::getDBO();
                $req = 'INSERT INTO #__mb_media (`m_id`, `m_type`, `m_name`,`m_date`, `m_circa`,`m_description`, `m_photographer`,`m_source`) VALUES ( "","000","'.$name.'","", "0", "", "", "")';
                $db->setQuery($req);
                $db->query();

                $req = 'select LAST_INSERT_ID()';
                $db->setQuery($req);
                $rows = $db->loadAssocList();
                $id = $rows[0]['LAST_INSERT_ID()'];

                $extension = explode('.', $name);
                $extension = $extension[count($extension)-1];
          
                $path = $this->core->core->getAbsoluteRootPath().DS."components".DS."com_manager".DS."media".DS;
                if(!is_dir($this->core->core->getAbsoluteRootPath().DS."components".DS."com_manager".DS."media"))
                        mkdir($this->core->core->getAbsoluteRootPath().DS."components".DS."com_manager".DS."media");

                if(  copy($filepath, $path.$id.'.'.$extension)){
                    $jspath = $this->getMediaPath();
                    $req = 'UPDATE #__mb_media SET m_file="'.$jspath.'/'.$id.'.'.$extension.'" WHERE m_id="'.$id.'"';

                   
                    $db->setQuery($req);
                    $db->query();

                  
                    $this->link($id, $foreignkey);
                    return true;
                }
                else{
                    $req = 'DELETE FROM #__mb_media WHERE m_id="'.$id.'"';
                    $db->setQuery($req);
                    $db->query();
                    return false;

                }
            }
        }

        function update($media){
            
            $db =& JFactory::getDBO();
            $req = 'UPDATE #__mb_media SET m_type="'.$media->Type.'", m_type="'.$media->Type.'", m_date="'.$media->Date.'", m_circa="'.$media->isCirca.'",
                    m_description="'.$media->Description.'", m_photographer="'.$media->Photographer.'", m_source="'.$media->Source.'" WHERE m_id="'.$media->Id.'"';
            //var_dump($req);
            $db->setQuery($req);
            $db->query();
            $this->core->tags->clearRecordsRelations($media->Id);
          

            foreach($media->Tags as $tag){
                $t = $this->core->tags->getByName($tag->Name);
            
                if($t == null){
                   
                    $id = $this->core->tags->save($tag->Name);
             
                    $this->core->tags->link($id, $media->Id);
                }else{
                    $this->core->tags->link($t->Id, $media->Id);
                }
            }
            $this->clearLinks($media->Id);
            foreach($media->PeopleOnPhoto as $peopl){
                $this->link($media->Id, $peopl);
            }
           
        }
        function delete($id){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_media.m_name FROM #__mb_media WHERE m_id ="'.$id.'"';
            $db->setQuery($req);

            $rows = $db->loadAssocList();

            $extension = explode('.', $rows[0]['m_name']);
                $extension = $extension[count($extension)-1];
            $req = 'DELETE FROM #__mb_media WHERE m_id="'.$id.'"';
                    $db->setQuery($req);
                    $db->query();
            if(is_file($this->core->core->getAbsoluteRootPath()."/components/com_manager/media/".$id.'.'.$extension)){
                unlink($this->core->core->getAbsoluteRootPath()."/components/com_manager/media/".$id.'.'.$extension);
            }
            $this->clearLinks($id);
            $this->core->tags->clearRecordsRelations($id);

        }
        function getNewId(){
          

        }
        function getAllIds(){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_media.m_id as id FROM #__mb_media';
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            return $rows;
        }
        function serializeMediaInfo($media){

            $str = '{"name":"'.$media->FileName.'","type":"'.$media->Type.'","date":"'.$media->Date.'","circa":"'.$media->isCirca.'"';
            $str .= ',"description":"'.mysql_real_escape_string($media->Description).'","photographer":"'.mysql_real_escape_string($media->Photographer).'","source":"'.mysql_real_escape_string($media->Source).'"';
            $str .=  ',"tags":[';
            if($media->Tags != null)
                foreach ($media->Tags as $tag){
                    $str .= '{"id":"'.$tag->Id.'","name":"'.$tag->Name.'"},';
                }
            if(count($media->Tags))
                 $str = substr($str, 0, strlen($str)-1);
            $str .= ']}';
          
            return $str;
        }
        function prepareStringForGedcom($level, $text){
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
                     $newrec.=($line != '' ?("\n".$level.' CONC '.substr($line, 0)):'');
                    $str = $newrec;
                   
            //        $str = preg_replace ( '/(\n\t){1,2}|(\n\n)/' , "\n{$level} CONT\n{$level} CONC " , $str);
                return $str;
        }
        function getGedcomString($id){
            $media = $this->get($id);
            if($media != null){
                $pos = strrpos($media->FileName, '.');
                $ext = '';
                if($pos != -1)
                   $ext = substr($media->FileName, $pos+1);
                $str = "0 @{$media->Id}@ OBJE\n";
                $str .= "1 FORM {$ext}\n";
                $str .= "1 TILT {$media->FileName}\n";
                $str .= "1 FILE ".$id.'.'.$ext."\n";
                $str .= "1 NOTE \n";
                $str .= "2 CONC ".$this->prepareStringForGedcom(2, $this->serializeMediaInfo($media));
            }
            return $str."\n";
        }
        function count(){
            $db =& JFactory::getDBO();
            $req = 'SELECT COUNT(*) FROM #__mb_media';
           
         
            $db->setQuery($req);
            
            $rows = $db->loadAssocList();

            return $rows[0]['COUNT(*)'];
        }


        
    }
?>
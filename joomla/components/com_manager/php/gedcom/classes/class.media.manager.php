<?php
class MediaList{
        public $core;
        function  __construct($core) {
            require_once 'class.media.php';
            $this->core=$core;
            $this->db = & JFactory::getDBO();
        }
        function getAvatarImage($id){
            $db =& JFactory::getDBO();
            $req = $this->core->sql('SELECT * FROM #__mb_media_link WHERE type="AVAT" AND gid=? LIMIT 1', $id);
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return null;
            return $this->get($rows[0]['mid']);
        }
        function setAvatarImage($persId, $imgId){
            $db =& JFactory::getDBO();
            $req = $this->core->sql('DELETE FROM #__mb_media_link WHERE type="AVAT" AND gid=? LIMIT 1', $persId);
            $db->setQuery($req);
            $db->query();
            $req = $this->core->sql('INSERT INTO #__mb_media_link (`gid`, `type`, `mid`) VALUES (?, "AVAT", ?)', $persId, $imgId);
            $db->setQuery($req);
            $db->query();
        }
        function get($id){
            $db =& JFactory::getDBO();
            $req = $this->core->sql('SELECT * FROM #__mb_medias WHERE id=? LIMIT 1', $id);
            $db->setQuery($req);
         
            $rows = $db->loadAssocList();
            
            if($rows == 0)
                return null;
                       
            $media = new Media;
            $media->Id = $id;
            $media->Form = $rows[0]['form'];
            $media->Title = $rows[0]['title'];
            $media->Path = $rows[0]['path'];
         
            return $media;
        }
        //function getMediaByTag($tagname){
//            $db =& JFactory::getDBO();
//          
//            $tag = $this->core->tags->getByName($tagname);
//            if($tag != null){
//                $req = 'SELECT #__mb_media.m_id as id FROM #__mb_taglink LEFT JOIN #__mb_media ON #__mb_taglink.media_id=#__mb_media.m_id WHERE #__mb_taglink.tag_id="'.$tag->Id.'"';
//                $db->setQuery($req);
//               
//                $rows = $db->loadAssocList();
//                $media = array();
//                for($i = 0; $i < count($rows); $i++){
//                    $media[] = $this->get($rows[$i]['id']);
//                }
//               
//                return $media;
//            }else return array();
//      
//        }
        //function getLinkedIndividuals($mediaId){
//            $db =& JFactory::getDBO();
//            $req = 'SELECT * FROM #__mb_link WHERE l_to="'.$mediaId.'" and l_type="MEDI"';
//            $db->setQuery($req);
//            $rows = $db->loadAssocList();
//           
//            if($rows == null)
//                return array();
//            $inds = array();
//           
//            foreach ($rows as $row){
//                $inds[] = $row['l_from'];
//            }
//            return $inds;
//        }
        function clearLinks($mediaId){
             $db =& JFactory::getDBO();
             $req = 'DELETE FROM #__mb_media_link WHERE `mid`='.$mediaId;
             $db->setQuery($req);
             $db->query();
        }
        function link($mediaId, $foreignKey){
             $db =& JFactory::getDBO();
             $req = 'INSERT INTO #__mb_media_link (`gid`, `mid`) VALUES ("'.$foreignKey.'","'.$mediaId.'")';
             $db->setQuery($req);
            // var_dump($req);
             $db->query();
        }
        function getMediaByGedId($gedid){
            $db =& JFactory::getDBO();
           
            $req = 'SELECT #__mb_medias.* FROM `#__mb_media_link` LEFT JOIN #__mb_medias ON #__mb_media_link.mid=#__mb_medias.id WHERE #__mb_media_link.gid ='.$gedid;
       
            $db->setQuery($req);

            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            $media = array();
            foreach($rows as $row){                
                  $med->Id = $row['id'];
                  $med->Form = $row['form'];
                  $med->Title = $row['title'];
                  $med->Path = $row['path'];
                  $media[] = $med;                 
            }
            return $media;         
        }    
        function getMediaPath(){
            $jspath = JURI::base(true)."/components/com_manager/media";
            return $jspath;
        }      
        function save($foreignkey, $filepath, $name){
            if(is_file($filepath)){   
            	$extension = explode('.', $name);
                $extension = $extension[count($extension)-1];
                 
                $db =& JFactory::getDBO();
                $req = 'INSERT INTO #__mb_medias (`form`, `title`) VALUES ("'.$extension.'","'.$name.'")';
                $db->setQuery($req);
                $db->query();

                $req = 'select LAST_INSERT_ID()';
                $db->setQuery($req);
                $rows = $db->loadAssocList();
                $id = $rows[0]['LAST_INSERT_ID()'];
                
            	  $path = $this->core->core->getAbsoluteRootPath().DS."components".DS."com_manager".DS."media".DS;
                if(!is_dir($this->core->core->getAbsoluteRootPath().DS."components".DS."com_manager".DS."media"))
                        mkdir($this->core->core->getAbsoluteRootPath().DS."components".DS."com_manager".DS."media");  
                
                if(copy($filepath, $path.$id.'.'.$extension)){
                    $jspath = $this->getMediaPath();
                    $req = 'UPDATE #__mb_medias SET path="'.$jspath.'/'.$id.'.'.$extension.'" WHERE id="'.$id.'"';
                                   
                    $db->setQuery($req);
                    $db->query();
                 
                    $this->link($id, $foreignkey);
                    return $id;
                }
                else{
                    $req = 'DELETE FROM #__mb_medias WHERE id="'.$id.'"';
                    $db->setQuery($req);
                    $db->query();
                    return false;

                }                                                                                               
            }
        }

        function update($media){
            
            $db =& JFactory::getDBO();
            $req = 'UPDATE #__mb_medias SET form="'.$media->Form.'", title="'.$media->Title.'", path="'.$media->Path.'" WHERE id="'.$media->Id.'"';
            //var_dump($req);
            $db->setQuery($req);
            $db->query();            
           // $this->core->tags->clearRecordsRelations($media->Id);
//          
//
//            foreach($media->Tags as $tag){
//                $t = $this->core->tags->getByName($tag->Name);
//            
//                if($t == null){
//                   
//                    $id = $this->core->tags->save($tag->Name);
//             
//                    $this->core->tags->link($id, $media->Id);
//                }else{
//                    $this->core->tags->link($t->Id, $media->Id);
//                }
//            }
//            $this->clearLinks($media->Id);
//            foreach($media->PeopleOnPhoto as $peopl){
//                $this->link($media->Id, $peopl);
//            }
           
        }
        function delete($id){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_medias.title, path FROM #__mb_medias WHERE id ="'.$id.'"';
            $db->setQuery($req);
           
            $rows = $db->loadAssocList();
            $extension = explode('.', $rows[0]['title']);
                $extension = $extension[count($extension)-1];
            $req = 'DELETE FROM #__mb_medias WHERE id="'.$id.'"';
                    $db->setQuery($req);
                    $db->query();
                
            $path=explode("/",$rows[0]['path']);
            $path = $path[count($path)-1];       
            if(is_file($this->core->core->getAbsoluteRootPath()."/components/com_manager/media/".$id.'.'.$extension)){
                unlink($this->core->core->getAbsoluteRootPath()."/components/com_manager/media/".$id.'.'.$extension);
            }
            elseif (is_file($this->core->core->getAbsoluteRootPath()."/components/com_manager/media/".$path)){
              unlink($this->core->core->getAbsoluteRootPath()."/components/com_manager/media/".$path);           
            }            
            $this->clearLinks($id);
            //$this->core->tags->clearRecordsRelations($id);
        }
//        function getNewId(){
//          
//
//        }
//        function getAllIds(){
//            $db =& JFactory::getDBO();
//            $req = 'SELECT #__mb_media.m_id as id FROM #__mb_media';
//            $db->setQuery($req);
//
//            $rows = $db->loadAssocList();
//            if($rows == null)
//                return array();
//            return $rows;
//        }
//        function serializeMediaInfo($media){
//
//            $str = '{"name":"'.$media->FileName.'","type":"'.$media->Type.'","date":"'.$media->Date.'","circa":"'.$media->isCirca.'"';
//            $str .= ',"description":"'.mysql_real_escape_string($media->Description).'","photographer":"'.mysql_real_escape_string($media->Photographer).'","source":"'.mysql_real_escape_string($media->Source).'"';
//            $str .=  ',"tags":[';
//            if($media->Tags != null)
//                foreach ($media->Tags as $tag){
//                    $str .= '{"id":"'.$tag->Id.'","name":"'.$tag->Name.'"},';
//                }
//            if(count($media->Tags))
//                 $str = substr($str, 0, strlen($str)-1);
//            $str .= ']}';
//          
//            return $str;
//        }
//        function prepareStringForGedcom($level, $text){
//            $maxLength = 70;
//                $pos = $maxLength;
//                $str = '';
//                $line = $text;
//                $i = 0;
//                    do{
//                    // Split on a non-space (standard gedcom behaviour)
//                        while ($pos && substr($line, $pos-1, 1)==' ') {
//                                --$pos;
//                        }
//                        if (strlen($line) > 3&&$pos==strpos($line, ' ', 3)) {
//                                // No non-spaces in the data! Can't split it
//                                break;
//                        }
//                        $newrec.=(!$i ? '' : "\n$level CONC ").substr($line, 0, $pos);
//                        $i++;
//
//                        $line= substr($line, $pos);
//                    }while (strlen($line)>$maxLength);
//                     $newrec.=($line != '' ?("\n".$level.' CONC '.substr($line, 0)):'');
//                    $str = $newrec;
//                   
//            //        $str = preg_replace ( '/(\n\t){1,2}|(\n\n)/' , "\n{$level} CONT\n{$level} CONC " , $str);
//                return $str;
//        }
//        function getGedcomString($id){
//            $media = $this->get($id);
//            if($media != null){
//                $pos = strrpos($media->FileName, '.');
//                $ext = '';
//                if($pos != -1)
//                   $ext = substr($media->FileName, $pos+1);
//                $str = "0 @{$media->Id}@ OBJE\n";
//                $str .= "1 FORM {$ext}\n";
//                $str .= "1 TILT {$media->FileName}\n";
//                $str .= "1 FILE ".$id.'.'.$ext."\n";
//                $str .= "1 NOTE \n";
//                $str .= "2 CONC ".$this->prepareStringForGedcom(2, $this->serializeMediaInfo($media));
//            }
//            return $str."\n";
//        }
//        function count(){
//            $db =& JFactory::getDBO();
//            $req = 'SELECT COUNT(*) FROM #__mb_media';
//           
//         
//            $db->setQuery($req);
//            
//            $rows = $db->loadAssocList();
//
//            return $rows[0]['COUNT(*)'];
//        }
//

        
    }
?>
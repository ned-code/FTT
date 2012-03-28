<?php
class MediaList{
        function  __construct() {
            require_once 'class.media.php';
            $this->db = new JMBAjax();
        }
        function getAvatarImage($id){
            $this->db->setQuery('SELECT * FROM #__mb_media_link WHERE type="AVAT" AND gid=? LIMIT 1', $id);

            $rows = $this->db->loadAssocList();
            if($rows == null)
                return null;
            return $this->get($rows[0]['mid']);
        }
        function setAvatarImage($persId, $imgId){
            $this->db->setQuery("DELETE FROM #__mb_media_link WHERE type='AVAT' AND gid=? LIMIT 1", $persId);
            $this->db->query();
            $this->db->setQuery("INSERT INTO #__mb_media_link (`gid` ,`mid` ,`type`) VALUES (?,?,'AVAT')", $persId, $imgId);
            $this->db->query();
        }
        function get($id){
            $this->db->setQuery("SELECT * FROM #__mb_medias WHERE id=? LIMIT 1", $id);
            $rows = $this->db->loadAssocList();
           
            if($rows == 0)
                return null;
                       
            $media = new Media;
            $media->Id = $id;
            $media->Type = $rows[0]['form'];
            $media->Title = $rows[0]['title'];
            $media->FilePath = $rows[0]['path'];
            $media->Size = $rows[0]['size'];
         
            return $media;
        }
        function clearLinks($mediaId){
             $this->db->setQuery('DELETE FROM #__mb_media_link WHERE `mid`=?',$mediaId);
             $this->db->query();
        }
        function link($mediaId, $foreignKey){
             $this->db->setQuery("INSERT INTO #__mb_media_link (`gid`, `mid`, `type`) VALUES (?,?,'IMAG')",$foreignKey,$mediaId);
             $this->db->query();
        }
        function getMediaByGedId($gedid){          
            $this->db->setQuery("SELECT #__mb_medias.* FROM `#__mb_media_link` LEFT JOIN #__mb_medias ON #__mb_media_link.mid=#__mb_medias.id WHERE #__mb_media_link.gid =? AND #__mb_media_link.type='IMAG'",$gedid);
            $rows = $this->db->loadAssocList();
            if($rows == null)
                return array();
            $media = array();
            foreach($rows as $row){                
                  $med = new Media();
                  $med->Id = $row['id'];
                  $med->Type = $row['form'];
                  $med->Title = $row['title'];
                  $med->FilePath = $row['path'];
                  $media[] = $med;                 
            }
            return $media;         
        }
        
        function getMediaPath(){
            $jspath = JPATH_ROOT.DS."components".DS."com_manager".DS."media";
            return $jspath;
        }
        
        function save($foreignkey, $filepath, $name, $size=null){
            if(is_file($filepath)){   
            	$extension = explode('.', $name);
                $extension = $extension[count($extension)-1];

                $this->db->setQuery('INSERT INTO #__mb_medias (`form`, `title`,`size`) VALUES (?,?,?)',$extension,$name,$size);
                $this->db->query();

                $id = $this->db->insertid();
                $jspath = $this->getMediaPath();
                
                if(!is_dir($jspath)){
                	mkdir($jspath);
                }

                $file = $id.'.'.$extension;
                $path = DS."components".DS."com_manager".DS."media".DS.$file;
            	if(copy($filepath, $jspath.DS.$file)){
                    $this->db->setQuery('UPDATE #__mb_medias SET path=? WHERE id=?', $path, $id);
                    $this->db->query();
                    $this->link($id, $foreignkey);
                    return $id;
                }
                else{
                    $this->db->setQuery('DELETE FROM #__mb_medias WHERE id=?', $id);
                    $this->db->query();
                    return false;
                }                                                                                               
            }
        }

        function update($media){    
            $this->db->setQuery('UPDATE #__mb_medias SET form=?, title=?, path=? WHERE id=?', $media->Form, $media->Title, $media->Path, $media->Id);
            $this->db->query();  
        }
        function delete($id){
            $this->db->setQuery('SELECT #__mb_medias.title, path FROM #__mb_medias WHERE id =?', $id);
            $rows = $this->db->loadAssocList();
            if($rows==null) return false;
            $extension = explode('.', $rows[0]['title']);
            $extension = $extension[count($extension)-1];
            $this->db->setQuery('DELETE FROM #__mb_medias WHERE id=?', $id);
            $this->db->query();
                
            $path=explode("/",$rows[0]['path']);
            $path = $path[count($path)-1];       
            if(is_file(JPATH_ROOT."/components/com_manager/media/".$id.'.'.$extension)){
                unlink(JPATH_ROOT."/components/com_manager/media/".$id.'.'.$extension);
            }
            elseif (is_file(JPATH_ROOT."/components/com_manager/media/".$path)){
              unlink(JPATH_ROOT."/components/com_manager/media/".$path);           
            }            
            $this->clearLinks($id);
            return true;
        }
        public function getMediaList($tree_id, $gedcom_id = false){
        	$sql_string = "SELECT media.id as media_id, media.form, media.title, 
        				media.path, m_links.type, m_links.gid as gedcom_id,
        				media.size
				FROM #__mb_medias as media
				LEFT JOIN #__mb_media_link as m_links ON m_links.mid = media.id
				LEFT JOIN #__mb_tree_links as t_links ON t_links.individuals_id = m_links.gid";
		if($gedcom_id) {
			$sql_string .= " WHERE t_links.tree_id = ? and t_links.individuals_id = ?";
			$this->db->setQuery($sql_string, $tree_id, $gedcom_id);
		} else {
			$sql_string .= " WHERE t_links.tree_id = ?";
			$this->db->setQuery($sql_string, $tree_id);
		}
		$rows = $this->db->loadAssocList('gedcom_id');
        	return $rows;	
        }
        
        
        
        
    }
?>
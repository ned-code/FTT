<?php
class MediaList{
        private $ajax;
        private $path;
        private $size;

        public function  __construct(&$ajax) {
            $this->ajax = $ajax;
            $this->path = JPATH_ROOT."/components/com_manager/media/tmp/";
            $this->size = array(
                array('32','32'),
                array('72','80'),
                array('22','22'),
                array('108','120'),
                array('81','90'),
                array('50','50')
            );
        }
        public function getAvatarImage($id){
            $this->ajax->setQuery('SELECT * FROM #__mb_media_link WHERE type="AVAT" AND gid=? LIMIT 1', $id);

            $rows = $this->ajax->loadAssocList();
            if($rows == null)
                return null;
            return $this->get($rows[0]['mid']);
        }
        public function setAvatarImage($persId, $imgId){
            $this->ajax->setQuery("DELETE FROM #__mb_media_link WHERE type='AVAT' AND gid=? LIMIT 1", $persId);
            $this->ajax->query();
            $this->ajax->setQuery("INSERT INTO #__mb_media_link (`gid` ,`mid` ,`type`) VALUES (?,?,'AVAT')", $persId, $imgId);
            $this->ajax->query();
        }
        public function get($id){
            $this->ajax->setQuery("SELECT * FROM #__mb_medias WHERE id=? LIMIT 1", $id);
            $rows = $this->ajax->loadAssocList();
           
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
        public function clearLinks($mediaId){
             $this->ajax->setQuery('DELETE FROM #__mb_media_link WHERE `mid`=?',$mediaId);
             $this->ajax->query();
        }
        public function link($mediaId, $foreignKey){
             $this->ajax->setQuery("INSERT INTO #__mb_media_link (`gid`, `mid`, `type`) VALUES (?,?,'IMAG')",$foreignKey,$mediaId);
             $this->ajax->query();
        }
        public function getMediaByGedId($gedid){
            $this->ajax->setQuery("SELECT #__mb_medias.* FROM `#__mb_media_link` LEFT JOIN #__mb_medias ON #__mb_media_link.mid=#__mb_medias.id WHERE #__mb_media_link.gid =? AND #__mb_media_link.type='IMAG'",$gedid);
            $rows = $this->ajax->loadAssocList();
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
        
        public function getMediaPath(){
            $jspath = JPATH_ROOT.DS."components".DS."com_manager".DS."media";
            return $jspath;
        }

        private function getFileType($filePath){
            $size = getimagesize($filePath);
            $type = explode('/', $size['mime']);
            return $type[1];
        }

        public function save($foreignkey, $filepath, $name, $size=null){
            if(is_file($filepath)){   
                $fileType = $this->getFileType($filepath);

                $this->ajax->setQuery('INSERT INTO #__mb_medias (`form`, `title`,`size`) VALUES (?,?,?)', $fileType,$name,$size);
                $this->ajax->query();

                $id = $this->ajax->insertid();
                $jspath = $this->getMediaPath();
                
                if(!is_dir($jspath)){
                	mkdir($jspath);
                }

                $file = $id.'.'.$fileType;
                $path = DS."components".DS."com_manager".DS."media".DS.$file;
            	if(copy($filepath, $jspath.DS.$file)){
                    $this->ajax->setQuery('UPDATE #__mb_medias SET path=? WHERE id=?', $path, $id);
                    $this->ajax->query();
                    $this->link($id, $foreignkey);
                    return $id;
                }
                else{
                    $this->ajax->setQuery('DELETE FROM #__mb_medias WHERE id=?', $id);
                    $this->ajax->query();
                    return false;
                }                                                                                               
            }
        }

        public function update($media){
            $this->ajax->setQuery('UPDATE #__mb_medias SET form=?, title=?, path=? WHERE id=?', $media->Form, $media->Title, $media->Path, $media->Id);
            $this->ajax->query();
        }
        public function delete($id){
            $this->ajax->setQuery('SELECT #__mb_medias.title, path FROM #__mb_medias WHERE id =?', $id);
            $rows = $this->ajax->loadAssocList();
            if($rows==null) return false;
            $extension = explode('.', $rows[0]['title']);
            $extension = $extension[count($extension)-1];
            $this->ajax->setQuery('DELETE FROM #__mb_medias WHERE id=?', $id);
            $this->ajax->query();
                
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
			$this->ajax->setQuery($sql_string, $tree_id, $gedcom_id);
		} else {
			$sql_string .= " WHERE t_links.tree_id = ?";
			$this->ajax->setQuery($sql_string, $tree_id);
		}
		$rows = $this->ajax->loadAssocList('gedcom_id');
        	return $rows;	
        }

        private function getHashedNames($media_id, $type){
            $names = array();
            $sizes = $this->size;
            foreach($sizes as $size){
                $name = md5(implode("_", array( "M".$media_id, $size[0], $size[1])));
                $names[$name.'.'.$type] = $size[0].'_'.$size[1];
            }
            return $names;
        }

        public function getHashedImagesPath($tree_id, $media_id, $type){
            $path = $this->path.$tree_id.'/';
            $names = $this->getHashedNames($media_id, $type);
            $result = array();
            foreach($names as $key => $value){
                if(file_exists($path.$key)){
                    $result[$names[$key]] = $key;
                }
                $result['_tmp'][$names[$key]] = $key;
            }
            return $result;
        }
 }
?>
<?php
require_once 'class.data.php';
    class TagsList extends DataType{
        
        public $core;

        function  __construct($core) {
            require_once 'class.tag.php';
            $this->core=$core;
            
        }
        
        function get($id){
            $db =& JFactory::getDBO();

            $req = 'SELECT * FROM #__mb_tag WHERE id="'.$id.'" LIMIT 1';
            $db->setQuery($req);
            $rows = $db->loadAssocList();
            if($rows == null)
                return null;
            $rec = new Tag($rows[0]['id'], $rows[0]['name']);
            return $rec;
        }
        function getByName($name){
             $db =& JFactory::getDBO();

            $req = 'SELECT * FROM #__mb_tag WHERE tag="'.$name.'" LIMIT 1';
            
            $db->setQuery($req);
            $rows = $db->loadAssocList();
            
            if($rows == null)
                return null;
            $rec = new Tag($rows[0]['id'], $rows[0]['tag']);
            return $rec;
        }
        function link($tagid, $foreignKey){
            $db =& JFactory::getDBO();
             $req = 'INSERT INTO #__mb_taglink (`media_id`, `tag_id`) VALUES ( "'.$foreignKey.'","'.$tagid.'")';
             $db->setQuery($req);
             $db->query();
        }
        function getAllRelatedTags($gedid){
            $db =& JFactory::getDBO();
            $req = 'SELECT #__mb_tag.* FROM #__mb_taglink
                        LEFT JOIN #__mb_tag ON #__mb_tag.id = #__mb_taglink.tag_id WHERE #__mb_taglink.media_id="'.$gedid.'"';
            $db->setQuery($req);
            $rows = $db->loadAssocList();
            if($rows == null)
                return array();
            $result;
            foreach($rows as $row){
                $result[] = new Tag($row['id'], $row['tag']);
            }


            return $result;
        }
        function clearRecordsRelations($gedrec){
            $db =& JFactory::getDBO();
            $req = 'DELETE FROM #__mb_taglink WHERE media_id="'.$gedrec.'"';
            $db->setQuery($req);
            $db->query();
        }
        function save($name, $id=''){
            if($name != ''){
            $db =& JFactory::getDBO();

            $req = 'INSERT INTO #__mb_tag (`id`, `tag`) VALUES ( "'.$id.'","'.$name.'")';
      
            $db->setQuery($req);
            $db->query();
            if($id == ''){
                $req = 'select LAST_INSERT_ID()';

                $db->setQuery($req);
                $rows = $db->loadAssocList();

                return $rows[0]['LAST_INSERT_ID()'];
            }else
                return $id;
            }return null;
        }
        
        function delete($id){
           
        }
        function getNewId(){
            

        }
        
        function count(){
            $db =& JFactory::getDBO();
            $req = 'SELECT COUNT(*) FROM #__mb_tags';
           
          //  echo $req;
            $db->setQuery($req);
            
            $rows = $db->loadAssocList();

            return $rows[0]['COUNT(*)'];
        }

       

        
    }
?>
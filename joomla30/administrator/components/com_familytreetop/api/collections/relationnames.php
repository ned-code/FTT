<?php

class FamilyTreeTopApiCollectionRelationNames {
    public function create(){
        return array('response'=>'relations:create');
    }
    public function read(){
        $db = JFactory::getDbo();
        $sql = "SELECT * FROM #__familytreetop_relations WHERE 1";
        $db->setQuery($sql);
        return $db->loadObjectList();
    }
    public function update(){
        return array('response'=>'relations:update');
    }
    public function destroy(){
        return array('response'=>'relations:destroy');
    }


}
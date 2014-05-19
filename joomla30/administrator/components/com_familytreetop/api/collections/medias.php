<?php

class FamilyTreeTopApiCollectionMedias {
    public function create(){
        return array('response'=>'medias:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT m.*, ml.id as link_id, ml.gedcom_id, ml.role
                FROM #__familytreetop_medias as m, #__familytreetop_media_links as ml, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE t.id = l.tree_id AND ml.gedcom_id = l.id AND ml.media_id = m.id AND t.id = " . $tree_id;
        $db->setQuery($sql);
        $rows = $db->loadObjectList();
        foreach($rows as $index => $row){
            $rows[$index]->id = (int)$row->id;
            $rows[$index]->gedcom_id = (int)$row->gedcom_id;
        }
        return $rows;
    }
    public function update(){
        return array('response'=>'medias:update');
    }
    public function destroy(){
        return array('response'=>'medias:destroy');
    }


}
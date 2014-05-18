<?php

class FamilyTreeTopApiCollectionChildren {

    public function create(){
        return array('response'=>'children:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT c.*
                FROM #__familytreetop_childrens as c, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE c.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id;
        $db->setQuery($sql);
        $rows = $db->loadObjectList();
        foreach($rows as $index => $row){
            $rows[$index]->id = (int)$row->id;
            $rows[$index]->gedcom_id = (int)$row->gedcom_id;
            $rows[$index]->family_id = (int)$row->family_id;
        }
        return $rows;
    }
    public function update(){
        return array('response'=>'children:update');
    }
    public function destroy(){
        return array('response'=>'children:destroy');
    }


}
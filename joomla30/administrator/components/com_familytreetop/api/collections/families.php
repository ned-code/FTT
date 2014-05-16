<?php

class FamilyTreeTopApiCollectionFamilies {
    public function create(){
        return array('response'=>'families:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT f.*
                FROM #__familytreetop_families as f, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 1 AND f.family_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id;
        $db->setQuery($sql);
        return $db->loadObjectList();
    }
    public function update(){
        return array('response'=>'families:update');
    }
    public function destroy(){
        return array('response'=>'families:destroy');
    }


}
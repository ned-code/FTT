<?php

class FamilyTreeTopApiCollectionNames {
    public function create(){
        return array('response'=>'names:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT n.*
                FROM #__familytreetop_individuals as i,#__familytreetop_names as n,  #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 0 AND i.gedcom_id = l.id AND l.tree_id = t.id AND n.gedcom_id = i.gedcom_id AND t.id = ". $tree_id;
        $db->setQuery($sql);
        return $db->loadObjectList();
    }
    public function update(){
        return array('response'=>'names:update');
    }
    public function destroy(){
        return array('response'=>'names:destroy');
    }


}
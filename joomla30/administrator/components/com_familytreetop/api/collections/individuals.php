<?php

class FamilyTreeTopApiCollectionIndividuals {
    public function create(){
        return array('response'=>'individuals:members');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $treeId = $app->input->get('treeId', false);
        if(!$treeId) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT i.id as id, i.gedcom_id, i.creator_id, i.gender, i.family_id, i.create_time, i.change_time
                FROM #__familytreetop_individuals as i, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 0 AND i.gedcom_id = l.id AND l.tree_id = t.id AND t.id = ". $treeId;
        $db->setQuery($sql);
        return $db->loadObjectList();
    }
    public function update(){
        return array('response'=>'individuals:members');
    }
    public function destroy(){
        return array('response'=>'individuals:members');
    }

}
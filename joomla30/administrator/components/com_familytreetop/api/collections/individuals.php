<?php

class FamilyTreeTopApiCollectionIndividuals {
    public function create(){
        return array('response'=>'individuals:members');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT i.id as id, i.gedcom_id, i.creator_id, i.gender, i.family_id, i.create_time, i.change_time
                FROM #__familytreetop_individuals as i, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE l.type = 0 AND i.gedcom_id = l.id AND l.tree_id = t.id AND t.id = ". $tree_id;
        $db->setQuery($sql);
        $rows = $db->loadObjectList();
        foreach($rows as $index => $row){
            $rows[$index]->id = (int)$row->id;
            $rows[$index]->gedcom_id = (int)$row->gedcom_id;
            $rows[$index]->gender = (int)$row->gender;
            $rows[$index]->family_id = (int)$row->family_id;
        }
        return $rows;
    }
    public function update(){
        return array('response'=>'individuals:members');
    }
    public function destroy(){
        return array('response'=>'individuals:members');
    }

}
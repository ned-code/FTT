<?php

class FamilyTreeTopApiCollectionRelations {
    public function create(){
        return array('response'=>'relations:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        $user_gedcom_id = $app->input->get('user_gedcom_id', false);
        if(!$tree_id || !$user_gedcom_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT r.id, r.relation_id, r.gedcom_id, r.target_id, r.json, r.in_law, r.by_spouse, r.change_time
                    FROM #__familytreetop_relation_links as r, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                    WHERE r.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id . " AND r.gedcom_id = " . $user_gedcom_id;
        $db->setQuery($sql);
        $rows = $db->loadObjectList();
        foreach($rows as $index => $row){
            $rows[$index]->id = (int)$row->id;
            $rows[$index]->gedcom_id = (int)$row->gedcom_id;
            $rows[$index]->by_spouse = (int)$row->by_spouse;
            $rows[$index]->in_law = (int)$row->in_law;
            $rows[$index]->relation_id = (int)$row->relation_id;
            $rows[$index]->target_id = (int)$row->target_id;
        }
        return $rows;
    }
    public function update(){
        return array('response'=>'relations:update');
    }
    public function destroy(){
        return array('response'=>'relations:destroy');
    }


}
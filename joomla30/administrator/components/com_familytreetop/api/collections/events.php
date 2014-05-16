<?php

class FamilyTreeTopApiCollectionEvents {
    public function create(){
        return array('response'=>'events:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT e.*
                FROM #__familytreetop_events as e,
                    #__familytreetop_families as f,
                    #__familytreetop_tree_links as l,
                    #__familytreetop_trees as t

                WHERE IF(
                    e.gedcom_id  IS NULL,
                            e.family_id = l.id AND l.type = 1,
                            e.gedcom_id  = l.id AND l.type = 0
                        ) AND  l.tree_id = t.id AND t.id = %s
                GROUP BY id";
        $db->setQuery(sprintf($sql, $tree_id));
        return $db->loadObjectList();
    }
    public function update(){
        return array('response'=>'events:update');
    }
    public function destroy(){
        return array('response'=>'events:destroy');
    }


}
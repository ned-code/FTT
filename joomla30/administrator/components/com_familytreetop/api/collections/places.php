<?php

class FamilyTreeTopApiCollectionPlaces {
    public function create(){
        return array('response'=>'places:create');
    }
    public function read(){
        $app = & JFactory::getApplication();
        $tree_id = $app->input->get('tree_id', false);
        if(!$tree_id) return array();

        $db = JFactory::getDbo();
        $sql = "SELECT p.*
                FROM #__familytreetop_places as p,
                    #__familytreetop_events as e,
                    #__familytreetop_families as f,
                    #__familytreetop_tree_links as l,
                    #__familytreetop_trees as t

                WHERE p.event_id = e.id
                        AND IF(
                            e.gedcom_id  IS NULL,
                            e.family_id = l.id AND l.type = 1,
                            e.gedcom_id  = l.id AND l.type = 0
                        ) AND  l.tree_id = t.id AND t.id = %s

                GROUP BY id";
        $db->setQuery(sprintf($sql, $tree_id));
        $rows = $db->loadObjectList();
        foreach($rows as $index => $row){
            $rows[$index]->id = (int)$row->id;
            $rows[$index]->event_id = (int)$row->event_id;
        }
        return $rows;
    }
    public function update(){
        return array('response'=>'places:update');
    }
    public function destroy(){
        return array('response'=>'places:destroy');
    }


}
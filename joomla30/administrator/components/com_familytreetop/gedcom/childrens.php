<?php
class FamilyTreeTopGedcomChildrensManager {
    protected $tree_id;
    protected $list_by_gedcom_id = array();
    protected $list_by_family_id = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;

        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT c.*
                FROM #__familytreetop_childrens as c, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE c.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id;
            $db->setQuery($sql);
            $rows = $db->loadAssocList('id');

            $this->list_by_gedcom_id = $this->getList('gedcom_id', $rows);
            $this->list_by_family_id = $this->getList('gedcom_id', $rows);
        }
    }

    protected function getList($type, $rows){
        if(empty($rows)) return array();
        $result = array();
        foreach($rows as $key => $row){
            if(isset($row[$type])){
                $result[$row[$type]][$key] = $row;
            }
        }
        return $result;
    }

    public function updateList(&$row){
        $data = array();
        $data['id'] = $row->id;
        $data['gedcom_id'] = $row->gedcom_id;
        $data['family_id'] = $row->family_id;

        $this->list_by_family_id[$row->family_id][$row->id] = $data;
        $this->list_by_gedcom_id[$row->gedcom_id][$row->id] = $data;
    }

    public function get($id){
        if(isset($this->list_by_family_id[$id])){
            $result = array();
            foreach( $this->list_by_family_id[$id] as $key => $value)
                $result[$key] = $value['gedcom_id'];
            return $result;
        }
    }

    public function save($family_id, $data){
        if(empty($data) || empty($family_id)) return false;
        foreach($data as $gedcom_id){
            $this->create($family_id, $gedcom_id);
        }
    }

    public function create($family_id, $gedcom_id){
        if(empty($family_id) || empty($gedcom_id)) return false;
        foreach($this->list_by_family_id[$family_id] as $key => $value){
            if($value['gedcom_id'] == $gedcom_id){
                return false;
            }
        }
        $row = new FamilyTreeTopChildrens();
        $row->family_id = $family_id;
        $row->gedcom_id = $gedcom_id;
        $row->save();

        $this->updateList($row);
        return $row;
    }

}

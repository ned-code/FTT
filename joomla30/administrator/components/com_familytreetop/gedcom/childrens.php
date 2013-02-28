<?php
class FamilyTreeTopGedcomChildrensManager {
    protected $list;
    protected $tree_id;
    protected $type;

    public function __construct($tree_id, $type){
        $this->tree_id = $tree_id;
        $this->type = $type;

        $db = JFactory::getDbo();
        $sql = "SELECT c.*
                FROM #__familytreetop_childrens as c, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE c.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id;
        $db->setQuery($sql);
        $rows = $db->loadAssocList('id');

        $list = array(
            'Individual' => array(),
            'Family' => array(),
            'default' => array()
        );
        $list['default'] = $rows;
        foreach($rows as $row){
            $this->addRow($list, 'Individual', $row);
            $this->addRow($list, 'Family', $row);
        }
        $this->list = $list;
    }

    protected function addRow(&$list, $type, $row){
        $ch = ($type == "Family")?"family_id":"gedcom_id";
        if(isset($row[$ch]) && $row[$ch] != null){
            $list[$type][$row[$ch]][] = $row;
        }
    }

    public function get($id = null){
        $list = $this->list[$this->type];
        if(isset($list[$id])){
            return $list[$id];
        }
    }

    public function save($family_id, $childrens){
        if(!empty($childrens)){
            foreach($childrens as $gedcom_id){
                $this->create($family_id, $gedcom_id);
            }
        }
    }

    public function create($family_id, $gedcom_id){
        if(empty($gedcom_id)) return false;
        $list = $this->list['Individual'];
        if(isset($list[$gedcom_id])){
            $families = $list[$gedcom_id];
            foreach($families as $row){
                if($row['family_id'] == $family_id){
                    return false;
                }
            }
        }
        $row = new FamilyTreeTopChildrens();
        $row->family_id = $family_id;
        $row->gedcom_id = $gedcom_id;
        $row->save();
        return $row;
    }
}

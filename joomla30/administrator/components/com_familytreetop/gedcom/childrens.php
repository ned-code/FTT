<?php
class FamilyTreeTopGedcomChildrensManager {
    protected $tree_id;
    protected $list = array();
    protected $list_by_gedcom_id = array();
    protected $list_by_family_id = array();
    protected $cache_list = array();
    protected $cache_list_by_gedcom_id = array();
    protected $cache_list_by_family_id = array();

    public function __construct($tree_id){
        $this->tree_id = $tree_id;

        if(!empty($tree_id)){
            $db = JFactory::getDbo();
            $sql = "SELECT c.*
                FROM #__familytreetop_childrens as c, #__familytreetop_tree_links as l, #__familytreetop_trees as t
                WHERE c.gedcom_id = l.id AND l.tree_id = t.id AND t.id = " . $tree_id;
            $db->setQuery($sql);
            $rows = $db->loadAssocList('id');

            $this->list =  $this->sortList('id', $rows);
            $this->list_by_gedcom_id = $this->sortList('gedcom_id', $rows);
            $this->list_by_family_id = $this->sortList('family_id', $rows);
        }
    }

    protected function sortList($type, $rows){
        if(empty($rows)) return array();
        $result = array();
        foreach($rows as $key => $row){
            $result[$row[$type]][] = $row;
        }
        return $result;
    }

    public function updateList(&$row){
        if(empty($row->id)) return false;
        $data = array();
        $data['id'] = $row->id;
        $data['gedcom_id'] = $row->gedcom_id;
        $data['family_id'] = $row->family_id;

        $this->list[$row->id][] = $data;
        $this->list_by_family_id[$row->family_id][] = $data;
        $this->list_by_gedcom_id[$row->gedcom_id][] = $data;
    }

    public function removeFromList($id){
        if(isset($this->list[$id])){
            unset($this->list[$id]);
        }
    }
    public function removeFromGedcomList($gedcom_id){
        if(isset($this->list_by_gedcom_id[$gedcom_id])){
            $list = $this->list_by_gedcom_id[$gedcom_id];
            unset($this->list_by_gedcom_id[$gedcom_id]);
            foreach($list as $item){
                if(isset($this->list_by_family_id[$item['family_id']])){
                    $familyList = $this->list_by_family_id[$item['family_id']];
                    foreach($familyList as $index => $e){
                        if($e['gedcom_id'] == $gedcom_id){
                            unset($this->list_by_family_id[$item['family_id']][$index]);
                        }
                    }
                }
                $this->removeFromList($item['id']);
            }
        }
    }
    public function removeFromFamilyList($family_id){
        if(isset($this->list_by_family_id[$family_id])){
            $list = $this->list_by_family_id[$family_id];
            unset($this->list_by_family_id[$family_id]);
            foreach($list as $item){
                if(isset($this->list_by_gedcom_id[$item['gedcom_id']])){
                    $indList = $this->list_by_gedcom_id[$item['gedcom_id']];
                    foreach($indList as $index => $e){
                        if($e['family_id'] == $family_id){
                            unset($this->list_by_gedcom_id[$item['gedcom_id']][$index]);
                        }
                    }
                }
                $this->removeFromList($item['id']);
            }
        }
    }

    public function get($id = false){
        $result = array();
        if($id && isset($this->list_by_family_id[$id])){
            foreach($this->list_by_family_id[$id] as $key => $value)
                $result[$key] = $value['gedcom_id'];

        }
        return $result;
    }

    public function deleteByFamilyId($family_id){
        $childrens = FamilyTreeTopChildrens::find('all', array('conditions' => array('family_id=?', $family_id)) );
        foreach($childrens as $child){
            $child->delete();
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
        if(isset($this->list_by_family_id[$family_id])){
            foreach($this->list_by_family_id[$family_id] as $key => $value){
                if($value['gedcom_id'] == $gedcom_id){
                    return false;
                }
            }
        }
        $row = new FamilyTreeTopChildrens();
        $row->family_id = $family_id;
        $row->gedcom_id = $gedcom_id;
        $row->save();

        $this->updateList($row);
        return $row;
    }

    public function getViewList($individuals){
        $list = $this->list;
        $listByGedcomId = $this->list_by_gedcom_id;
        $listByFamilyId = $this->list_by_family_id;

        $all = array();
        $familyIds = array();
        $gedcomIds = array();

        foreach($list as $id => $value){
            if(isset($value[0]) && isset($individuals[$value[0]['gedcom_id']])){
                $all[$id] = $value;
            }
        }

        foreach($listByGedcomId as $id => $value){
            if(isset($value[0]) && isset($individuals[$value[0]['gedcom_id']])){
                $gedcomIds[$id] = $value;
            }
        }

        foreach($listByFamilyId as $familyId => $value){
            foreach($value as $item){
                if(isset($individuals[$item['gedcom_id']])){
                    if(!isset($familyIds[$familyId])){
                        $familyIds[$familyId] = array();
                    }
                    $familyIds[$familyId][] = $item;
                }
            }
        }

        return array(
            'all' => $all,
            'gedcom_id' => $gedcomIds,
            'family_id' => $familyIds
        );
    }

    public function getList(){
        return array(
            'all' => $this->list,
            'gedcom_id' => $this->list_by_gedcom_id,
            'family_id' => $this->list_by_family_id
        );
    }

    public function getChildrens($family_id){
        if(!empty($this->list_by_family_id[$family_id])){
            $list = $this->list_by_family_id[$family_id];
            return $list;
        }
        return false;
    }

    public function getChildrensByGedcomId($gedcom_id){
        $gedcom = GedcomHelper::getInstance();
        $families = $gedcom->families->getFamilies($gedcom_id);
        $childrens = array();
        foreach($families as $family){
            if(!empty($this->list_by_family_id[$family->family_id])){
                $item = $this->list_by_family_id[$family->family_id];
                foreach($item as $e){
                    $childrens[] = $e;
                }
            }
        }
        return $childrens;
    }

    public function getFamilyIdByGedcomId($gedcom_id){
        $list = $this->list_by_gedcom_id;
        if(isset($list[$gedcom_id]) && !empty($list[$gedcom_id])){
            $data = $list[$gedcom_id];
            return $data[0]['family_id'];
        }
        return false;
    }
}
